// // components/Reports.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import HomeHeader from "../components/HomeHeader";
// import Footer from "../components/Footer";
// import { getMyRestaurant, getOrders, getMenuByRestaurant } from "../services/apiService";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";
// import "../styles/Reports.css";
// import toast from "react-hot-toast";

// export default function Reports() {
//   const navigate = useNavigate();
//   const [restaurant, setRestaurant] = useState(null);
//   const [restaurantName, setRestaurantName] = useState("");
//   const [adminEmail, setAdminEmail] = useState("");
//   const [orders, setOrders] = useState([]);
//   const [menuItems, setMenuItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [reportType, setReportType] = useState("hotSelling");
//   const [timeRange, setTimeRange] = useState("monthly");
//   const [customStartDate, setCustomStartDate] = useState("");
//   const [customEndDate, setCustomEndDate] = useState("");
//   const [reportData, setReportData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/");
//           return;
//         }

//         const decoded = jwtDecode(token);
//         setAdminEmail(decoded.email);
//         setRestaurantName(decoded.restaurantName || "My Restaurant");

//         const [restaurantRes, ordersRes, menuRes] = await Promise.all([
//           getMyRestaurant(),
//           getOrders(),
//           getMenuByRestaurant(decoded.restaurantId || decoded.id)
//         ]);

//         setRestaurant(restaurantRes.restaurant);
//         setOrders(ordersRes.orders || []);
//         setMenuItems(menuRes.menu || []);
//         setLoading(false);
//       } catch (err) {
//         console.error("Fetch data failed:", err);
//         toast.error("Failed to load data");
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   // Process orders for reporting
//   const processedOrders = useMemo(() => {
//     return orders.map(order => ({
//       ...order,
//       orderDate: new Date(order.createdAt),
//       totalAmount: order.totalAmount || 0,
//       items: order.items || []
//     }));
//   }, [orders]);

//   // Filter orders by date range
//   const getFilteredOrders = () => {
//     const now = new Date();
//     let startDate, endDate = new Date();

//     switch (timeRange) {
//       case "weekly":
//         startDate = new Date(now);
//         startDate.setDate(now.getDate() - 7);
//         break;
//       case "monthly":
//         startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//         break;
//       case "yearly":
//         startDate = new Date(now.getFullYear(), 0, 1);
//         break;
//       case "custom":
//         if (!customStartDate || !customEndDate) {
//           toast.error("Please select both start and end dates");
//           return processedOrders;
//         }
//         startDate = new Date(customStartDate);
//         endDate = new Date(customEndDate);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       default:
//         startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//     }

//     return processedOrders.filter(order => {
//       const orderDate = new Date(order.orderDate);
//       return orderDate >= startDate && orderDate <= endDate;
//     });
//   };

//   // Generate Hot Selling Items Report
//   const generateHotSellingReport = () => {
//     const filteredOrders = getFilteredOrders();
//     const itemSales = {};

//     filteredOrders.forEach(order => {
//       order.items.forEach(item => {
//         const itemId = item.menuItemId || item._id;
//         const itemName = item.name;
//         const quantity = item.quantity || 1;
//         const price = item.price || 0;

//         if (!itemSales[itemId]) {
//           itemSales[itemId] = {
//             name: itemName,
//             quantity: 0,
//             revenue: 0,
//             orders: 0
//           };
//         }

//         itemSales[itemId].quantity += quantity;
//         itemSales[itemId].revenue += price * quantity;
//         itemSales[itemId].orders += 1;
//       });
//     });

//     const sortedItems = Object.values(itemSales)
//       .sort((a, b) => b.quantity - a.quantity)
//       .slice(0, 10);

//     return {
//       type: "hotSelling",
//       items: sortedItems,
//       totalOrders: filteredOrders.length,
//       totalRevenue: filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
//     };
//   };

//   // Generate Order Report
//   const generateOrderReport = () => {
//     const filteredOrders = getFilteredOrders();
    
//     // Daily breakdown
//     const dailyData = {};
//     const statusCount = {
//       placed: 0,
//       preparing: 0,
//       served: 0,
//       paid: 0,
//       completed: 0,
//       cancelled: 0
//     };

