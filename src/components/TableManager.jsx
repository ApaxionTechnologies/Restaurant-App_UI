// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const TableManager = () => {
//   const [restaurantData, setRestaurantData] = useState(null);  // To store restaurant data
//   const [tables, setTables] = useState(0);  // To store the number of tables
//   const [error, setError] = useState("");  // To display error messages
//   const restaurantEmail = localStorage.getItem("restaurantEmail");  // Get logged-in restaurant's email

//   useEffect(() => {
//     // Function to fetch restaurant data from the backend
//     const fetchRestaurantData = async () => {
//       try {
//         // Fixed: Backticks used for string interpolation
//         const response = await axios.get(`/api/restaurants/${restaurantEmail}`);
//         setRestaurantData(response.data.restaurant);
//         setTables(response.data.restaurant.tables);
//       } catch (err) {
//         console.error("Failed to fetch restaurant data", err);
//         setError("Error fetching restaurant data. Please try again later.");
//       }
//     };

//     if (restaurantEmail) {
//       fetchRestaurantData();  // Fetch data when the component is mounted
//     }
//   }, [restaurantEmail]);

//   const handleIncrement = () => setTables(tables + 1);  // Increment table count
//   const handleDecrement = () => setTables(tables > 0 ? tables - 1 : 0);  // Decrement table count

//   const handleSubmit = async () => {
//     try {
//       // Fixed: Backticks used for string interpolation
//       await axios.put(`/api/restaurants/${restaurantEmail}/tables`, { tables });  // Send updated tables to the backend
//       alert("Tables updated successfully!");  // Success message
//     } catch (err) {
//       alert("Failed to update tables");  // Error message
//     }
//   };

//   // Conditional rendering based on loading, error, and data availability
//   return (
//     <div className="container mt-4">
//       <h2 className="text-center">Manage Tables</h2>

//       {/* Displaying error message if there's an error */}
//       {error && <div className="alert alert-danger">{error}</div>}

//       {/* Display restaurant data */}
//       {restaurantData ? (
//         <div className="card mt-4" style={{ width: "18rem", margin: "0 auto" }}>
//           <div className="card-body">
//             <h5 className="card-title text-center">{restaurantData.restaurantName}</h5>
//             <h6 className="card-subtitle mb-2 text-muted text-center">Total Tables: {restaurantData.tables}</h6>

//             {/* Table Count Adjustment */}
//             <div className="d-flex justify-content-center align-items-center mt-4">
//               <button className="btn btn-outline-primary" onClick={handleDecrement}>-</button>
//               <span className="mx-3">{tables}</span>
//               <button className="btn btn-outline-primary" onClick={handleIncrement}>+</button>
//             </div>

//             {/* Save Button */}
//             <div className="text-center mt-4">
//               <button className="btn btn-primary" onClick={handleSubmit}>
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         // Loading message while fetching data
//         <p>Loading restaurant data...</p>
//       )}
//     </div>
//   );
// };

// export default TableManager;

 


// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const TableManager = () => {
//   const [restaurantData, setRestaurantData] = useState(null);  // To store restaurant data
//   const [tables, setTables] = useState(0);  // To store the number of tables
//   const [error, setError] = useState("");  // To display error messages
//   const restaurantEmail = localStorage.getItem("restaurantEmail");  // Get logged-in restaurant's email

//   useEffect(() => {
//     // Function to fetch restaurant data from the backend
//     const fetchRestaurantData = async () => {
//       try {
//         // URL-encode the email to handle special characters like '@'
//         const encodedEmail = encodeURIComponent(restaurantEmail);

//         // Make the GET request to the backend
//         const response = await axios.get(`http://localhost:5001/api/restaurants/${encodedEmail}`);
//         setRestaurantData(response.data.restaurant);
//         setTables(response.data.restaurant.tables);
//       } catch (err) {
//         console.error("Failed to fetch restaurant data", err);
//         setError("Error fetching restaurant data. Please try again later.");
//       }
//     };

//     if (restaurantEmail) {
//       fetchRestaurantData();  // Fetch data when the component is mounted
//     }
//   }, [restaurantEmail]);

//   // Optimistic Update: Update the table count immediately on increment or decrement
//   const handleIncrement = () => {
//     setTables((prevTables) => prevTables + 1);
//     updateTablesOnBackend(tables + 1);
//   };

//   const handleDecrement = () => {
//     setTables((prevTables) => (prevTables > 0 ? prevTables - 1 : 0));
//     updateTablesOnBackend(tables - 1);
//   };

//   // Update the table count on the backend after UI change
//   const updateTablesOnBackend = async (updatedTables) => {
//     try {
//       // URL-encode the email to handle special characters like '@'
//       const encodedEmail = encodeURIComponent(restaurantEmail);
//       await axios.put(`http://localhost:5001/api/restaurants/${encodedEmail}/tables`, { tables: updatedTables });
//     } catch (err) {
//       alert("Failed to update tables on backend"); // If the update fails, we show an error
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       // URL-encode the email to handle special characters like '@'
//       const encodedEmail = encodeURIComponent(restaurantEmail);
//       await axios.put(`http://localhost:5001/api/restaurants/${encodedEmail}/tables`, { tables });
//       alert("Tables updated successfully!");  // Success message
//     } catch (err) {
//       alert("Failed to update tables");  // Error message
//     }
//   };

