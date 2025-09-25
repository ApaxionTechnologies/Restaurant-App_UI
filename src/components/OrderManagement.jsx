import React, { useEffect, useState } from "react";
import HomeHeader from "../components/HomeHeader";
import Footer from "../components/Footer";
import { getMyRestaurant } from "../services/apiService";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { getOrders, updateOrderStatus } from "../services/apiService";


export default function OrderManagement() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchMe = async () => {
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

        if (res.restaurant?._id) {
        const ordersData = await getOrders(res.restaurant._id);
        setOrders(ordersData.orders || []);
      }
    } catch (err) {
      console.error("Fetch restaurant/orders failed -", err);
    }
  };
  fetchMe();
}, [navigate]);

  //       setOrders([
  //         { id: 1, table: "T1", items: ["Pizza", "Coke"], status: "Pending" },
  //         { id: 2, table: "T3", items: ["Burger"], status: "Preparing" },
  //         { id: 3, table: "T5", items: ["Pasta", "Water"], status: "Completed" },
  //       ]);
  //     } catch (err) {
  //       console.error("Fetch restaurant/orders failed -", err);
  //     }
  //   };
  //   fetchMe();
  // }, [navigate]);

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("adminEmail");
  localStorage.removeItem("restaurant");
  navigate("/"); // redirect to login/home
};

  // const handleUpdateStatus = (id, newStatus) => {
  //   setOrders((prev) =>
  //     prev.map((order) =>
  //       order.id === id ? { ...order, status: newStatus } : order
  //     )
  //   );
  // };

  const handleUpdateStatus = async (id, newStatus) => {
  try {
    await updateOrderStatus(id, newStatus);
    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, status: newStatus } : order
      )
    );
  } catch (err) {
    console.error("Failed to update status:", err);
  }
};


  return (
    <div className="order-management-wrapper">
      <HomeHeader
        isAdminDashboard={true}
        restaurantName={restaurantName}
        adminEmail={adminEmail}
        restaurant={restaurant}
        onLogout={handleLogout} 
      />

      <main className="container mt-5">
        <h2 className="fw-bold text-center">📦 Order Management</h2>
        <p className="lead text-muted text-center">
          Track and manage ongoing orders.
        </p>

        <div className="table-responsive mt-4">
          <table className="table table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Table</th>
                <th>Items</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.tableNumber}</td>
                   <td>{order.items.map(item => item.name).join(", ")}</td>
                  <td>{order.status}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleUpdateStatus(order.id, "Preparing")}
                    >
                      Preparing
                    </button>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleUpdateStatus(order.id, "Completed")}
                    >
                      Completed
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleUpdateStatus(order.id, "Cancelled")}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
