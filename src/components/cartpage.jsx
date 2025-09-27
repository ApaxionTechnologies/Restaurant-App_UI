import { useSelector, useDispatch } from "react-redux";
import { clearCart, updateQty } from "../store/CartSlice";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import "../styles/CartPage.css";
import { useState, useEffect } from "react";
import ViewMenuNavbar from "./ViewMenuNavbar";
import "./CartDrawer.css";
import { calculateBill } from "../utils/calcBill";
import { createOrder } from "../services/apiService.js";

export default function CartPage() {
  const cart = useSelector((state) => state.cart.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [table, setTable] = useState(null);
  const [instructions, setInstructions] = useState("");

  // defensive: ensure calculateBill always has an object to destructure from
  const calc = calculateBill(cart) || {};
  const {
    items: billItems = [],
    subtotal = 0,
    totalDiscount = 0,
    totalGst = 0,
    sgst = 0,
    cgst = 0,
    total = 0,
  } = calc;

  const finalTotal = Number(total ?? 0);

  useEffect(() => {
    const tableParam = searchParams.get("table");
    const restaurantParam = searchParams.get("restaurantId");

    if (tableParam) {
      setTable(tableParam);
      localStorage.setItem("tableNumber", tableParam);
    } else {
      const storedTable = localStorage.getItem("tableNumber");
      if (storedTable) {
        setTable(storedTable);
      }
    }

    if (restaurantParam) {
      localStorage.setItem("restaurantId", restaurantParam);
    }
  }, [searchParams]);

  const restaurantId = searchParams.get("restaurantId") || localStorage.getItem("restaurantId");

  const handleUpdateQty = (name, change) => {
    dispatch(updateQty({ name, change }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const placeOrder = async () => {
    if (!cart || cart.length === 0) return;
    if (!table) {
      alert("Table number not found. Please scan the QR code again.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderData = {
        tableNumber: parseInt(table),
        items: billItems.map((item) => ({
          name: item.name,
          quantity: item.qty || 0,
          price: item.price || 0,
          discount: item.discount || 0,
          gstRate: item.gstRate || 5,
          type: item.type || "veg",
        })),
        subtotal: subtotal,
        totalDiscount: totalDiscount,
        totalGst: totalGst,
        sgst: sgst,
        cgst: cgst,
        totalAmount: total,
        taxAmount: totalGst,

        finalTotal: finalTotal,
        instructions: instructions,
        restaurantId: restaurantId,
      };

      const result = await createOrder(orderData);

      const now = new Date();
      const orderDate = now.toLocaleDateString("en-IN");
      const orderTime = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      handleClearCart();
      navigate("/order-success", {
        state: {
          cart,
          table,
          total: finalTotal,
          orderId: result.order.orderId,
          orderNo: result.order.orderNo,
          orderDate,
          orderTime,
          instructions,
        },
      });
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // helper to safely format numbers
  const fmt = (n) => (Number(n || 0)).toFixed(2);

  return (
    <>
      <ViewMenuNavbar />
      <div className="cart-page-container">
        <div className="cart-page-card">
          <div className="cart-page-header">
            <h2>Your Order</h2>
            <div className="table-display">
              <span className="table-label">Table Number:</span>
              <span className="table-number">{table || "Not specified"}</span>
            </div>
            {!table && (
              <div className="table-error">
                <p>Table number not detected. Please scan the QR code again.</p>
              </div>
            )}
          </div>

          {(!cart || cart.length === 0) ? (
            <div className="cart-empty-state">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some delicious items from our menu</p>
              <button className="browse-menu-btn" onClick={() => navigate(`/menu?table=${table || ''}`)}>
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items-container">
                <div className="cart-items-header">
                  <span className="header-item">Item</span>
                  <span className="header-qty">Qty</span>
                  <span className="header-price">Price</span>
                </div>

                <div className="cart-items-list">
                  {cart.map((item, idx) => (
                    <div className="cart-item-row" key={`${item.name}-${idx}`}>
                      <div className="item-info" style={{ display: "flex", alignItems: "center" }}>
                        <span className={`veg-badge ${item.type === "veg" ? "veg" : "non-veg"}`}></span>
                        <span className="item-name">{item.name}</span>
                      </div>

                      <div className="quantity-controls">
                        <button className="qty-btn" onClick={() => handleUpdateQty(item.name, -1)} disabled={isPlacingOrder}>−</button>
                        <span className="quantity">{item.qty || 0}</span>
                        <button className="qty-btn" onClick={() => handleUpdateQty(item.name, 1)} disabled={isPlacingOrder}>+</button>
                      </div>

                      <div className="item-price-total">
                        <span className="item-price">₹{item.price ?? 0}</span>
                        <span className="item-total">₹{(item.qty || 0) * (item.price || 0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="instructions-section">
                <h4>Add Instructions (Optional)</h4>
                <textarea
                  className="instructions-input"
                  placeholder="Any special requests or instructions for your order..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows="3"
                />
              </div>

              <div className="bill-summary">
                <h3 className="bill-title">BILL DETAILS</h3>
                <div className="bill-line"><span>Item Total</span><span>₹{fmt(subtotal)}</span></div>
                <div className="bill-line"><span>Discount</span><span>-₹{fmt(totalDiscount)}</span></div>
                <div className="bill-line"><span>GST</span><span>₹{fmt(totalGst)}</span></div>
                <div className="bill-line"><span>SGST</span><span>₹{fmt(sgst)}</span></div>
                <div className="bill-line"><span>CGST</span><span>₹{fmt(cgst)}</span></div>
                <div className="bill-line total"><span>Total</span><span>₹{fmt(finalTotal)}</span></div>
                <div className="bill-line to-pay"><span>To Pay</span><span className="spicy-total">₹{fmt(finalTotal)}</span></div>
              </div>

              <div className="desktop-order-btn">
                <button onClick={placeOrder} className="place-order-btn spicy-btn" disabled={!cart || cart.length === 0 || isPlacingOrder || !table}>
                  {isPlacingOrder ? (<><span className="spinner"></span> Placing Order...</>) : (<>Place Order • ₹{fmt(finalTotal)}</>)}
                </button>
              </div>
              <div className="mobile-pay-btn">
                <button onClick={placeOrder} className="pay-now-btn spicy-btn" disabled={!cart || cart.length === 0 || isPlacingOrder || !table}>
                  {isPlacingOrder ? (<><span className="spinner"></span> Processing...</>) : (<>Place Order • ₹{fmt(finalTotal)}</>)}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