//     filteredOrders.forEach(order => {
//       const dateStr = order.orderDate.toISOString().split('T')[0];
//       if (!dailyData[dateStr]) {
//         dailyData[dateStr] = {
//           orders: 0,
//           revenue: 0
//         };
//       }
//       dailyData[dateStr].orders += 1;
//       dailyData[dateStr].revenue += order.totalAmount || 0;

//       // Count by status
//       if (statusCount.hasOwnProperty(order.status)) {
//         statusCount[order.status] += 1;
//       }
//     });

//     const dailyArray = Object.entries(dailyData).map(([date, data]) => ({
//       date,
//       ...data
//     })).sort((a, b) => a.date.localeCompare(b.date));

//     return {
//       type: "orderReport",
//       dailyData: dailyArray,
//       statusCount,
//       totalOrders: filteredOrders.length,
//       totalRevenue: filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
//       averageOrderValue: filteredOrders.length > 0 
//         ? filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0) / filteredOrders.length
//         : 0
//     };
//   };

//   // Generate Revenue Report
//   const generateRevenueReport = () => {
//     const filteredOrders = getFilteredOrders();
    
//     const revenueByDay = {};
//     const revenueByHour = Array(24).fill(0);

//     filteredOrders.forEach(order => {
//       const dateStr = order.orderDate.toISOString().split('T')[0];
//       const hour = order.orderDate.getHours();

//       if (!revenueByDay[dateStr]) {
//         revenueByDay[dateStr] = 0;
//       }
//       revenueByDay[dateStr] += order.totalAmount || 0;
//       revenueByHour[hour] += order.totalAmount || 0;
//     });

//     const revenueByDayArray = Object.entries(revenueByDay)
//       .map(([date, revenue]) => ({ date, revenue }))
//       .sort((a, b) => a.date.localeCompare(b.date));

//     return {
//       type: "revenueReport",
//       revenueByDay: revenueByDayArray,
//       revenueByHour,
//       totalRevenue: filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
//       peakHour: revenueByHour.indexOf(Math.max(...revenueByHour))
//     };
//   };

//   const handleGenerateReport = () => {
//     let report;
    
//     switch (reportType) {
//       case "hotSelling":
//         report = generateHotSellingReport();
//         break;
//       case "orderReport":
//         report = generateOrderReport();
//         break;
//       case "revenueReport":
//         report = generateRevenueReport();
//         break;
//       default:
//         report = generateHotSellingReport();
//     }

//     setReportData(report);
//   };

//   const handleExportCSV = () => {
//     if (!reportData) return;

//     let csvContent = "data:text/csv;charset=utf-8,";
    
//     switch (reportData.type) {
//       case "hotSelling":
//         csvContent += "Rank,Item Name,Quantity Sold,Revenue,Number of Orders\n";
//         reportData.items.forEach((item, index) => {
//           csvContent += `${index + 1},"${item.name}",${item.quantity},${item.revenue.toFixed(2)},${item.orders}\n`;
//         });
//         break;
//       case "orderReport":
//         csvContent += "Date,Orders,Revenue\n";
//         reportData.dailyData.forEach(day => {
//           csvContent += `${day.date},${day.orders},${day.revenue.toFixed(2)}\n`;
//         });
//         break;
//       case "revenueReport":
//         csvContent += "Date,Revenue\n";
//         reportData.revenueByDay.forEach(day => {
//           csvContent += `${day.date},${day.revenue.toFixed(2)}\n`;
//         });
//         break;
//     }

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", `${reportType}_${timeRange}_report.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//     toast.success("Report exported successfully!");
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("adminEmail");
//     localStorage.removeItem("restaurant");
//     navigate("/");
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR'
//     }).format(amount);
//   };

