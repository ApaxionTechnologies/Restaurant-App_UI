import { IoMenu } from "react-icons/io5";
import "./config.css";

import React, { useState, useMemo, useEffect } from "react";
import {
  addConfigItem,
  addTaxConfigList,
  configItemAction,
  editConfigItemDetails,
  flipCuisineStatus,
  getConfigList,
  getMyRestaurant,
  getTaxConfigList,
  taxConfigAction,
  updateTaxDefault,
  updateTaxStatus,
} from "../../services/apiService";
import { MdDeleteOutline, MdModeEdit } from "react-icons/md";
import { useCart } from "../../context/CartContext";
import { ConfigModal, TaxConfigModal } from "./ConfigModal";
import { FaCheck, FaTimes } from "react-icons/fa";
import TeaLoader from "../../components/Common/CupLoader";
import TableComp from "./tableComp";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

export default function App() {
  const [activeTab, setActiveTab] = useState("category");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [itemData, setItemData] = useState([]);
  const [taxData, setTaxData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editItemId, setEditItemId] = useState("");
  const [newName, setNewName] = useState("");
  const [updatedTaxValue, setUpdatedTaxValue] = useState("");
  const [isCuisineEnabled, setIsCuisineEnabled] = useState(false);
  const [isTaxEnabled, setIsTaxEnabled] = useState(false);
  const [showTaxInput, setShowTaxInput] = useState(false);
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [isEditingDiscount, setIsEditingDiscount] = useState(true);
  const { savediscount, discountPercentage, setDiscountPercentage } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    hasTax: false,
    taxValue: 0,
  });
  const [taxFormData, setTaxFormData] = useState({
    taxValue: 0,
  });

  const navigate = useNavigate();

  const [restaurantName, setRestaurantName] = useState(
    localStorage.getItem("restaurant") || "My Restaurant"
  );
  const [adminEmail, setAdminEmail] = useState("");
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await getMyRestaurant();
        setRestaurant(res.restaurant);
        setIsCuisineEnabled(res?.restaurant?.hasCuisines);
        setIsTaxEnabled(res?.restaurant?.isTaxInclusive);
      } catch (err) {
        console.error("Fetch /me failed -", err);
      }
    };
    fetchMe();
  }, []);
  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    const storedToken = localStorage.getItem("token");

    if (!storedEmail || !storedToken) {
      navigate("/");
    } else {
      setAdminEmail(storedEmail);
    }
  }, [navigate]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = itemData.slice(startIndex, endIndex);

  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setEditItemId(null);
    setSidebarOpen(false);
    setCurrentPage(1);
  };

  const fetchItemList = async () => {
    setLoading(true);
    try {
      const payload = {
        page: currentPage,
        limit: itemsPerPage,
        type: activeTab === "category" ? "category" : "cuisine",
        status: statusFilter,
      };
      if (searchTerm) {
        payload.search = searchTerm;
      }
      const res = await getConfigList(payload);

      setItemData(res?.data);
    } catch (err) {
      console.error(err);
      setItemData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaxConfigList = async () => {
    setLoading(true);
    try {
      const res = await getTaxConfigList();

      setTaxData(res?.data?.taxConfiguration);
    } catch (err) {
      console.error(err);
      setTaxData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "category") {
      fetchItemList();
      fetchTaxConfigList();
    } else if (activeTab === "cuisines") {
      fetchItemList();
    } else {
      fetchTaxConfigList();
    }
    // }, 400);
  }, [activeTab, searchTerm, statusFilter, currentPage, itemsPerPage]);

  const handleToggleStatus = (id) => {
    handleAction("status", id);
  };

  const handleDelete = (id) => {
    handleAction("delete", id);
  };
  const handleEdit = (id) => {
    setEditItemId("");
  };

  const handleModalClose = () => {
    setOpenModal(false);
    handleModalReset();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: formData?.name,
        type: formData?.type,
        hasTax: formData?.hasTax,
        taxValue: formData?.taxValue,
      };

      const res = await addConfigItem(payload);

      toast.success(res?.message || "Item added successfully");

      setOpenModal(false);
    } catch (err) {
      console.error(err);
      setItemData([]);
      toast.error(err?.message || "Error occured while adding item");
    } finally {
      setLoading(false);
      setOpenModal(false);
      fetchItemList();
      handleModalReset();
    }
  };

  const handleTaxConfigSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        taxValue: taxFormData?.taxValue,
      };

      const res = await addTaxConfigList(payload);
      toast.success(res?.message || "Tax config created successfully");

      setOpenModal(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Error occured while adding tax config");
      setTaxData([]);
    } finally {
      setLoading(false);
      setOpenModal(false);
      fetchTaxConfigList();
      handleModalReset();
    }
  };

  const handleCuisineFlip = async () => {
    const newValue = !isCuisineEnabled;
    setIsCuisineEnabled(newValue);
    setLoading(true);
    try {
      const payload = {
        hasCuisines: newValue,
      };

      const res = await flipCuisineStatus(payload);
      toast.success(res?.message || "Status updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Error occured while updating status");
      setItemData([]);
    } finally {
      setLoading(false);
      fetchItemList();
      handleModalReset();
    }
  };

  const handleTaxStatusChange = async () => {
    const newValue = !isTaxEnabled;
    setIsTaxEnabled(newValue);
    setLoading(true);
    try {
      const payload = {
        isTaxInclusive: newValue,
      };

      const res = await updateTaxStatus(payload);
      toast.success(res?.message || "Status updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Error occured while updating status");
      setTaxData([]);
    } finally {
      setLoading(false);
      fetchTaxConfigList();
      handleModalReset();
    }
  };

  const handleItemConfigDetails = async (id, newName, newTaxValue) => {
    setLoading(true);
    try {
      const payload = {
        classId: id,
        newName: newName,
        newTaxValue: newTaxValue,
      };

      const res = await editConfigItemDetails(payload);
      toast.success(res?.message || "Update successfull");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Error occured while updating");
      setItemData([]);
    } finally {
      setLoading(false);
      fetchItemList();
      handleModalReset();
    }
  };

  const updateDefault = async (itemId) => {
    setLoading(true);
    try {
      const payload = {
        itemId: itemId,
      };

      const res = await updateTaxDefault(payload);
      toast.success(res?.message || "Default tax value updated successfully");

      setOpenModal(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Error occured while updating default");
      setTaxData([]);
    } finally {
      setLoading(false);
      fetchTaxConfigList();
      handleModalReset();
    }
  };
  const handleAction = async (action, itemId) => {
    setLoading(true);
    try {
      const payload = {
        action: action,
        classId: itemId,
      };

      const res = await configItemAction(payload);
      toast.success(res?.message || "Updated successfull");

      setOpenModal(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Error occured while updating");
      setItemData([]);
    } finally {
      setLoading(false);
      fetchItemList();
      handleModalReset();
    }
  };

  const taxConfigItemAction = async (itemId, action) => {
    setLoading(true);
    try {
      const payload = {
        itemId: itemId,
        action: action,
        newValue: updatedTaxValue,
      };

      const res = await taxConfigAction(payload);
      toast.success(res?.message || "Action successfull");

      setOpenModal(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Error occured while performing action");
      setTaxData([]);
    } finally {
      setLoading(false);
      fetchTaxConfigList();
      handleModalReset();
      setEditItemId("");
    }
  };

  const handleSave = async (id) => {
    await handleItemConfigDetails(id, newName, updatedTaxValue);
    setEditItemId("");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const handleToggleCuisine = () => {
    setIsCuisineEnabled((prev) => !prev);
  };

  const handleModalReset = () => {
    setFormData({
      name: "",
      type: "",
    });
    setTaxFormData({
      taxValue: "",
    });
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const isEditing = row.original._id === editItemId;
          return isEditing ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="edit-input"
              autoFocus
            />
          ) : (
            <span className="order-number">{row.original.name}</span>
          );
        },
        size: 120,
        enableColumnFilter: true,
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ getValue }) => (
          <span className="table-number">{getValue()}</span>
        ),
        size: 70,
        enableColumnFilter: true,
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
          const value = row.original.isActive;
          return (
            <>
              <label className="statusToggle">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleToggleStatus(row.original._id)}
                />
                <span className="slider"></span>
              </label>
              <span className={`statusBadge ${value ? "active" : "inactive"}`}>
                {value ? "Active" : "Inactive"}
              </span>
            </>
          );
        },
        size: 90,
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => {
          const isEditing = row.original._id === editItemId;

          return (
            <div>
              {isEditing ? (
                row.original.name !== newName ||
                row.original.taxValue != updatedTaxValue ? (
                  <button
                    className="btnEdit"
                    onClick={() => handleSave(row.original._id)}
                  >
                    <FaCheck size={20} />
                  </button>
                ) : (
                  <button
                    className="btnEdit"
                    onClick={() => setEditItemId(null)}
                  >
                    <FaTimes size={20} />
                  </button>
                )
              ) : (
                <button
                  className="btnEdit"
                  onClick={() => {
                    setEditItemId(row.original._id);
                    setNewName(row.original.name);
                    setUpdatedTaxValue(row.original.taxValue);
                  }}
                >
                  <MdModeEdit size={20} />
                </button>
              )}

              <button
                className="btnDel"
                onClick={() => handleDelete(row.original._id)}
              >
                <MdDeleteOutline size={20} />
              </button>
            </div>
          );
        },
        size: 90,
      },
    ];

    if (activeTab === "category") {
      baseColumns.splice(2, 0, {
        accessorKey: "taxValue",
        header: "Tax",
        cell: ({ row }) => {
          const isEditing = row.original._id === editItemId;
          return isEditing ? (
            <select
              value={updatedTaxValue ?? row.original.taxValue}
              onChange={(e) => setUpdatedTaxValue(Number(e.target.value))}
              className="select-input"
            >
              <option value="">Select Tax</option>
              {taxData.length > 0 &&
                taxData.map((item) => (
                  <option value={item.value}>{item.value}</option>
                ))}
            </select>
          ) : (
            <span className="table-number">{row.original.taxValue}%</span>
          );
        },
        size: 90,
        enableColumnFilter: true,
      });
    }

    return baseColumns;
  }, [editItemId, newName, activeTab, updatedTaxValue]);

  const columnsForTax = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: "value",
        header: "Tax Value",
        cell: ({ row }) => {
          const isEditing = row.original._id === editItemId;
          return isEditing ? (
            <input
              type="number"
              value={updatedTaxValue}
              onChange={(e) => {
                const raw = e.target.value;

                const num = parseFloat(raw);
                let newValue;
                if (isNaN(num)) {
                  newValue = "";
                } else {
                  newValue = Math.min(100, Math.max(0, num));
                }
                setUpdatedTaxValue(newValue);
              }}
              min="1"
              max="100"
              className="edit-input"
              autoFocus
            />
          ) : (
            <span className="order-number">{row.original.value}</span>
          );
        },
        size: 120,
        enableColumnFilter: true,
      },
      {
        accessorKey: "isDefault",
        header: "Default",
        cell: ({ row }) => {
          const value = row.original.isDefault;
          return (
            <>
              <label className="statusToggle">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => updateDefault(row.original._id)}
                />
                <span className="slider"></span>
              </label>
              <span className={`statusBadge ${value ? "active" : "inactive"}`}>
                {value ? "Default" : ""}
              </span>
            </>
          );
        },
        size: 90,
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => {
          const isEditing = row.original._id === editItemId;

          return (
            <div>
              {isEditing ? (
                row.original.name !== newName ? (
                  <button
                    className="btnEdit"
                    onClick={() =>
                      taxConfigItemAction(row.original._id, "update")
                    }
                  >
                    <FaCheck size={20} />
                  </button>
                ) : (
                  <button
                    className="btnEdit"
                    onClick={() => setEditItemId(null)}
                  >
                    <FaTimes size={20} />
                  </button>
                )
              ) : (
                <button
                  className="btnEdit"
                  onClick={() => {
                    setEditItemId(row.original._id);
                    setUpdatedTaxValue(row.original.value);
                  }}
                >
                  <MdModeEdit size={20} />
                </button>
              )}

              <button
                className="btnDel"
                onClick={() => taxConfigItemAction(row.original._id, "delete")}
              >
                <MdDeleteOutline size={20} />
              </button>
            </div>
          );
        },
        size: 90,
      },
    ];

    return baseColumns;
  }, [editItemId, updatedTaxValue, activeTab]);

  return (
    <>
      {/* <HomeHeader
        isAdminDashboard={true}
        restaurantName={restaurantName}
        adminEmail={adminEmail}
        onLogout={handleLogout}
        restaurant={restaurant}
      /> */}
      <div className="app">
        {/* Mobile menu toggle */}
        <button className="menuToggle" onClick={toggleSidebar}>
          <IoMenu />
        </button>

        {/* Overlay for mobile */}
        <div
          className={`overlay ${sidebarOpen ? "show" : ""}`}
          onClick={closeSidebar}
        />

        {/* Sidebar */}
        <nav className={`sideNav ${sidebarOpen ? "show" : ""}`}>
          <div className="navTabs">
            <button
              className={`navTab ${activeTab === "category" ? "active" : ""}`}
              onClick={() => handleTabChange("category")}
            >
              Category
            </button>
            <button
              className={`navTab ${activeTab === "cuisines" ? "active" : ""}`}
              onClick={() => handleTabChange("cuisines")}
            >
              Cuisines
            </button>
            <button
              className={`navTab ${activeTab === "discount" ? "active" : ""}`}
              onClick={async () => {
                handleTabChange("discount");
                setShowDiscountInput(true);
                await savediscount();
              }}
            >
              Discount
            </button>
            <button
              className={`navTab ${activeTab === "tax" ? "active" : ""}`}
              onClick={() => handleTabChange("tax")}
            >
              Tax
            </button>
          </div>
        </nav>

        {/* Main content */}
        <main className="mainContent">
          <div className="contentHeader">
            <div className="controls-wrapper">
              <div className="heading-wrapper">
                <h1 className="pageTitle">
                  {activeTab === "category"
                    ? "Categories"
                    : activeTab === "cuisines"
                    ? "Cuisines"
                    : "Tax"}{" "}
                  Management
                </h1>
                {activeTab === "cuisines" && (
                  <label className="statusToggle">
                    <input
                      type="checkbox"
                      checked={isCuisineEnabled}
                      onChange={handleCuisineFlip}
                    />
                    <span className="slider"></span>
                  </label>
                )}
                {activeTab === "tax" && (
                  <label className="statusToggle">
                    <input
                      type="checkbox"
                      checked={isTaxEnabled}
                      onChange={handleTaxStatusChange}
                    />
                    <span className="slider"></span>
                  </label>
                )}
              </div>
              {activeTab !== "discount" && (
                <div className="">
                  <button className="btn6r" onClick={() => setOpenModal(true)}>
                    + Add
                  </button>
                </div>
              )}
            </div>

            {/* Discount Input Panel */}
            {activeTab === "discount" && showDiscountInput ? (
              <div className="discount-panel">
                {isEditingDiscount ? (
                  <>
                    <label htmlFor="discountInput">Enter Discount %:</label>
                    <input
                      type="number"
                      id="discountInput"
                      placeholder="e.g. 10"
                      className="discount-input"
                      value={discountPercentage}
                      onChange={(e) =>
                        setDiscountPercentage(Number(e.target.value))
                      }
                    />
                    <br></br>
                    <br></br>
                    <button
                      className="btn6r"
                      onClick={async () => {
                        console.log("Saved Discount:", discountPercentage);
                        await savediscount();
                        setIsEditingDiscount(false);
                      }}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Saved Discount:</strong> {discountPercentage}%
                    </p>
                    <button
                      className="btn6r"
                      onClick={() => {
                        setIsEditingDiscount(true);
                      }}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            ) : loading ? (
              <TeaLoader />
            ) : activeTab === "category" || activeTab === "cuisines" ? (
              <TableComp data={itemData} columns={columns} />
            ) : (
              <TableComp data={taxData} columns={columnsForTax} />
            )}
          </div>
        </main>
      </div>
      {/* <Footer /> */}
      {(activeTab === "category" || activeTab === "cuisines") && (
        <ConfigModal
          isOpen={openModal}
          onClose={handleModalClose}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
        />
      )}
      {activeTab === "tax" && (
        <TaxConfigModal
          isOpen={openModal}
          onClose={handleModalClose}
          formData={taxFormData}
          setFormData={setTaxFormData}
          handleSubmit={handleTaxConfigSubmit}
        />
      )}
    </>
  );
}
