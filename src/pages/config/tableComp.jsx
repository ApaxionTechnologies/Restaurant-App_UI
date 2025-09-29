import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import "./table.css";
import { MdDeleteOutline, MdModeEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

const sampleData = [
  {
    serial: 1,
    name: "ORD-1001",
    type: "T1",
    status: false,
  },
  {
    serial: 2,
    name: "ORD-1002",
    type: "T3",
    status: true,
  },
  {
    serial: 3,
    name: "ORD-1003",
    type: "Takeaway",
    status: true,
  },
  {
    serial: 4,
    name: "ORD-1004",
    type: "T5",
    status: true,
  },
];

export default function TableComp({ data, columns }) {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [orders, setOrders] = useState(data);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(false);
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
  const [editRowId, setEditRowId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [restaurantId, setRestaurantId] = useState(null);

  const formatDate = () => {};

  const getStatusDisplayText = (status) => {
    switch (status) {
      case "All":
        return "All";
      case "active":
        return true;
      case "Inactive":
        return false;
      case "paid":
        return "Paid";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
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

  const handleSave = (serial, newName) => {
    // Call your API here
    console.log("Saving", serial, newName);

    // Example: after successful API update
    setEditRowId(null);
    setEditValue("");
  };

  const handleDelete = (serial) => {
    // Call delete API
    console.log("Deleting row:", serial);
  };

  // FIXED: Simplified pre-filtering logic
  const preFilteredData = useMemo(() => {
    let filtered = orders || [];

    // Apply status filter from dropdown
    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    // Apply completed/cancelled filter
    if (showCompletedCancelled) {
      filtered = filtered.filter(
        (order) => order.status === "completed" || order.status === "cancelled"
      );
    } else {
      // When checkbox is unchecked, only show active orders
      filtered = filtered.filter(
        (order) =>
          order.status === "placed" ||
          order.status === "preparing" ||
          order.status === "served" ||
          order.status === "paid"
      );
    }

    return filtered;
  }, [orders, selectedStatus, showCompletedCancelled]);

  const table = useReactTable({
    data: data,
    columns,
    state: {
      globalFilter,
      sorting,
      columnFilters,
      //   filterFns,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Defensive global filter: handle undefined/empty fields and return true when filter is empty
    globalFilterFn: (row, _columnId, filterValue) => {
      // If filter is empty, don't filter anything
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
      } catch (e) {
        // ignore formatting errors
      }

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
        {/* <HomeHeader
          isAdminDashboard={true}
          restaurantName={restaurantName}
          adminEmail={adminEmail}
          restaurant={restaurant}
          onLogout={handleLogout}
        /> */}
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
    // duplicate check
    const dup = editedItems.findIndex(
      (x, j) => j !== idx && (x.name || "").toLowerCase() === name.toLowerCase()
    );
    if (dup !== -1) return true;
    return false;
  });
  const canSave = activeCountForSave > 0 && !anyActiveInvalid;

  return (
    <>
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
                    </th>
                  ))}
                </tr>
                <tr>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.column.getCanFilter() ? (
                        header.column.id === "isActive" ? (
                          <select
                            value={header.column.getFilterValue() ?? ""}
                            onChange={(e) =>
                              header.column.setFilterValue(
                                e.target.value || undefined
                              )
                            }
                          >
                            <option value="">All</option>
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
                          </select>
                        ) : header.column.id === "name" && (
                          <input
                            type="text"
                            value={header.column.getFilterValue() ?? ""}
                            onChange={(e) =>
                              header.column.setFilterValue(e.target.value)
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    </>
  );
}
