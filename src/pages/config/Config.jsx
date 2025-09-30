
import { IoMenu } from "react-icons/io5";
import "./config.css";

import React, { useState, useMemo, useEffect } from "react";
import {
  addConfigItem,
  configItemAction,
  editConfigItemName,
  flipCuisineStatus,
  getConfigList,
  getMyRestaurant,
} from "../../services/apiService";
import HomeHeader from "../../components/HomeHeader";
import Footer from "../../components/Footer";
import { MdDeleteOutline, MdModeEdit } from "react-icons/md";
import ConfigModal from "./ConfigModal";
import { FaCheck, FaTimes } from "react-icons/fa";
import TeaLoader from "../../components/Common/CupLoader";
import TableComp from "./tableComp";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [activeTab, setActiveTab] = useState("category");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [itemData, setItemData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editItemId, setEditItemId] = useState("");
  const [newName, setNewName] = useState("");
  const [isCuisineEnabled, setIsCuisineEnabled] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    hasTax: false,
    taxValue: 0,
  });

  const navigate = useNavigate();

  const [restaurantName, setRestaurantName] = useState(
    localStorage.getItem("restaurant") || "My Restaurant"
  );
  const [adminEmail, setAdminEmail] = useState("");
  const [restaurant, setRestaurant] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("restaurant");
    navigate("/");
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await getMyRestaurant();
        setRestaurant(res.restaurant);
        setIsCuisineEnabled(res?.restaurant?.hasCuisines);
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

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = itemData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchItemList();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [activeTab, searchTerm, statusFilter, currentPage, itemsPerPage]);

  const handleToggleStatus = (id) => {
    handleAction("status", id);
  };

  const handleDelete = (id) => {
    handleAction("delete", id);
  };
  const handleEdit = (id) => {
    setEditItemId("");
    // handleAction("delete",id)
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

      setOpenModal(false);
    } catch (err) {
      console.error(err);
      setItemData([]);
    } finally {
      setLoading(false);
      fetchItemList();
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
    } catch (err) {
      console.error(err);
      setItemData([]);
    } finally {
      setLoading(false);
      fetchItemList();
      handleModalReset();
    }
  };
  const handleEditName = async (id, newName) => {
    setLoading(true);
    try {
      const payload = {
        classId: id,
        newName: newName,
      };

      const res = await editConfigItemName(payload);
    } catch (err) {
      console.error(err);
      setItemData([]);
    } finally {
      setLoading(false);
      fetchItemList();
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

      setOpenModal(false);
    } catch (err) {
      console.error(err);
      setItemData([]);
    } finally {
      setLoading(false);
      fetchItemList();
      handleModalReset();
    }
  };

  const handleSave = async (id) => {
    await handleEditName(id, newName);
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
    setCurrentPage(1); // Reset to first page when changing items per page
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
                row.original.name !== newName ? (
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
        cell: ({ getValue }) => (
          <span className="table-number">{getValue()}</span>
        ),
        size: 70,
        enableColumnFilter: true,
      });
    }

    return baseColumns;
  }, [editItemId, newName, activeTab]);

  return (
    <>
      <HomeHeader
        isAdminDashboard={true}
        restaurantName={restaurantName}
        adminEmail={adminEmail}
        onLogout={handleLogout}
        restaurant={restaurant}
      />
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
          </div>
        </nav>

        {/* Main content */}
        <main className="mainContent">
          <div className="contentHeader">
            <div className="controls-wrapper">
              <div className="heading-wrapper">
                <h1 className="pageTitle">
                  {activeTab === "category" ? "Categories" : "Cuisines"}{" "}
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
              </div>
              <div className="">
                <button className="btn6r" onClick={() => setOpenModal(true)}>
                  + Add
                </button>
              </div>
            </div>

            {/* Controls */}
            {loading ? (
              <TeaLoader />
            ) : (
              <TableComp data={itemData} columns={columns} />
            )}
          </div>
        </main>
      </div>
      <Footer />
      <ConfigModal
        isOpen={openModal}
        onClose={handleModalClose}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />
    </>
  );
}
