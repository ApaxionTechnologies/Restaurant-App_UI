import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ViewBillModal = ({ isOpen, onClose, billPreview = { items: [] } }) => {
  if (!isOpen) return null;
  const fmt = (n) => Number(n || 0).toFixed(2);
  const resAddress = billPreview?.restaurant?.address;
  const logoSrc = billPreview?.restaurant?.logoImage;

  /** ========================
   * Generate High-Quality Multi-Page PDF
   * ======================== */

  const handleDownloadPDF = async () => {
    const billContainer = document.getElementById("bill-data");
    if (!billContainer) return alert("Bill not found!");

    // Remove modal scroll limit temporarily
    const originalMaxHeight = billContainer.style.maxHeight;
    billContainer.style.maxHeight = "none";
    billContainer.style.overflow = "visible";

    // Give the browser a moment to reflow
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Capture entire content
    const canvas = await html2canvas(billContainer, {
      scale: 3, // High quality
      useCORS: true,
      windowWidth: billContainer.scrollWidth,
      windowHeight: billContainer.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save("Restaurant_Bill.pdf");

    // Restore styles
    billContainer.style.maxHeight = originalMaxHeight;
    billContainer.style.overflow = "auto";
  };

  /** ========================
   * Print directly from browser
   * ======================== */
  const handlePrint = () => {
    const printContents = document.getElementById("bill-content").innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .bill-line { display: flex; justify-content: space-between; margin: 4px 0; }
            .cart-item-row { border-bottom: 1px solid #eee; padding: 6px 0; }
            h2, h3 { text-align: center; margin: 6px 0; }
            img { display: block; margin: 0 auto; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        id="bill-content"
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          backgroundColor: "white",
          borderRadius: "12px",
          maxWidth: "650px",
          width: "90%",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          padding: "20px 25px",
        }}
      >
        {/* HEADER BUTTONS */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            display: "flex",
            gap: "8px",
          }}
        >
          {/* <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1.3rem",
            }}
          >
            <i className="fas fa-times"></i>
          </button> */}
        </div>

        {/* === REST OF YOUR BILL DESIGN GOES HERE === */}
        {/* Keep your same JSX structure for items, totals, etc. */}

        {/* <div className="restaurant-header" style={{ textAlign: "center" }}>
          <img
            src={logoSrc}
            alt="Restaurant Logo"
            style={{ width: 60, height: 60, borderRadius: "50%" }}
          />
          <h2 style={{ margin: "10px 0 5px" }}>
            {billPreview?.restaurant?.restaurantName?.toUpperCase()}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#555" }}>
            {`${resAddress?.line1 || ""} ${resAddress?.line2 || ""}, ${
              resAddress?.city || ""
            }, ${resAddress?.state || ""} • ${
              billPreview?.restaurant?.contact || ""
            }`}
          </p>
        </div> */}

        {/* ✅ Keep your same bill body, summary, and footer below */}
        <div
          className="modal-overlay"
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              backgroundColor: "white",
              borderRadius: "12px",
              maxWidth: "650px",
              width: "90%",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              padding: "20px 25px",
            }}
          >
            <div id="bill-data">
            {/* CLOSE BUTTON */}
            <div className="d-flex gap-3">
              <button
                onClick={handleDownloadPDF}
                style={{
                  background: "#4CAF50",
                  border: "none",
                  color: "white",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                Download PDF
              </button>

              <button
                onClick={handlePrint}
                style={{
                  background: "#1976d2",
                  border: "none",
                  color: "white",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                Print
              </button>
              <button
                className="modal-close-btn"
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.3rem",
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* RESTAURANT HEADER */}
            <div
              className="restaurant-header"
              style={{
                textAlign: "center",
                borderBottom: "1px solid #ddd",
                paddingBottom: "10px",
                marginBottom: "15px",
              }}
            >
              <img
                src={logoSrc}
                alt="Restaurant Logo"
                style={{ width: 60, height: 60, borderRadius: "50%" }}
              />
              <h2 style={{ margin: "10px 0 5px" }}>
                {billPreview?.restaurant.restaurantName?.toUpperCase()}{" "}
              </h2>
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                {`${resAddress.line1} ${resAddress.line2}, ${resAddress.city}, ${resAddress.state} • ${billPreview?.restaurant.contact}`}
              </p>
            </div>

            {/* BILL INFO */}
            <div
              className="bill-info"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                fontSize: "0.9rem",
              }}
            >
              <div>
                <p>
                  <strong>Bill No:</strong> #{billPreview?.billNo || "—"}
                </p>
                <p>
                  <strong>Date:</strong> {new Date().toLocaleString()}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p>
                  <strong>Table:</strong>{" "}
                  {billPreview?.tableNumber || "Not specified"}
                </p>
                <p>
                  <strong>Waiter:</strong> {billPreview?.waiterName || "—"}
                </p>
              </div>
            </div>

            {/* ITEM LIST */}
            <div className="cart-items-container">
              <div
                className="cart-items-header"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 70px 80px",
                  fontWeight: "bold",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "8px",
                  marginBottom: "6px",
                }}
              >
                <span>Item</span>
                <span style={{ textAlign: "center" }}>Qty</span>
                <span style={{ textAlign: "right" }}>Amount</span>
              </div>

              {billPreview?.items?.map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className="cart-item-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 70px 80px",
                    alignItems: "center",
                    marginBottom: "6px",
                    padding: "6px 0",
                    borderBottom: "1px solid #f1f1f1",
                  }}
                >
                  {/* Item name */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span
                      className={`veg-badge ${
                        item.type === "veg" ? "veg" : "non-veg"
                      }`}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: item.type === "veg" ? "green" : "red",
                        display: "inline-block",
                      }}
                    ></span>
                    <span>{item.name}</span>
                  </div>

                  {/* Quantity Controls */}
                  <div
                    className="quantity-controls"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <span>{item.quantity || 0}</span>
                  </div>

                  {/* Price */}
                  {item.discount > 0 ? (
                    <div className="">
                      <span className="item-discount">
                        ₹{(item.quantity || 0) * (item.price || 0)}
                      </span>
                      <span className="item-total">
                        ₹{item.finalPrice || 0}
                      </span>
                    </div>
                  ) : (
                    <span className="item-total">
                      ₹{(item.quantity || 0) * (item.price || 0)}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* BILL SUMMARY */}
            <div
              className="bill-summary"
              style={{
                marginTop: "20px",
                borderTop: "1px solid #ddd",
                paddingTop: "10px",
              }}
            >
              <h3
                className="bill-title"
                style={{
                  marginBottom: "8px",
                  fontSize: "1rem",
                  borderBottom: "1px dashed #ccc",
                  paddingBottom: "5px",
                }}
              >
                BILL DETAILS
              </h3>

              <div className="bill-line">
                <span>Item Total</span>
                <span>₹{fmt(billPreview.subtotal)}</span>
              </div>
              <div className="bill-line">
                <span>Discount</span>
                <span>-₹{fmt(billPreview.totalDiscount)}</span>
              </div>
              <div className="bill-line">
                <span>Restaurant Discount</span>
                <span>-₹{fmt(billPreview.totalRestaurantDiscount)}</span>
              </div>
              <div className="bill-line">
                <span>SGST</span>
                <span>₹{fmt(billPreview.sgst)}</span>
              </div>
              <div className="bill-line">
                <span>CGST</span>
                <span>₹{fmt(billPreview.cgst)}</span>
              </div>
              <div
                className="bill-line total"
                style={{ fontWeight: "bold", marginTop: 5 }}
              >
                <span>Total</span>
                <span>₹{fmt(billPreview.totalAmount)}</span>
              </div>
            </div>

            {/* FOOTER MESSAGE */}
            <div
              className="footer-note"
              style={{
                textAlign: "center",
                fontSize: "0.8rem",
                color: "#777",
                marginTop: "10px",
              }}
            >
              Thank you for dining with us! 🍽️
            </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBillModal;