//   const getStatusDisplayText = (status) => {
//     switch (status) {
//       case "placed": return "Placed";
//       case "preparing": return "Preparing";
//       case "served": return "Served";
//       case "paid": return "Paid";
//       case "completed": return "Completed";
//       case "cancelled": return "Cancelled";
//       default: return status;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="reports-wrapper">
//         <HomeHeader
//           isAdminDashboard={true}
//           restaurantName={restaurantName}
//           adminEmail={adminEmail}
//           restaurant={restaurant}
//           onLogout={handleLogout}
//         />
//         <div className="loading-container">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-3">Loading reports...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="reports-wrapper">
//       <HomeHeader
//         isAdminDashboard={true}
//         restaurantName={restaurantName}
//         adminEmail={adminEmail}
//         restaurant={restaurant}
//         onLogout={handleLogout}
//       />

//       <main className="container-fluid mt-4">
//         <div className="reports-container">
//           <h2 className="reports-title mb-4">Analytics & Reports</h2>

//           {/* Report Controls */}
//           <div className="report-controls">
//             <div className="card-body">
//               <div className="row g-3">
//                 <div className="col-md-3">
//                   <label className="form-label">Report Type</label>
//                   <select 
//                     className="form-select"
//                     value={reportType}
//                     onChange={(e) => setReportType(e.target.value)}
//                   >
//                     <option value="hotSelling">Hot Selling Items</option>
//                     <option value="orderReport">Order Report</option>
//                     <option value="revenueReport">Revenue Report</option>
//                   </select>
//                 </div>

//                 <div className="col-md-3">
//                   <label className="form-label">Time Range</label>
//                   <select 
//                     className="form-select"
//                     value={timeRange}
//                     onChange={(e) => setTimeRange(e.target.value)}
//                   >
//                     <option value="weekly">Weekly</option>
//                     <option value="monthly">Monthly</option>
//                     <option value="yearly">Yearly</option>
//                     <option value="custom">Custom Range</option>
//                   </select>
//                 </div>

//                 {timeRange === "custom" && (
//                   <>
//                     <div className="col-md-3">
//                       <label className="form-label">Start Date</label>
//                       <input
//                         type="date"
//                         className="form-control"
//                         value={customStartDate}
//                         onChange={(e) => setCustomStartDate(e.target.value)}
//                       />
//                     </div>
//                     <div className="col-md-3">
//                       <label className="form-label">End Date</label>
//                       <input
//                         type="date"
//                         className="form-control"
//                         value={customEndDate}
//                         onChange={(e) => setCustomEndDate(e.target.value)}
//                       />
//                     </div>
//                   </>
//                 )}