//   // Conditional rendering based on loading, error, and data availability
//   return (
//     <div className="container mt-4">
//       <h2 className="text-center">Manage Tables</h2>

//       {/* Displaying error message if there's an error */}
//       {error && <div className="alert alert-danger">{error}</div>}

//       {/* Display restaurant data */}
//       {restaurantData ? (
//         <div className="card mt-4" style={{ width: "18rem", margin: "0 auto" }}>
//           <div className="card-body">
//             <h5 className="card-title text-center">{restaurantData.restaurantName}</h5>
//             <h6 className="card-subtitle mb-2 text-muted text-center">
//               Total Tables: {tables}
//             </h6>

//             {/* Table Count Adjustment */}
//             <div className="d-flex justify-content-center align-items-center mt-4">
//               <button className="btn btn-outline-primary" onClick={handleDecrement}>-</button>
//               <span className="mx-3">{tables}</span>
//               <button className="btn btn-outline-primary" onClick={handleIncrement}>+</button>
//             </div>

//             {/* Save Button */}
//             <div className="text-center mt-4">
//               <button className="btn btn-primary" onClick={handleSubmit}>
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         // Loading message while fetching data
//         <p>Loading restaurant data...</p>
//       )}
//     </div>
//   );
// };

// export default TableManager;





import React, { useState, useEffect } from "react";
import axios from "axios";

const TableManager = () => {
  const [restaurantData, setRestaurantData] = useState(null);  // To store restaurant data
  const [tables, setTables] = useState(0);  // To store the number of tables
  const [error, setError] = useState("");  // To display error messages
  const restaurantEmail = localStorage.getItem("restaurantEmail");  // Get logged-in restaurant's email

  useEffect(() => {
    // Function to fetch restaurant data from the backend
    const fetchRestaurantData = async () => {
      try {
        if (!restaurantEmail) {
          setError("Restaurant email is missing.");
          return;
        }

        // URL-encode the email to handle special characters like '@'
        const encodedEmail = encodeURIComponent(restaurantEmail);

        // Make the GET request to the backend
        const response = await axios.get(`http://localhost:5001/api/restaurants/${encodedEmail}`);
        if (response.data.restaurant) {
          setRestaurantData(response.data.restaurant);
          setTables(response.data.restaurant.tables);
        } else {
          setError("No restaurant data found for this email.");
        }
      } catch (err) {
        console.error("Failed to fetch restaurant data", err);
        setError("Error fetching restaurant data. Please try again later.");
      }
    };

    if (restaurantEmail) {
      fetchRestaurantData();  // Fetch data when the component is mounted
    } else {
      setError("Restaurant email is missing.");
    }
  }, [restaurantEmail]);

  // Optimistic Update: Update the table count immediately on increment or decrement
  const handleIncrement = () => {
    setTables((prevTables) => prevTables + 1);
    updateTablesOnBackend(tables + 1);
  };

  const handleDecrement = () => {
    setTables((prevTables) => (prevTables > 0 ? prevTables - 1 : 0));
    updateTablesOnBackend(tables - 1);
  };

  // Update the table count on the backend after UI change
  const updateTablesOnBackend = async (updatedTables) => {
    try {
      // URL-encode the email to handle special characters like '@'
      const encodedEmail = encodeURIComponent(restaurantEmail);
      await axios.put(`http://localhost:5001/api/restaurants/${encodedEmail}/tables`, { tables: updatedTables });
    } catch (err) {
      alert("Failed to update tables on backend"); // If the update fails, we show an error
    }
  };

  const handleSubmit = async () => {
    try {
      // URL-encode the email to handle special characters like '@'
      const encodedEmail = encodeURIComponent(restaurantEmail);
      await axios.put(`http://localhost:5001/api/restaurants/${encodedEmail}/tables`, { tables });
      alert("Tables updated successfully!");  // Success message
    } catch (err) {
      alert("Failed to update tables");  // Error message
    }
  };

  // Conditional rendering based on loading, error, and data availability
  return (
    <div className="container mt-4">
      <h2 className="text-center">Manage Tables</h2>

      {/* Displaying error message if there's an error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Display restaurant data */}
      {restaurantData ? (
        <div className="card mt-4" style={{ width: "18rem", margin: "0 auto" }}>
          <div className="card-body">
            <h5 className="card-title text-center">{restaurantData.restaurantName}</h5>
            <h6 className="card-subtitle mb-2 text-muted text-center">
              Total Tables: {tables}
            </h6>

            {/* Table Count Adjustment */}
            <div className="d-flex justify-content-center align-items-center mt-4">
              <button className="btn btn-outline-primary" onClick={handleDecrement}>-</button>
              <span className="mx-3">{tables}</span>
              <button className="btn btn-outline-primary" onClick={handleIncrement}>+</button>
            </div>

            {/* Save Button */}
            <div className="text-center mt-4">
              <button className="btn btn-primary" onClick={handleSubmit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Loading message while fetching data
        <p>Loading restaurant data...</p>
      )}
    </div>
  );
};

export default TableManager;
