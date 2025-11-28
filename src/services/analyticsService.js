import API from "./api";

// export const getSalesAnalytics = (timeRange, startDate, endDate) =>
//   API.get("/analytics/sales", { params: { timeRange, startDate, endDate } });

// export const getTopSellingItems = (timeRange, startDate, endDate, limit = 10) =>
//   API.get("/analytics/top-items", { params: { timeRange, startDate, endDate, limit } });

// export const getRevenueReport = (timeRange, startDate, endDate) =>
//   API.get("/analytics/revenue", { params: { timeRange, startDate, endDate } });

// export const getOrderStatistics = (timeRange, startDate, endDate) =>
//   API.get("/analytics/order-stats", { params: { timeRange, startDate, endDate } });

// export const exportReportToCSV = (reportType, timeRange, startDate, endDate) =>
//   API.get("/analytics/export", {
//     params: { reportType, timeRange, startDate, endDate },
//     responseType: "blob",
//   });
export const getSalesAnalytics = async (timeRange, startDate, endDate) => {
  try {
    const res = await API.get("/analytics/sales", {
      params: {
        timeRange,
        startDate,
        endDate
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
    throw error.response?.data || error.message;
  }
};

export const getTopSellingItems = async (timeRange, startDate, endDate, limit = 10) => {
  try {
    const res = await API.get("/analytics/top-items", {
      params: {
        timeRange,
        startDate,
        endDate,
        limit
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching top selling items:", error);
    throw error.response?.data || error.message;
  }
};

export const getRevenueReport = async (timeRange, startDate, endDate) => {
  try {
    const res = await API.get("/analytics/revenue", {
      params: {
        timeRange,
        startDate,
        endDate
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching revenue report:", error);
    throw error.response?.data || error.message;
  }
};

export const getOrderStatistics = async (timeRange, startDate, endDate) => {
  try {
    const res = await API.get("/analytics/order-stats", {
      params: {
        timeRange,
        startDate,
        endDate
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Export functionality
export const exportReportToCSV = async (reportType, timeRange, startDate, endDate) => {
  try {
    const res = await API.get("/analytics/export", {
      params: {
        reportType,
        timeRange,
        startDate,
        endDate
      },
      responseType: 'blob'
    });
    return res.data;
  } catch (error) {
    console.error("Error exporting report:", error);
    throw error.response?.data || error.message;
  }
};