//                 <div className="col-md-12 mt-3">
//                   <button 
//                     className="btn btn-primary me-2"
//                     onClick={handleGenerateReport}
//                   >
//                     Generate Report
//                   </button>
//                   {reportData && (
//                     <button 
//                       className="btn btn-success"
//                       onClick={handleExportCSV}
//                     >
//                       <i className="fas fa-download me-2"></i>
//                       Export CSV
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Report Summary */}
//           {reportData && (
//             <div className="report-summary mb-4">
//               <div className="row">
//                 <div className="col-md-3">
//                   <div className="stat-card">
//                     <div className="stat-icon total-orders">
//                       <i className="fas fa-clipboard-list"></i>
//                     </div>
//                     <div className="stat-content">
//                       <h3>{reportData.totalOrders}</h3>
//                       <p>Total Orders</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-md-3">
//                   <div className="stat-card">
//                     <div className="stat-icon revenue">
//                       <i className="fas fa-rupee-sign"></i>
//                     </div>
//                     <div className="stat-content">
//                       <h3>{formatCurrency(reportData.totalRevenue)}</h3>
//                       <p>Total Revenue</p>
//                     </div>
//                   </div>
//                 </div>
//                 {reportData.type === "orderReport" && (
//                   <div className="col-md-3">
//                     <div className="stat-card">
//                       <div className="stat-icon average">
//                         <i className="fas fa-calculator"></i>
//                     </div>
//                       <div className="stat-content">
//                         <h3>{formatCurrency(reportData.averageOrderValue)}</h3>
//                         <p>Average Order Value</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 {reportData.type === "revenueReport" && (
//                   <div className="col-md-3">
//                     <div className="stat-card">
//                       <div className="stat-icon peak">
//                         <i className="fas fa-chart-line"></i>
//                       </div>
//                       <div className="stat-content">
//                         <h3>{reportData.peakHour}:00</h3>
//                         <p>Peak Hour</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Reports Data */}
//           {reportData && (
//             <div className="report-data">
//               {reportData.type === "hotSelling" && (
//                 <div className="row mb-4">
//                   <div className="col-md-12">
//                     <div className="chart-card">
//                       <h4>Top Selling Items</h4>
//                       <div className="table-responsive">
//                         <table className="table table-striped">
//                           <thead>
//                             <tr>
//                               <th>Rank</th>
//                               <th>Item Name</th>
//                               <th>Quantity Sold</th>
//                               <th>Revenue</th>
//                               <th>Orders</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {reportData.items.map((item, index) => (
//                               <tr key={index}>
//                                 <td>
//                                   <span className={`rank-badge ${index < 3 ? 'top-three' : ''}`}>
//                                     {index + 1}
//                                   </span>
//                                 </td>
//                                 <td className="item-name">{item.name}</td>
//                                 <td>
//                                   <span className="quantity-badge">{item.quantity}</span>
//                                 </td>
//                                 <td className="revenue-amount">{formatCurrency(item.revenue)}</td>
//                                 <td>
//                                   <span className="orders-count">{item.orders}</span>
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {reportData.type === "orderReport" && (
//                 <div className="row mb-4">
//                   <div className="col-md-8">
//                     <div className="chart-card">
//                       <h4>Daily Order Trends</h4>
//                       <div className="table-responsive">
//                         <table className="table table-striped">
//                           <thead>
//                             <tr>
//                               <th>Date</th>
//                               <th>Orders</th>
//                               <th>Revenue</th>
//                               <th>Average</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {reportData.dailyData.map((day, index) => (
//                               <tr key={index}>
//                                 <td>{new Date(day.date).toLocaleDateString()}</td>
//                                 <td>
//                                   <span className="orders-badge">{day.orders}</span>
//                                 </td>
//                                 <td className="revenue-amount">{formatCurrency(day.revenue)}</td>
//                                 <td>{formatCurrency(day.revenue / day.orders)}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="chart-card">
//                       <h4>Order Status Distribution</h4>
//                       <div className="status-distribution">
//                         {Object.entries(reportData.statusCount).map(([status, count]) => (
//                           <div key={status} className="status-item">
//                             <div className="status-info">
//                               <span className="status-name">{getStatusDisplayText(status)}</span>
//                               <span className="status-count">{count}</span>
//                             </div>
//                             <div className="status-bar-container">
//                               <div 
//                                 className={`status-bar ${status}`}
//                                 style={{
//                                   width: `${(count / reportData.totalOrders) * 100}%`
//                                 }}
//                               ></div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {reportData.type === "revenueReport" && (
//                 <div className="row">
//                   <div className="col-md-12">
//                     <div className="chart-card">
//                       <h4>Daily Revenue</h4>
//                       <div className="table-responsive">
//                         <table className="table table-striped">
//                           <thead>
//                             <tr>
//                               <th>Date</th>
//                               <th>Revenue</th>
//                               <th>Day of Week</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {reportData.revenueByDay.map((day, index) => (
//                               <tr key={index}>
//                                 <td>{new Date(day.date).toLocaleDateString()}</td>
//                                 <td className="revenue-amount">{formatCurrency(day.revenue)}</td>
//                                 <td>
//                                   <span className="day-badge">
//                                     {new Date(day.date).toLocaleDateString('en', { weekday: 'long' })}
//                                   </span>
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {!reportData && (
//             <div className="no-report">
//               <div className="text-center py-5">
//                 <i className="fas fa-chart-bar fa-3x text-muted mb-3"></i>
//                 <h4>No Report Generated</h4>
//                 <p className="text-muted">Select report type and time range, then click "Generate Report" to view analytics.</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }

// components/Reports.jsx
import React, { useState, useEffect } from "react";
import HomeHeader from "../components/HomeHeader";
import Footer from "../components/Footer";
// import { 
//   getSalesAnalytics, 
//   getTopSellingItems, 
//   getRevenueReport, 
//   getOrderStatistics,
//   exportReportToCSV 
// } from "../services/apiService";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../styles/Reports.css";
import toast from "react-hot-toast";
import { getTopSellingItems,getRevenueReport,exportReportToCSV,getSalesAnalytics,getOrderStatistics } from "../services/analyticsService";
export default function Reports() {
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState("hotSelling");
  const [timeRange, setTimeRange] = useState("monthly");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const decoded = jwtDecode(token);
    setAdminEmail(decoded.email);
    setRestaurantName(decoded.restaurantName || "My Restaurant");
  }, [navigate]);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      let response;
      const params = {
        timeRange,
        ...(timeRange === 'custom' && { startDate: customStartDate, endDate: customEndDate })
      };

      switch (reportType) {
        case "hotSelling":
          response = await getTopSellingItems(params.timeRange, params.startDate, params.endDate, 10);
          setReportData({
            type: "hotSelling",
            items: response.items || [],
            totalOrders: response.totalOrders || 0,
            totalRevenue: response.items?.reduce((sum, item) => sum + item.revenue, 0) || 0
          });
          break;
        
        case "orderReport":
          response = await getOrderStatistics(params.timeRange, params.startDate, params.endDate);
          setReportData({
            type: "orderReport",
            dailyData: response.dailyTrends || [],
            statusCount: response.statusDistribution || {},
            totalOrders: response.totalOrders || 0,
            totalRevenue: response.totalRevenue || 0,
            averageOrderValue: response.averageOrderValue || 0
          });
          break;
        
        case "revenueReport":
          response = await getRevenueReport(params.timeRange, params.startDate, params.endDate);
          setReportData({
            type: "revenueReport",
            revenueByDay: response.revenueByDay || [],
            revenueByHour: response.revenueByHour || [],
            totalRevenue: response.totalRevenue || 0,
            peakHour: response.peakHour || 0
          });
          break;
        
        default:
          break;
      }
      
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    if (!reportData) return;

    try {
      const params = {
        reportType,
        timeRange,
        ...(timeRange === 'custom' && { startDate: customStartDate, endDate: customEndDate })
      };

      const blob = await exportReportToCSV(
        params.reportType, 
        params.timeRange, 
        params.startDate, 
        params.endDate
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_${timeRange}_report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Report exported successfully!");
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Failed to export report");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("restaurant");
    navigate("/");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusDisplayText = (status) => {
    switch (status) {
      case "placed": return "Placed";
      case "preparing": return "Preparing";
      case "served": return "Served";
      case "paid": return "Paid";
      case "completed": return "Completed";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  return (
    <div className="reports-wrapper">
      <HomeHeader
        isAdminDashboard={true}
        restaurantName={restaurantName}
        adminEmail={adminEmail}
        onLogout={handleLogout}
      />

      <main className="container-fluid mt-4">
        <div className="reports-container">
          <h2 className="reports-title mb-4">Analytics & Reports</h2>

          {/* Report Controls */}
          <div className="report-controls card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="card mb-4">
                  <label className="form-label">Report Type</label>
                  <select 
                    className="form-select"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="hotSelling">Hot Selling Items</option>
                    <option value="orderReport">Order Report</option>
                    <option value="revenueReport">Revenue Report</option>
                  </select>
                </div>

                <div className="card mb-4">
                  <label className="form-label">Time Range</label>
                  <select 
                    className="form-select"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                {timeRange === "custom" && (
                  <>
                    <div className="col-md-3">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="col-md-12 mt-3">
                  <button 
                    className="btn btn-primary me-2"
                    onClick={handleGenerateReport}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Generating...
                      </>
                    ) : (
                      "Generate Report"
                    )}
                  </button>
                  {reportData && (
                    <button 
                      className="btn btn-success"
                      onClick={handleExportCSV}
                      disabled={loading}
                    >
                      <i className="fas fa-download me-2"></i>
                      Export CSV
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Report Summary */}
          {reportData && (
            <div className="report-summary mb-4">
              <div className="row">
                <div className="col-md-3">
                  <div className="stat-card">
                    <div className="stat-icon total-orders">
                      <i className="fas fa-clipboard-list"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{reportData.totalOrders}</h3>
                      <p>Total Orders</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stat-card">
                    <div className="stat-icon revenue">
                      <i className="fas fa-rupee-sign"></i>
                    </div>
                    <div className="stat-content">
                      <h3>{formatCurrency(reportData.totalRevenue)}</h3>
                      <p>Total Revenue</p>
                    </div>
                  </div>
                </div>
                {reportData.type === "orderReport" && (
                  <div className="col-md-3">
                    <div className="stat-card">
                      <div className="stat-icon average">
                        <i className="fas fa-calculator"></i>
                    </div>
                      <div className="stat-content">
                        <h3>{formatCurrency(reportData.averageOrderValue)}</h3>
                        <p>Average Order Value</p>
                      </div>
                    </div>
                  </div>
                )}
                {reportData.type === "revenueReport" && (
                  <div className="col-md-3">
                    <div className="stat-card">
                      <div className="stat-icon peak">
                        <i className="fas fa-chart-line"></i>
                      </div>
                      <div className="stat-content">
                        <h3>{reportData.peakHour}:00</h3>
                        <p>Peak Hour</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reports Data */}
          {reportData && (
            <div className="report-data">
              {reportData.type === "hotSelling" && (
                <div className="row mb-4">
                  <div className="col-md-12">
                    <div className="chart-card">
                      <h4>Top Selling Items</h4>
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Rank</th>
                              <th>Item Name</th>
                              <th>Quantity Sold</th>
                              <th>Revenue</th>
                              <th>Orders</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.items.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  <span className={`rank-badge ${index < 3 ? 'top-three' : ''}`}>
                                    {index + 1}
                                  </span>
                                </td>
                                <td className="item-name">{item.name}</td>
                                <td>
                                  <span className="quantity-badge">{item.quantity}</span>
                                </td>
                                <td className="revenue-amount">{formatCurrency(item.revenue)}</td>
                                <td>
                                  <span className="orders-count">{item.orders}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {reportData.type === "orderReport" && (
                <div className="row mb-4">
                  <div className="col-md-8">
                    <div className="chart-card">
                      <h4>Daily Order Trends</h4>
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Orders</th>
                              <th>Revenue</th>
                              <th>Average</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.dailyData.map((day, index) => (
                              <tr key={index}>
                                <td>{new Date(day.date).toLocaleDateString()}</td>
                                <td>
                                  <span className="orders-badge">{day.orders}</span>
                                </td>
                                <td className="revenue-amount">{formatCurrency(day.revenue)}</td>
                                <td>{day.orders > 0 ? formatCurrency(day.revenue / day.orders) : formatCurrency(0)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="chart-card">
                      <h4>Order Status Distribution</h4>
                      <div className="status-distribution">
                        {Object.entries(reportData.statusCount).map(([status, count]) => (
                          <div key={status} className="status-item">
                            <div className="status-info">
                              <span className="status-name">{getStatusDisplayText(status)}</span>
                              <span className="status-count">{count}</span>
                            </div>
                            <div className="status-bar-container">
                              <div 
                                className={`status-bar ${status}`}
                                style={{
                                  width: `${reportData.totalOrders > 0 ? (count / reportData.totalOrders) * 100 : 0}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {reportData.type === "revenueReport" && (
                <div className="row">
                  <div className="col-md-12">
                    <div className="chart-card">
                      <h4>Daily Revenue</h4>
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Revenue</th>
                              <th>Day of Week</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.revenueByDay.map((day, index) => (
                              <tr key={index}>
                                <td>{new Date(day.date).toLocaleDateString()}</td>
                                <td className="revenue-amount">{formatCurrency(day.revenue)}</td>
                                <td>
                                  <span className="day-badge">
                                    {new Date(day.date).toLocaleDateString('en', { weekday: 'long' })}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!reportData && !loading && (
            <div className="no-report">
              <div className="text-center py-5">
                <i className="fas fa-chart-bar fa-3x text-muted mb-3"></i>
                <h4>No Report Generated</h4>
                <p className="text-muted">Select report type and time range, then click "Generate Report" to view analytics.</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Generating report...</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}