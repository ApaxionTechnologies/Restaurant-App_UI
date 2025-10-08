import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import axios from "axios";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import HomeHeader from "../components/HomeHeader";
import Footer from "../components/Footer";
import { DownloadButton } from "../components/ExcelTemplate";
import { ItemCards } from "../components/ItemCards";
import { uploadBulkMenuItems } from "../services/apiService";
export const BulkItemUpload = () => {
  const [excelData, setExcelData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [sheetNames, setSheetNames] = useState([]);
  const [activeSheet, setActiveSheet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState();
  const [loading, setLoading] = useState(false);
  const [rejectedItems, setRejectedItems] = useState([]);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [validItemCount, setValidItemCount] = useState(0);
  const [rejectedItemCount, setRejectedItemCount] = useState(0);

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
    const storedEmail = localStorage.getItem("adminEmail");
    const storedToken = localStorage.getItem("token");

    if (!storedEmail || !storedToken) {
      navigate("/");
    } else {
      setAdminEmail(storedEmail);
    }
  }, [navigate]);

  const handleReset = () => {
    setExcelData(null);
    setFileName("");
    setSheetNames([]);
    setActiveSheet("");
    setIsLoading(false);
    setError("");
    setUploadedFile();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      console.log("File dropped:", file.name);
      processFile(file);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    processFile(file);

    event.target.value = "";
  };

  const processFile = (file) => {
    setRejectedItems([]);
    handleReset();
    setUploadedFile(file);

    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      setError("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    setIsLoading(true);
    setError("");
    setFileName(file.name);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          const sheets = workbook.SheetNames;
          setSheetNames(sheets);

          const allSheetsData = {};
          sheets.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            allSheetsData[sheetName] = jsonData;
          });

          setExcelData(allSheetsData);
          setActiveSheet(sheets[0]);
          setIsLoading(false);
        } catch (err) {
          console.error(err);
          setError(
            "Failed to parse Excel file. Please ensure it's a valid Excel document."
          );
          setIsLoading(false);
        }
      };

      reader.onerror = () => {
        setError("Failed to read the file. Please try again.");
        setIsLoading(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const uploadExcelFile = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
  
    const resData = await uploadBulkMenuItems(file);
      if (resData.status === "Success") {
   
        setRejectedItems(resData?.data?.rejctedList);
        setValidItemCount(resData?.data?.totalValidItems);
        setRejectedItemCount(resData?.data?.totalRejectedItems);
        setTotalItemCount(resData?.data?.totalItems);
      } else {
        alert("Failed to added items!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
      handleReset();
    }
  };

  const thStyles = {
    padding: "0.75rem 1rem",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: 600,
    color: "#6B7280",
    textTransform: "uppercase",
    borderRight: "1px solid #E5E7EB",
  };
  const tdStyles = {
    padding: "0.75rem 1rem",
    fontSize: "14px",
    borderRight: "1px solid #E5E7EB",
    maxWidth: "250px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const renderTable = (dataSource, type = "excel") => {
    if (!dataSource || dataSource.length === 0) {
      return (
        <p style={{ color: "#6B7280", textAlign: "center", padding: "1rem" }}>
          No data found
        </p>
      );
    }

    const renderResetButtion = () => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end", 
            width: "100%",
            marginTop: "16px",
            marginBottom: "16px",
          }}
        >
          <button
            type="reset"
            onClick={() => {
              handleReset();
              setLoading(false);
              setRejectedItems([]);
            }}
            style={{
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              padding: "1px 20px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Reset
          </button>
        </div>
      );
    };

    if (type === "excel") {
      const headers = dataSource[0] || [];
      const rows = dataSource.slice(1);

      const filteredRows = rows.filter((row) =>
        row.some((cell) => cell !== null && cell !== undefined && cell !== "")
      );

      return (
        <>
          {renderResetButtion()}
          <div
            style={{
              overflowX: "auto",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#F9FAFB" }}>
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      style={{
                        padding: "0.75rem 1rem",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#6B7280",
                        textTransform: "uppercase",
                        borderRight: "1px solid #E5E7EB",
                      }}
                    >
                      {header || `Column ${index + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.slice(0, 100).map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderBottom: "1px solid #E5E7EB",
                    }}
                  >
                    {headers.map((_, colIndex) => (
                      <td
                        key={colIndex}
                        style={{
                          padding: "0.75rem 1rem",
                          fontSize: "14px",
                          color: "#111827",
                          borderRight: "1px solid #E5E7EB",
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={row[colIndex] || ""}
                      >
                        {row[colIndex] || ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRows.length > 100 && (
              <div
                style={{
                  backgroundColor: "#F9FAFB",
                  padding: "0.75rem 1rem",
                  fontSize: "14px",
                  color: "#4B5563",
                  textAlign: "center",
                  borderTop: "1px solid #E5E7EB",
                }}
              >
                Showing first 100 rows of {filteredRows.length} total rows
              </div>
            )}
          </div>
        </>
      );
    }

    if (type === "rejected") {
      const headers = Array.from(
        new Set(dataSource.flatMap((obj) => Object.keys(obj)))
      );

      return (
        <>
          {renderResetButtion()}
          <div
            style={{
              overflowX: "auto",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              marginTop: "1rem",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#F9FAFB" }}>
                <tr>
                  
                  <th style={thStyles}>Name</th>
                  <th style={thStyles}>Category</th>
                  <th style={thStyles}>Description</th>
                  <th style={thStyles}>Type</th>
                  <th style={thStyles}>Prep Time</th>
                  <th style={thStyles}>Price</th>
                  <th style={thStyles}>Discount</th>
                  <th style={thStyles}>Created At</th>
                  <th style={thStyles}>Reason</th>
                  
                </tr>
              </thead>
              <tbody>
                {dataSource.map((item, rowIndex) => (
                  <tr
                    key={rowIndex}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderBottom: "1px solid #E5E7EB",
                    }}
                  >
                    <td style={tdStyles}>{item?.name}</td>
                    <td style={tdStyles}>{item?.category}</td>
                    <td style={tdStyles}>{item?.description}</td>
                    <td style={tdStyles}>{item?.type}</td>
                    <td style={tdStyles}>{item?.prepTime}</td>
                    <td style={tdStyles}>{item?.price}</td>
                    <td style={tdStyles}>{item?.discount}</td>
                    <td style={tdStyles}>{item?.createdAt}</td>
                    <td style={{ ...tdStyles, color: "#B91C1C" }}>
                      {item?.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <>
      {/* <HomeHeader
        isAdminDashboard={true}
        restaurantName={restaurantName}
        adminEmail={adminEmail}
        onLogout={handleLogout}
        restaurant={restaurant}
      /> */}
      <div
        style={{
          padding: "24px",
          marginBottom: "50px",
          minHeight: "80vh",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ marginBottom: "32px" }}>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#111827",
                marginBottom: "8px",
                textAlign: "center",
              }}
            >
              Upload Item file
            </h1>
            <p style={{ color: "#4B5563", textAlign: "center" }}>
              Upload an Excel file to add items to menu
            </p>
          </div>
        </div>

        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              textAlign: "right",
              cursor: "pointer",
              maxWidth: "530px",
              marginBottom: "10px",
              width: "100%",
            }}
          >
            <DownloadButton />
          </div>

          <div
            className={`u1 ${uploadedFile ? "active" : ""}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              id="fileInput"
              type="file"
              className="f1"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
            />

            <div className="i1">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>

            <p className="t1">Click to upload Excel file</p>
            <p className="t2">Upload .xlsx and .xls files</p>
          </div>

          <div className="n1">
            <strong>Note:</strong> The <code>Type</code> column in the Excel
            file must only contain <code>veg</code> or <code>non-veg</code>.
          </div>

          {error && (
            <div
              style={{
                marginTop: "16px",
                padding: "16px",
                backgroundColor: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <AlertCircle
                style={{
                  width: "20px",
                  height: "20px",
                  color: "#DC2626",
                  marginRight: "8px",
                }}
              />
              <span style={{ color: "#B91C1C" }}>{error}</span>
            </div>
          )}
        </div>

        {fileName && !isLoading && (
          <div
            style={{
              marginBottom: "24px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => uploadExcelFile(uploadedFile)}
              disabled={loading}
              style={{
                backgroundColor: "#1976d2",
                color: "#fff",
                border: "none",
                padding: "19px 28px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#1565c0")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#1976d2")
              }
            >
              {loading ? <>Uploading...</> : "Submit"}
            </button>
          </div>
        )}

        {excelData && activeSheet && (
          <div
            style={{
              marginTop: "50px",
            }}
          >
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: "16px",
                  }}
                >
                  {/* Preview: {activeSheet} */}
                  Item Sheet
                </h2>
                {renderTable(excelData[activeSheet], "excel")}
              </>
            )}
          </div>
        )}
        {rejectedItems && rejectedItems.length > 0 && (
          <div>
            {loading ? (
              <Loader />
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "20px",
                    marginBottom: "40px",
                    marginTop: "40px",
                  }}
                >
                  <ItemCards
                    label="Total Items"
                    number={totalItemCount}
                    backgroundColor="#d1fae5"
                    borderColor="#10b981"
                    color="#047857"
                  />
                  <ItemCards
                    label="Valid Items"
                    number={validItemCount}
                    backgroundColor="#dbeafe"
                    borderColor="#3b82f6"
                    color="#1d4ed8"
                  />

                  <ItemCards
                    label="Rejected Items"
                    number={rejectedItemCount}
                    backgroundColor="#fee2e2"
                    borderColor="#ef4444"
                    color="#dc2626"
                  />
                </div>
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: "16px",
                  }}
                >
                  Rejected Item Sheet
                </h2>
                {renderTable(rejectedItems, "rejected")}
              </>
            )}
          </div>
        )}
      </div>
      {/* <Footer /> */}
    </>
  );
};
