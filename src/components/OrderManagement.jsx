import React, { useEffect, useState, useMemo, useRef } from "react";
import HomeHeader from "../components/HomeHeader";
import Footer from "../components/Footer";
// import {
//   getMyRestaurant,
//   getOrders,
//   updateOrderStatus,
//   updateOrderItems,
//   getMenuByRestaurant,
//   calculateBillPreview,
//   deleteOrder,
//   generateBill,
//   getBill,
// } from "../services/apiService";
import{ getMenuByRestaurant} from "../services/menuService";
import { getMyRestaurant } from "../services/restaurantService";
import{ getOrders,updateOrderStatus,updateOrderItems,calculateBillPreview,deleteOrder,generateBill,getBill} from "../services/orderService";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import "../styles/OrderManagement.css";
import toast from "react-hot-toast";
import ViewBillModal from "./billModal";

export default function OrderManagement() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    placed: 0,
    preparing: 0,
    served: 0,
    paid: 0,
    completed: 0,
    cancelled: 0,
  });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editedItems, setEditedItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showCompletedCancelled, setShowCompletedCancelled] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [openBillModal, setOpenBillModal] = useState(false);
  const [billData, setBillData] = useState([]);

  const [orderTotal, setOrderTotal] = useState(0);
  const [restaurantId, setRestaurantId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const decoded = jwtDecode(token);
        setAdminEmail(decoded.email);
        setRestaurantName(decoded.restaurantName || "My Restaurant");

        const res = await getMyRestaurant();
        setRestaurant(res.restaurant);
        if (res.restaurant && res.restaurant._id) {
          setRestaurantId(res.restaurant._id);
        }

        const ordersResponse = await getOrders();
        const ordersData = ordersResponse.orders || [];

        const transformedOrders = ordersData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((order, idx) => {
            const items = (order.items || []).map((item) => ({
              _id: item._id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              status: item.status || "active",
            }));

            return {
              id: order._id,
              orderNo: order.orderId || `ORD-${order.orderNo}`,
              table: `T${order.tableNumber}`,
              items,
              status: order.status,
              totalAmount: order.totalAmount,
              orderTime: new Date(order.createdAt).toISOString(),
              specialInstructions: order.instructions,
              serial: idx + 1,
            };
          });

        setOrders(transformedOrders);
        calculateStats(transformedOrders);
        setLoading(false);
      } catch (err) {
        console.error("Fetch restaurant/orders failed -", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);
  const billPreviewTimer = useRef(null);
  const [billPreview, setBillPreview] = useState({
    subtotal: 0,
    totalDiscount: 0,
    totalGst: 0,
    cgst: 0,
    sgst: 0,
    total: 0,
  });

  useEffect(() => {
    if (billPreviewTimer.current) clearTimeout(billPreviewTimer.current);

    billPreviewTimer.current = setTimeout(async () => {
      const activeItems = editedItems.filter((it) => it.status !== "cancelled");

      const normalized = activeItems
        .map((it) => ({
          menuItemId: it.menuItemId || it._id?.toString(),
          quantity: Number(it.qty ?? it.quantity ?? 1),
        }))
        .filter((it) => it.menuItemId);

      if (normalized.length === 0) {
        setOrderTotal(0);
        setBillPreview({
          subtotal: 0,
          totalDiscount: 0,
          totalGst: 0,
          cgst: 0,
          sgst: 0,
          total: 0,
        });
        return;
      }

      try {
        const bill = await calculateBillPreview(normalized);
        console.log("Backend bill result:", bill);

        setOrderTotal(Number(bill.total ?? bill.totalAmount ?? 0));

        setBillPreview({
          subtotal: bill.subtotal ?? 0,
          totalDiscount: bill.totalDiscount ?? 0,
          totalGst: bill.totalGst ?? 0,
          cgst: bill.cgst ?? 0,
          sgst: bill.sgst ?? 0,
          total: bill.total ?? 0,
        });
      } catch (error) {
        console.error("Error fetching bill preview:", error);
        setOrderTotal(0);
        setBillPreview({
          subtotal: 0,
          totalDiscount: 0,
          totalGst: 0,
          cgst: 0,
          sgst: 0,
          total: 0,
        });
      }
    }, 300);

    return () => {
      if (billPreviewTimer.current) clearTimeout(billPreviewTimer.current);
    };
  }, [editedItems]);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchMenu = async () => {
      try {
        const res = await getMenuByRestaurant(restaurantId);
        setMenuList(res.menu || []);
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    };
    fetchMenu();
  }, [restaurantId]);
  const handleEditOrder = async (order) => {
    if (!order || !order.items) return;

    const cloned = order.items.map((item) => {
      const menuItem = menuList.find(
        (m) => (m.name || "").toLowerCase() === (item.name || "").toLowerCase()
      );

      return {
        ...item,
        menuItemId:
          menuItem?._id?.toString() || item.menuItemId || item._id?.toString(),
        unitPrice: menuItem?.price || item.price,
        nameError: null,
      };
    });

    setEditingOrder({ ...order });
    setEditedItems(cloned);
    setIsEditing(true);

    const normalized = cloned
      .filter((it) => it.status !== "cancelled" && it.menuItemId)
      .map((it) => ({
        menuItemId: it.menuItemId,
        quantity: Number(it.quantity || 1),
      }));

    if (normalized.length > 0) {
      try {
        const bill = await calculateBillPreview(normalized);
        setOrderTotal(Number(bill.total ?? bill.totalAmount ?? 0));
        setBillPreview({
          subtotal: bill.subtotal ?? 0,
          totalDiscount: bill.totalDiscount ?? 0,
          totalGst: bill.totalGst ?? 0,
          cgst: bill.cgst ?? 0,
          sgst: bill.sgst ?? 0,
          total: bill.total ?? 0,
        });
      } catch (error) {
        console.error("Bill preview failed:", error);
      }
    } else {
      setOrderTotal(0);
      setBillPreview({
        subtotal: 0,
        totalDiscount: 0,
        totalGst: 0,
        cgst: 0,
        sgst: 0,
        total: 0,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setEditedItems([]);
    setIsEditing(false);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...editedItems];
    if (!updatedItems[index]) return;

    if (field === "name") {
      const typedRaw = (value || "").toString();
      const typed = typedRaw.trim();
      const typedLower = typed.toLowerCase();

      updatedItems[index].name = typedRaw;

      const duplicateIndex = updatedItems.findIndex(
        (it, idx) =>
          idx !== index && (it.name || "").toLowerCase() === typedLower
      );

      if (duplicateIndex !== -1) {
        updatedItems[index].nameError =
          "Already added. Increase quantity instead.";
        updatedItems[index].menuItemId = updatedItems[index].menuItemId || null;
      } else {
        const exactMatch = menuList.find(
          (m) => (m.name || "").toLowerCase() === typedLower
        );
        if (exactMatch) {
          updatedItems[index].unitPrice = exactMatch.price;
          updatedItems[index].menuItemId = exactMatch._id?.toString();
          updatedItems[index].type = exactMatch.type || "veg";
          const qty = Number(updatedItems[index].quantity || 1);
          updatedItems[index].price = exactMatch.price * qty;
          updatedItems[index].nameError = null;
        } else {
          const hasSubstringMatch = menuList.some((m) =>
            (m.name || "").toLowerCase().includes(typedLower)
          );
          updatedItems[index].nameError =
            typed.length >= 3 && !hasSubstringMatch
              ? "Item not available"
              : null;
        }
      }
    }

    if (field === "quantity") {
      const qty = parseInt(value || 0, 10) || 0;
      const prevQty = Number(updatedItems[index].quantity) || 1;
      updatedItems[index].quantity = qty;

      if (updatedItems[index].unitPrice) {
        updatedItems[index].price = updatedItems[index].unitPrice * qty;
      } else if (prevQty > 0) {
        const unit = (Number(updatedItems[index].price) || 0) / prevQty;
        updatedItems[index].price = unit * qty;
      } else {
        updatedItems[index].price = 0;
      }

      const nameLower = (updatedItems[index].name || "").toLowerCase();
      const duplicateIndex = updatedItems.findIndex(
        (it, idx) =>
          idx !== index && (it.name || "").toLowerCase() === nameLower
      );
      if (duplicateIndex !== -1) {
        updatedItems[index].nameError =
          "Already added. Increase quantity instead.";
      }
    }

    setEditedItems(updatedItems);
  };

  useEffect(() => {
    if (!isEditing || !menuList || menuList.length === 0) return;
    const validated = editedItems.map((it, idx) => {
      const name = (it.name || "").toString().trim();
      if (!name) return { ...it, nameError: null };

      const exact = menuList.find(
        (m) => (m.name || "").toLowerCase() === name.toLowerCase()
      );

      const duplicateIndex = editedItems.findIndex(
        (x, j) =>
          j !== idx && (x.name || "").toLowerCase() === name.toLowerCase()
      );
      if (duplicateIndex !== -1) {
        return {
          ...it,
          nameError:
            "This item is already added in the order. Increase its quantity instead.",
        };
      }

      if (exact) {
        const qty = Number(it.quantity || 1);
        return {
          ...it,
          unitPrice: exact.price,
          price: exact.price * qty,
          nameError: null,
        };
      } else {
        const hasSubstring = menuList.some((m) =>
          (m.name || "").toLowerCase().includes(name.toLowerCase())
        );
        if (name.length >= 3 && !hasSubstring) {
          return { ...it, nameError: "Item not available" };
        }
        return { ...it, nameError: null };
      }
    });

    setEditedItems(validated);
  }, [menuList]);

  const handleRemoveItem = async (index) => {
    if (!editingOrder) return;

    const updatedItems = [...editedItems];
    updatedItems.splice(index, 1);

    const activeItems = updatedItems.filter(
      (it) => it.menuItemId && it.status !== "cancelled"
    );

    if (activeItems.length === 0) {
      try {
        await deleteOrder(editingOrder.id);
        setEditedItems([]);
        setEditingOrder(null);
        setOrders((prev) => prev.filter((o) => o.id !== editingOrder.id));
        toast("Order deleted successfully.");
        handleCancelEdit();
      } catch (err) {
        console.error("Failed to delete order:", err);
        toast("Failed to delete order. Please try again.");
      }
      return;
    }

    try {
      const sanitizedItems = activeItems.map((it) => ({
        menuItemId: it.menuItemId,
        quantity: Number(it.quantity) || 1,
      }));

      await updateOrderItems(editingOrder.id, sanitizedItems);
      setEditedItems(updatedItems);

      let bill = {
        items: [],
        subtotal: 0,
        total: 0,
        totalGst: 0,
        cgst: 0,
        sgst: 0,
        totalDiscount: 0,
      };
      if (sanitizedItems.length > 0) {
        bill = await calculateBillPreview(sanitizedItems);
      }

      const updatedOrders = orders.map((o) => {
        if (o.id === editingOrder.id) {
          return {
            ...o,
            items: bill.items,
            subtotal: bill.subtotal,
            totalDiscount: bill.totalDiscount,
            totalGst: bill.totalGst,
            sgst: bill.sgst,
            cgst: bill.cgst,
            totalAmount: bill.total,
            status: o.status,
          };
        }
        return o;
      });

      setOrders(updatedOrders);
    } catch (err) {
      console.error("Failed to update items:", err);
      toast("Failed to update order. Please try again.");
    }
  };
  const handleSaveEdit = async () => {
    try {
      if (!editingOrder) {
        toast("No order selected for editing.");
        return;
      }

      const activeItems = editedItems.filter((it) => it.status !== "cancelled");

      if (activeItems.length === 0) {
        try {
          await deleteOrder(editingOrder.id);
          setEditedItems([]);
          setEditingOrder(null);
          setOrders((prev) => prev.filter((o) => o.id !== editingOrder.id));
          toast("✅ Order deleted successfully!");
          handleCancelEdit();
        } catch (err) {
          console.error("Failed to delete order:", err);
          toast("❌ Failed to delete order. Please try again.");
        }
        return;
      }

      const activeValid = activeItems.filter((it) => {
        const name = (it.name || "").toString().trim();
        const exact = menuList.find(
          (m) => (m.name || "").toLowerCase() === name.toLowerCase()
        );
        return exact && Number(it.quantity) > 0;
      });

      if (activeItems.length !== activeValid.length) {
        toast(
          "❌ Some items are invalid or do not exist in the menu. Please fix before saving."
        );
        const marked = editedItems.map((it) => {
          const name = (it.name || "").toString().trim();
          if (it.status === "cancelled") return it;
          const exact = menuList.find(
            (m) => (m.name || "").toLowerCase() === name.toLowerCase()
          );
          if (!exact) {
            const hasSubstring = menuList.some((m) =>
              (m.name || "").toLowerCase().includes(name.toLowerCase())
            );
            const nameError =
              !name || (name.length >= 3 && !hasSubstring)
                ? "Item not available"
                : "Select an item from menu";
            return { ...it, nameError };
          }
          return { ...it, nameError: null };
        });
        setEditedItems(marked);
        return;
      }

      const itemsForBackend = activeValid.map((it) => ({
        menuItemId: it.menuItemId,
        quantity: Number(it.quantity) || 1,
      }));

      await updateOrderItems(editingOrder.id, itemsForBackend);

      const bill = await calculateBillPreview(itemsForBackend);

      const updatedOrders = orders.map((order) =>
        order.id === editingOrder.id
          ? {
              ...order,
              items: bill.items,
              subtotal: bill.subtotal,
              totalDiscount: bill.totalDiscount,
              totalGst: bill.totalGst,
              sgst: bill.sgst,
              cgst: bill.cgst,
              totalAmount: bill.total,
            }
          : order
      );

      setOrders(updatedOrders);
      calculateStats(updatedOrders);
      handleCancelEdit();

      toast("✅ Order updated successfully!");
    } catch (error) {
      console.error("Failed to update order:", error);
      toast("❌ Failed to update order. Please try again.");
    }
  };

  const getStatusDisplayText = (status) => {
    switch (status) {
      case "placed":
        return "Placed";
      case "preparing":
        return "Preparing";
      case "served":
        return "Served";
      case "paid":
        return "Paid";
      case "billed":
        return "Billed";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const calculateStats = (ordersData) => {
    const stats = {
      total: ordersData.length,
      placed: ordersData.filter((order) => order.status === "placed").length,
      preparing: ordersData.filter((order) => order.status === "preparing")
        .length,
      served: ordersData.filter((order) => order.status === "served").length,
      paid: ordersData.filter((order) => order.status === "paid").length,
      completed: ordersData.filter((order) => order.status === "completed")
        .length,
      cancelled: ordersData.filter((order) => order.status === "cancelled")
        .length,
    };
    setStats(stats);
  };

  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const onOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target))
        setFilterOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("restaurant");
    navigate("/");
  };

  const handleUpdateStatus = async (orderNo, newStatus) => {
    try {
      await updateOrderStatus(orderNo, newStatus);

      const updatedOrders = orders.map((order) =>
        order.orderNo === orderNo ? { ...order, status: newStatus } : order
      );

      setOrders(updatedOrders);
      calculateStats(updatedOrders);
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast(" ❌ Failed to update order status. Please try again.");
    }
  };

  const generateBillData = async (orderId, orderNumber) => {
    try {
      const payload = {
        orderId: orderId,
      };
      const result = await generateBill(payload);

      if (result.bill) {
        toast.success("Bill generated");
        handleUpdateStatus(orderNumber, "billed");
      } else {
        toast.error("Bill generation failed");
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast(" ❌ Failed to update order status. Please try again.");
    }
  };

  const fetchBillData = async (orderId) => {
    try {
      const payload = {
        orderId: orderId,
      };
      const result = await getBill(payload);

      if (result) {
        toast.success(result?.message || "Bill fetched successfully");
        setBillData(result.data);
        setOpenBillModal(true);
      } else {
        setBillData([]);
        toast.error("Bill generation failed");
      }
    } catch (error) {
      console.error("Failed to fetch bill:", error);
      toast(" ❌ Failed to fetch bill. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    try {
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return "";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "placed":
        return "status-placed";
      case "preparing":
        return "status-preparing";
      case "served":
        return "status-served";
      case "paid":
        return "status-paid";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };
  const filterFns = {
    itemFilter: (row, columnId, filterValue) => {
      const items = row.original.items || [];
      if (!filterValue) return true;

      return items.some(
        (it) =>
          (it.name &&
            it.name.toLowerCase().includes(filterValue.toLowerCase())) ||
          (it.type && it.type.toLowerCase().includes(filterValue.toLowerCase()))
      );
    },
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "serial",
        header: "S.No",
        cell: ({ getValue }) => <span>{getValue()}</span>,
        size: 60,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        accessorKey: "orderNo",
        header: "Order ID.",
        cell: ({ getValue }) => (
          <span className="order-number">{getValue()}</span>
        ),
        size: 120,
        enableColumnFilter: true,
      },
      {
        accessorKey: "table",
        header: "Table",
        cell: ({ getValue }) => (
          <span className="table-number">{getValue()}</span>
        ),
        size: 70,
        enableColumnFilter: true,
      },
      {
        id: "items",
        header: "Items",
        accessorFn: (row) => row.items,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const search = filterValue.toLowerCase();
          const items = row.getValue(columnId) || [];
          return items.some(
            (it) =>
              (it.name && it.name.toLowerCase().includes(search)) ||
              (it.type && it.type.toLowerCase().includes(search))
          );
        },
        enableColumnFilter: true,
        enableSorting: false,
        cell: ({ row }) => {
          const items = row.original.items || [];
          const visibleItems = items.filter(
            (it) => it.status !== "cancelled" || showCompletedCancelled
          );

          return (
            <div className="items-list aligned-items">
              {visibleItems.length === 0 ? (
                <div className="no-visible-items">
                  <small>—</small>
                </div>
              ) : (
                visibleItems.map((item, idx) => (
                  <div key={idx} className="item-row">
                    <span className="item-quantity">{item.quantity}x</span>
                    <div
                      className="item-info"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <span
                        className={`veg-badge ${
                          item.type === "veg" ? "veg" : "nonveg"
                        }`}
                      />
                      <span className="item-name">{item.name}</span>
                    </div>
                    <span className="item-price">₹{item.price}</span>
                  </div>
                ))
              )}

              {row.original.specialInstructions && (
                <div className="special-instructions">
                  <small>
                    <i className="fas fa-info-circle me-1"></i>
                    {row.original.specialInstructions}
                  </small>
                </div>
              )}
            </div>
          );
        },
        size: 250,
      },

      {
        accessorKey: "totalAmount",
        header: "Total (₹)",
        cell: ({ row }) => (
          <span className="order-total">₹{row.original.totalAmount}</span>
        ),
        size: 90,
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;

          const value = String(row.getValue(columnId));
          const search = filterValue.trim();

          return value.includes(search);
        },
      },
      {
        accessorKey: "orderTime",
        header: "Order Time",
        cell: ({ getValue }) => formatDate(getValue()),
        size: 150,
        enableColumnFilter: true,
      },
      {
        accessorKey: "status",
        header: "Status",
        enableColumnFilter: true,
        cell: ({ getValue }) => (
          <span className={`order-status ${getStatusClass(getValue())}`}>
            {getStatusDisplayText(getValue())}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => {
          const order = row.original;
          return (
            <div className="order-actions">
              {["placed", "preparing"].includes(order.status) && (
                <button
                  className="btn btn-action edit"
                  onClick={() => handleEditOrder(order)}
                  title="Edit Order Items"
                >
                  <i className="fas fa-edit"></i>
                </button>
              )}

              {order.status === "placed" && (
                <>
                  <button
                    className="btn btn-action preparing"
                    onClick={() =>
                      handleUpdateStatus(order.orderNo, "preparing")
                    }
                    title="Mark as Preparing"
                  >
                    <i className="fas fa-utensils"></i>
                  </button>
                  <button
                    className="btn btn-action cancel"
                    onClick={() =>
                      handleUpdateStatus(order.orderNo, "cancelled")
                    }
                    title="Cancel Order"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </>
              )}
              {order.status === "preparing" && (
                <>
                  <button
                    className="btn btn-action served"
                    onClick={() => handleUpdateStatus(order.orderNo, "served")}
                    title="Mark as Served"
                  >
                    <i className="fas fa-concierge-bell"></i>
                  </button>
                  <button
                    className="btn btn-action cancel"
                    onClick={() =>
                      handleUpdateStatus(order.orderNo, "cancelled")
                    }
                    title="Cancel Order"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </>
              )}
              {order.status === "served" && (
                <button
                  className="btn btn-action paid"
                  onClick={() => generateBillData(order.id, order.orderNo)}
                  // onClick={() => handleUpdateStatus(order.orderNo, "billed")}
                  title="Generate Bill"
                >
                  <i className="fas fa-money-bill-wave"></i>
                </button>
              )}
              {order.status === "billed" && (
                <>
                  <button
                    className="btn btn-action complete"
                    onClick={() => fetchBillData(order.id)}
                    title="View Bill"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="btn btn-action bill"
                    onClick={() => handleUpdateStatus(order.orderNo, "paid")}
                    title="Mark as Paid"
                  >
                    <i className="fas fa-money-bill"></i>
                  </button>
                </>
              )}
              {order.status === "paid" && (
                <>
                  <button
                    className="btn btn-action complete"
                    onClick={() => fetchBillData(order.id)}
                    title="View Bill"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="btn btn-action complete"
                    onClick={() =>
                      handleUpdateStatus(order.orderNo, "completed")
                    }
                    title="Mark as Completed"
                  >
                    <i className="fas fa-check"></i>
                  </button>
                </>
              )}
              {order.status === "completed" && (
                <button
                  className="btn btn-action complete"
                  onClick={() => fetchBillData(order.id)}
                  title="View Bill"
                >
                  <i className="fas fa-eye"></i>
                </button>
              )}
            </div>
          );
        },
        size: 130,
      },
    ],
    [orders, showCompletedCancelled]
  );

  const preFilteredData = useMemo(() => {
    let filtered = orders || [];
    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }
    if (showCompletedCancelled) {
      filtered = filtered.filter(
        (order) => order.status === "completed" || order.status === "cancelled"
      );
    } else {
      filtered = filtered.filter(
        (order) =>
          order.status === "placed" ||
          order.status === "preparing" ||
          order.status === "served" ||
          order.status === "billed" ||
          order.status === "paid"
      );
    }

    return filtered;
  }, [orders, selectedStatus, showCompletedCancelled]);

  const table = useReactTable({
    data: preFilteredData,
    columns,
    state: {
      globalFilter,
      sorting,
      columnFilters,
      filterFns,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      if (
        !filterValue ||
        (typeof filterValue === "string" && filterValue.trim() === "")
      )
        return true;

      const searchValue = String(filterValue).toLowerCase();

      const original = row.original || {};

      const orderNo = (original.orderNo || "").toString().toLowerCase();
      if (orderNo.includes(searchValue)) return true;

      const tableVal = (original.table || "").toString().toLowerCase();
      if (tableVal.includes(searchValue)) return true;

      const items = Array.isArray(original.items) ? original.items : [];
      for (const item of items) {
        const name = item && item.name ? String(item.name).toLowerCase() : "";
        if (name.includes(searchValue)) return true;

        const qty =
          item && typeof item.quantity !== "undefined"
            ? String(item.quantity)
            : "";
        if (qty.includes(searchValue)) return true;

        const price =
          item && typeof item.price !== "undefined" ? String(item.price) : "";
        if (price.includes(searchValue)) return true;
      }

      const total =
        typeof original.total !== "undefined" && original.total !== null
          ? String(original.total)
          : "";
      if (total.includes(searchValue)) return true;

      try {
        const formatted = original.orderTime
          ? formatDate(original.orderTime).toLowerCase()
          : "";
        if (formatted.includes(searchValue)) return true;
      } catch (e) {}

      const statusText = (
        getStatusDisplayText(original.status) || ""
      ).toLowerCase();
      if (statusText.includes(searchValue)) return true;

      return false;
    },
  });
  useEffect(() => {
    if (table) {
      table.setColumnFilters([]);

      table.setPageIndex(0);
    }
  }, [selectedStatus, showCompletedCancelled, table]);

  useEffect(() => {
    if (table?.setPageIndex) table.setPageIndex(0);
  }, [globalFilter, table]);

  const handleClearAllFilters = () => {
    setGlobalFilter("");
    setSelectedStatus("all");
    setShowCompletedCancelled(false);
    if (table) {
      table.setColumnFilters([]);
      table.setPageIndex(0);
    }
  };

  if (loading) {
    return (
      <div className="order-management-wrapper">
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading orders...</p>
        </div>
      </div>
    );
  }
  const activeCountForSave = editedItems.filter(
    (it) => it.status !== "cancelled"
  ).length;
  const anyActiveInvalid = editedItems.some((it, idx) => {
    if (it.status === "cancelled") return false;
    const name = (it.name || "").toString().trim();
    if (!name) return true;
    const exact = menuList.find(
      (m) => (m.name || "").toLowerCase() === name.toLowerCase()
    );
    if (!exact) return true;

    const dup = editedItems.findIndex(
      (x, j) => j !== idx && (x.name || "").toLowerCase() === name.toLowerCase()
    );
    if (dup !== -1) return true;
    return false;
  });
  const canSave = activeCountForSave > 0 && !anyActiveInvalid;

  return (
    <div className="order-management-wrapper">
      <main className="container-fluid mt-3">
        <div className="dashboard-container">
          <h2 className="dashboard-title mb-4">Order Management</h2>
          <div className="stats-row">
            <div className="stat-item mb-3">
              <div className="stats-card">
                <div className="stats-icon total">
                  <i className="fas fa-clipboard-list"></i>
                </div>
                <div className="stats-content">
                  <h3>{stats.total}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
            </div>

            <div className="stat-item mb-3">
              <div className="stats-card">
                <div className="stats-icon placed">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stats-content">
                  <h3>{stats.placed}</h3>
                  <p>Placed</p>
                </div>
              </div>
            </div>

            <div className="stat-item mb-3">
              <div className="stats-card">
                <div className="stats-icon preparing">
                  <i className="fas fa-utensils"></i>
                </div>
                <div className="stats-content">
                  <h3>{stats.preparing}</h3>
                  <p>Preparing</p>
                </div>
              </div>
            </div>

            <div className="stat-item mb-3">
              <div className="stats-card">
                <div className="stats-icon served">
                  <i className="fas fa-concierge-bell"></i>
                </div>
                <div className="stats-content">
                  <h3>{stats.served}</h3>
                  <p>Served</p>
                </div>
              </div>
            </div>

            <div className="stat-item mb-3">
              <div className="stats-card">
                <div className="stats-icon paid">
                  <i className="fas fa-money-bill-wave"></i>
                </div>
                <div className="stats-content">
                  <h3>{stats.paid}</h3>
                  <p>Paid</p>
                </div>
              </div>
            </div>

            <div className="stat-item mb-3">
              <div className="stats-card">
                <div className="stats-icon completed">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stats-content">
                  <h3>{stats.completed}</h3>
                  <p>Completed</p>
                </div>
              </div>
            </div>

            <div className="stat-item mb-3">
              <div className="stats-card">
                <div className="stats-icon cancelled">
                  <i className="fas fa-times-circle"></i>
                </div>
                <div className="stats-content">
                  <h3>{stats.cancelled}</h3>
                  <p>Cancelled</p>
                </div>
              </div>
            </div>
          </div>

          <div className="filter-bar">
            <div className="filter-row">
              <div className="filter-left">
                <div className="checkbox-filters">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="showCompletedCancelled"
                      checked={showCompletedCancelled}
                      onChange={(e) =>
                        setShowCompletedCancelled(e.target.checked)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="showCompletedCancelled"
                    >
                      Show Completed & Cancelled (
                      {stats.completed + stats.cancelled})
                    </label>
                  </div>
                </div>
              </div>

              <div className="filter-center">
                <h3 className="filter-title">
                  Orders{" "}
                  {showCompletedCancelled
                    ? "(Completed & Cancelled)"
                    : "(Active)"}
                </h3>
              </div>

              <div className="filter-search">
                <div className="search-box-top">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Search across all orders..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                  />
                  {globalFilter && (
                    <button
                      className="btn-clear-search"
                      onClick={() => setGlobalFilter("")}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="filter-right">
                <div
                  className={`industrial-dropdown ${filterOpen ? "open" : ""}`}
                  ref={filterRef}
                >
                  <button
                    className="industrial-trigger"
                    onClick={() => setFilterOpen(!filterOpen)}
                    aria-haspopup="menu"
                    aria-expanded={filterOpen}
                    type="button"
                  >
                    <i className="fas fa-filter me-2"></i>
                    {selectedStatus === "all"
                      ? "All Status"
                      : getStatusDisplayText(selectedStatus)}
                    <i className="fas fa-chevron-down ms-2"></i>
                  </button>

                  <div
                    className="industrial-menu"
                    role="menu"
                    aria-hidden={!filterOpen}
                  >
                    <button
                      role="menuitem"
                      className={`industrial-option ${
                        selectedStatus === "all" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedStatus("all");
                        setFilterOpen(false);
                      }}
                      type="button"
                    >
                      <span>
                        <i className=" option-icon" aria-hidden="true"></i>
                        All Orders
                      </span>
                    </button>
                    <button
                      role="menuitem"
                      className={`industrial-option ${
                        selectedStatus === "placed" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedStatus("placed");
                        setFilterOpen(false);
                      }}
                      type="button"
                    >
                      <span>
                        <i className=" option-icon" aria-hidden="true"></i>
                        Placed
                      </span>
                      <span className="option-badge">{stats.placed}</span>
                    </button>
                    <button
                      role="menuitem"
                      className={`industrial-option ${
                        selectedStatus === "preparing" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedStatus("preparing");
                        setFilterOpen(false);
                      }}
                      type="button"
                    >
                      <span>
                        <i className=" option-icon" aria-hidden="true"></i>
                        Preparing
                      </span>
                      <span className="option-badge">{stats.preparing}</span>
                    </button>
                    <button
                      role="menuitem"
                      className={`industrial-option ${
                        selectedStatus === "served" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedStatus("served");
                        setFilterOpen(false);
                      }}
                      type="button"
                    >
                      <span>
                        <i className="option-icon" aria-hidden="true"></i>
                        Served
                      </span>
                      <span className="option-badge">{stats.served}</span>
                    </button>
                    <button
                      role="menuitem"
                      className={`industrial-option ${
                        selectedStatus === "paid" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedStatus("paid");
                        setFilterOpen(false);
                      }}
                      type="button"
                    >
                      <span>
                        <i className="option-icon" aria-hidden="true"></i>
                        Paid
                      </span>
                      <span className="option-badge">{stats.paid}</span>
                    </button>
                  </div>
                </div>
                {(globalFilter ||
                  selectedStatus !== "all" ||
                  showCompletedCancelled ||
                  columnFilters.length > 0) && (
                  <button
                    className="btn btn-outline-secondary btn-clear-all"
                    onClick={handleClearAllFilters}
                    title="Clear all filters"
                  ></button>
                )}
              </div>
            </div>
          </div>
          <div className="orders-table-container">
            {table.getRowModel().rows.length === 0 ? (
              <div className="no-orders">
                <i className="fas fa-inbox"></i>
                <h4>No orders found</h4>
                <p>
                  There are no orders matching your search or filter criteria.
                </p>
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleClearAllFilters}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table orders-table">
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <React.Fragment key={headerGroup.id}>
                        {/* Row for headers */}
                        <tr>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              style={{
                                width: header.column.columnDef.size,
                                cursor: header.column.getCanSort()
                                  ? "pointer"
                                  : "default",
                              }}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted()] ?? null}
                            </th>
                          ))}
                        </tr>
                        <tr>
                          {headerGroup.headers.map((header) => (
                            <th key={header.id}>
                              {header.column.getCanFilter() ? (
                                header.column.id === "status" ? (
                                  <select
                                    value={header.column.getFilterValue() ?? ""}
                                    onChange={(e) =>
                                      header.column.setFilterValue(
                                        e.target.value || undefined
                                      )
                                    }
                                  >
                                    <option value="">All</option>
                                    <option value="placed">Placed</option>
                                    <option value="preparing">Preparing</option>
                                    <option value="served">Served</option>
                                    <option value="paid">Paid</option>
                                  </select>
                                ) : (
                                  <input
                                    type="text"
                                    value={header.column.getFilterValue() ?? ""}
                                    onChange={(e) =>
                                      header.column.setFilterValue(
                                        e.target.value
                                      )
                                    }
                                    placeholder="Filter..."
                                    style={{ width: "80%" }}
                                  />
                                )
                              ) : null}
                            </th>
                          ))}
                        </tr>
                      </React.Fragment>
                    ))}
                  </thead>

                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="order-row">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="pagination-controls">
              <button
                className="btn btn-pagination"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <i className="fas fa-angle-double-left"></i>
              </button>
              <button
                className="btn btn-pagination"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <i className="fas fa-angle-left"></i>
              </button>
              <span className="page-info">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
              <button
                className="btn btn-pagination"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <i className="fas fa-angle-right"></i>
              </button>
              <button
                className="btn btn-pagination"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <i className="fas fa-angle-double-right"></i>
              </button>
            </div>
          </div>
        </div>
      </main>

      {isEditing && editingOrder && (
        <div className="modals-overlay active">
          <div className="modals-content">
            <div className="modals-header">
              <div className="order-info">
                <h3>Edit Order</h3>
                <div className="order-details">
                  <p>{editingOrder.orderNo}</p>
                  <span>/</span>
                  <p>{editingOrder.table}</p>
                </div>
              </div>
              <button className="btn-close" onClick={handleCancelEdit}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modals-body">
              <div className="add-item-wrapper">
                <button
                  type="button"
                  className="btn-add-item"
                  onClick={() => {
                    setEditedItems((prev) => [
                      ...prev,
                      {
                        name: "",
                        quantity: 1,
                        price: 0,
                        unitPrice: 0,
                        status: "active",
                        nameError: null,
                      },
                    ]);
                  }}
                >
                  <i className="fas fa-plus"></i> Add New Item
                </button>
              </div>
              <table className="edit-items-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price (₹)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {editedItems.map((item, index) => {
                    if (item.status === "cancelled" && !showCompletedCancelled)
                      return null;
                    return (
                      <tr
                        key={index}
                        className={
                          item.status === "cancelled" ? "cancelled" : ""
                        }
                      >
                        <td>
                          <div className="field-wrapper">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) =>
                                handleItemChange(index, "name", e.target.value)
                              }
                              list={`menu-suggestions-${index}`}
                              placeholder="Type item name..."
                              className={`item-name-input ${
                                item.nameError ? "error" : ""
                              }`}
                              disabled={item.status === "cancelled"}
                              autoComplete="off"
                            />
                            <datalist id={`menu-suggestions-${index}`}>
                              {menuList
                                .filter((m) =>
                                  (m.name || "")
                                    .toLowerCase()
                                    .includes((item.name || "").toLowerCase())
                                )
                                .filter((m) => {
                                  const mLower = (m.name || "").toLowerCase();
                                  return !editedItems.some(
                                    (it, i2) =>
                                      i2 !== index &&
                                      (it.name || "").toLowerCase() === mLower
                                  );
                                })
                                .map((m) => (
                                  <option key={m._id} value={m.name} />
                                ))}
                            </datalist>

                            {item.nameError && (
                              <div
                                className="error-message"
                                style={{ color: "red", fontSize: "12px" }}
                              >
                                <span>{item.nameError}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="qty-controls">
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() =>
                                handleItemChange(
                                  index,
                                  "quantity",
                                  Math.max(0, item.quantity - 1)
                                )
                              }
                              disabled={
                                item.status === "cancelled" ||
                                item.quantity === 0
                              }
                            >
                              -
                            </button>

                            <span className="qty-value">{item.quantity}</span>

                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() =>
                                handleItemChange(
                                  index,
                                  "quantity",
                                  Number(item.quantity) + 1
                                )
                              }
                              disabled={item.status === "cancelled"}
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td>
                          <input
                            type="number"
                            value={item.price}
                            readOnly
                            className="item-price-inputs"
                          />
                        </td>

                        <td>
                          <button
                            type="button"
                            className="btn-remove-item"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="bottom-bar">
                <div className="order-total-section">
                  <span>Order Total: </span>
                  <span className="total-amount">
                    ₹{billPreview.total?.toFixed(2) || "0.00"}
                  </span>
                  <div className="bill-details">
                    <div className="bill-line">
                      <span>Item Total:</span>
                      <span>₹{billPreview.subtotal?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="bill-line">
                      <span>Discount:</span>
                      <span>
                        -₹{billPreview.totalDiscount?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="bill-line">
                      <span>GST:</span>
                      <span>₹{billPreview.totalGst?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="bill-line">
                      <span>SGST:</span>
                      <span>₹{billPreview.sgst?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="bill-line">
                      <span>CGST:</span>
                      <span>₹{billPreview.cgst?.toFixed(2) || "0.00"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modals-footer">
              <button className="btn btn-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      <ViewBillModal
        isOpen={openBillModal}
        billPreview={billData}
        onClose={() => setOpenBillModal(false)}
      />
    </div>
  );
}
