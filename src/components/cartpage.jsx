//import { calculateBillPreview, createOrder } from "../services/apiService.js";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, updateQty } from "../store/CartSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/CartPage.css";
import { useState, useEffect } from "react";
import ViewMenuNavbar from "./ViewMenuNavbar";
import "./CartDrawer.css";
import{calculateBillPreview, createOrder} from "../services/orderService.js";
export default function CartPage() {
  const cart = useSelector((state) => state.cart.items || []);
  console.log("Cart state:", cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [table, setTable] = useState(null);
  const [instructions, setInstructions] = useState("");
  const [billPreview, setBillPreview] = useState({
    subtotal: 0,
    totalDiscount: 0,
    restaurantDiscountAmount: 0,
    totalGst: 0,
    cgst: 0,
    sgst: 0,
    total: 0,
    items: [],
  });

  const fmt = (n) => Number(n || 0).toFixed(2);

  useEffect(() => {
    const tableParam = searchParams.get("table");
    const restaurantParam = searchParams.get("restaurantId");

    if (tableParam) {
      setTable(tableParam);
      localStorage.setItem("tableNumber", tableParam);
    } else {
      const storedTable = localStorage.getItem("tableNumber");
      if (storedTable) setTable(storedTable);
    }

    if (restaurantParam) {
      localStorage.setItem("restaurantId", restaurantParam);
    }
  }, [searchParams]);

  const restaurantId =
    searchParams.get("restaurantId") || localStorage.getItem("restaurantId");

  // const fetchBillPreview = async () => {
  //   if (!cart || cart.length === 0) {
  //     setBillPreview({
  //       subtotal: 0,
  //       totalDiscount: 0,
  //       restaurantDiscountAmount: 0,
  //       totalGst: 0,
  //       cgst: 0,
  //       sgst: 0,
  //       total: 0,
  //       items: [],
  //     });
  //     return;
  //   }

  //   const items = cart.map((i) => ({
  //     menuItemId: i.menuItemId,
  //     quantity: i.qty,
  //   }));

  //   try {
  //     const preview = await calculateBillPreview(items, restaurantId);
  //      console.log("API preview response:", preview);
  //     setBillPreview(preview);
  //   } catch (err) {
  //     console.error("Error calculating bill:", err);
  //   }
  // };
const fetchBillPreview = async () => {
  if (!cart || cart.length === 0) {
    setBillPreview({
      subtotal: 0,
      totalDiscount: 0,
      restaurantDiscountAmount: 0,
      totalGst: 0,
      cgst: 0,
      sgst: 0,
      total: 0,
      items: [],
    });
    return;
  }

  const payload = cart.map((i) => ({
    menuItemId: i.menuItemId,
    quantity: i.qty,
  }));

  try {
    const preview = await calculateBillPreview(payload, restaurantId);
 console.log("API preview response:", preview);
    // Merge cart items with API totals
  const mergedItems = cart.map((c) => ({
  menuItemId: c.menuItemId,
  name: c.name,
  price: c.price,
  type: c.type || "veg",
  quantity: c.qty,
  finalPrice: c.price * c.qty,
  sgst: 0,
  cgst: 0,
  gstAmount: 0,
  basePrice: c.price * c.qty,
  gstRate: 0,
}));

    setBillPreview({
  subtotal: parseFloat(preview.subtotal),
  totalDiscount: parseFloat(preview.totalDiscount || 0),
  restaurantDiscountAmount: parseFloat(preview.restaurantDiscountAmount || 0),
  totalGst: parseFloat(preview.tax || 0),
  cgst: parseFloat(preview.cgst || 0),
  sgst: parseFloat(preview.sgst || 0),
  total: parseFloat(preview.total),
  items: mergedItems,
});

  } catch (err) {
    console.error("Error calculating bill:", err);
  }
};

  useEffect(() => {
    fetchBillPreview();
  }, [cart]);

  const handleUpdateQty = (menuItemId, change) => {
    dispatch(updateQty({ menuItemId, change }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // const placeOrder = async () => {
  //   console.log("Placing order with cart:", cart, "and table:", table);
  //   if (!cart || cart.length === 0) return;
  //   if (!table) {
  //     alert("Table number not found. Please scan the QR code again.");
  //     return;
  //   }

  //   setIsPlacingOrder(true);

  //   try {
  //     const orderData = {
        
  //       tableNumber: parseInt(table),
        
  //       items: cart.map((item) => ({
  //         menuItemId: item.menuItemId,
  //         quantity: item.qty,
  //       })),
  //       subtotal: billPreview.subtotal,
  //       totalDiscount: billPreview.totalDiscount,
  //       restaurantDiscountAmount: billPreview.restaurantDiscountAmount,
  //       totalGst: billPreview.totalGst,
  //       cgst: billPreview.cgst,
  //       sgst: billPreview.sgst,
  //       totalAmount: billPreview.total,
  //       taxAmount: billPreview.totalGst,
  //       instructions: instructions,
  //       restaurantId: restaurantId,
  //     };

  //     const result = await createOrder(orderData);
  //     console.log("Order placed successfully:", result);

  //     const now = new Date();
  //     const orderDate = now.toLocaleDateString("en-IN");
  //     const orderTime = now.toLocaleTimeString("en-IN", {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //       hour12: true,
  //     });

  //     handleClearCart();
  //     navigate("/order-success", {
  //       state: {
  //         cart,
  //         table,
  //         total: billPreview.total,
  //         orderId: result.order.orderId,
  //         orderNo: result.order.orderNo,
  //         orderDate,
  //         orderTime,
  //         instructions,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //     alert("There was an error placing your order. Please try again.");
  //   } finally {
  //     setIsPlacingOrder(false);
  //   }
  // };
const placeOrder = async () => {
  console.log("Placing order with cart:", cart, "and table:", table);
  if (!cart || cart.length === 0) return;
  if (!table) {
    alert("Table number not found. Please scan the QR code again.");
    return;
  }

  setIsPlacingOrder(true);

  try {
    const now = new Date();

    const orderData = {
      tableNumber: parseInt(table),

      // REQUIRED BY BACKEND
      orderTime: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }),
      orderDate: now.toLocaleDateString("en-IN"),
      orderNo: "ORD" + now.getTime(),
      orderId: "OID" + Math.floor(100000 + Math.random() * 900000),

      subtotal: billPreview.subtotal,
      totalDiscount: billPreview.totalDiscount,
      restaurantDiscountAmount: billPreview.restaurantDiscountAmount,
      totalGst: billPreview.totalGst,
      cgst: billPreview.cgst,
      sgst: billPreview.sgst,
      totalAmount: billPreview.total,
      taxAmount: billPreview.totalGst,
      instructions: instructions,
      restaurantId: restaurantId,

      // FIXED ITEMS ARRAY
      items: cart.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,      // REQUIRED
        price: item.price,    // REQUIRED
        quantity: item.qty
      }))
    };

    console.log("Sending Order Data:", orderData);

    const result = await createOrder(orderData);

    console.log("Order placed successfully:", result);

    handleClearCart();

    navigate("/order-success", {
      state: {
        cart,
        table,
        total: billPreview.total,
        orderId: orderData.orderId,
        orderNo: orderData.orderNo,
        orderDate: orderData.orderDate,
        orderTime: orderData.orderTime,
        instructions
      },
    });

  } catch (error) {
    console.error("Error placing order:", error);
    alert("There was an error placing your order. Please try again.");
  } finally {
    setIsPlacingOrder(false);
  }
};

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

          {!billPreview?.items || billPreview?.items?.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some delicious items from our menu</p>
              <button
                className="browse-menu-btn"
                onClick={() =>
                  navigate(
                    `/menu?restaurantId=${restaurantId}&table=${table || ""}`
                  )
                }
              >
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
                  {billPreview?.items.map((item, idx) => (
                    <div className="cart-item-row" key={`${item.name}-${idx}`}>
                      <div
                        className="item-info"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <span
                          className={`veg-badge ${
                            item.type === "veg" ? "veg" : "non-veg"
                          }`}
                        ></span>
                        <span className="item-name">{item.name}</span>
                      </div>

                      <div className="quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() => handleUpdateQty(item.menuItemId, -1)}
                          disabled={isPlacingOrder}
                        >
                          −
                        </button>
                        <span className="quantity">{item.quantity || 0}</span>
                        <button
                          className="qty-btn"
                          onClick={() => handleUpdateQty(item.menuItemId, 1)}
                          disabled={isPlacingOrder}
                        >
                          +
                        </button>
                      </div>

                      <div className="item-price-total">
                        <span className="item-price">₹{item.price ?? 0}</span>
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
                    </div>
                  ))}
                  <div className="cart-item-row">
                    <div
                      className="item-info"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <span className="item-name font-b">
                        {" "}
                        <b>Item Total</b>{" "}
                      </span>
                    </div>

                    <div className="quantity-controls" />

                    <div className="item-price-total">
                      <span>
                        {" "}
                        <b>₹{fmt(billPreview.subtotal)}</b>{" "}
                      </span>
                    </div>
                  </div>
                  {billPreview.isTaxIncluded && (
                    <div className="cart-item-row">
                      <i>Prices are inclusive of all taxes.</i>
                    </div>
                  )}
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

              {billPreview.isTaxIncluded ? (
                <>
                  {/* Tax Details */}
                  <div className="bill-summary">
                    <h3 className="bill-title">TAX DETAILS</h3>
                    <div className="bill-line">
                      <span>Taxable Amount</span>
                      <span>
                        ₹{fmt(billPreview.subtotal - billPreview.totalGst)}
                      </span>
                    </div>
                    <div className="bill-line">
                      <span>SGST</span>
                      <span>₹{fmt(billPreview.sgst)}</span>
                    </div>
                    <div className="bill-line">
                      <span>CGST</span>
                      <span>₹{fmt(billPreview.cgst)}</span>
                    </div>
                    <div className="bill-line">
                      <span>GST</span>
                      <span>+₹{fmt(billPreview.totalGst)}</span>
                    </div>
                  </div>

                  <div className="bill-summary">
                    {/* <h3 className="bill-title">BILL DETAILS</h3> */}
                    <div className="bill-line">
                      <span>Restaurant Discount</span>
                      <span>-₹{fmt(billPreview.restaurantDiscountAmount)}</span>
                    </div>
                    <div className="bill-line total">
                      <span>Total</span>
                      <span>₹{fmt(billPreview.total)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bill-summary">
                  <h3 className="bill-title">BILL DETAILS</h3>
                  {/* <div className="bill-line">
                    <span>Discount</span>
                    <span>-₹{fmt(billPreview.totalDiscount)}</span>
                  </div> */}
                  <div className="bill-line">
                    <span>Restaurant Discount</span>
                    <span>-₹{fmt(billPreview.restaurantDiscountAmount)}</span>
                  </div>
                  <div className="bill-line">
                    <span>SGST</span>
                    <span>₹{fmt(billPreview.sgst)}</span>
                  </div>
                  <div className="bill-line">
                    <span>CGST</span>
                    <span>₹{fmt(billPreview.cgst)}</span>
                  </div>
                  <div className="bill-line">
                    <span>GST</span>
                    <span>+₹{fmt(billPreview.totalGst)}</span>
                  </div>
                  <div className="bill-line total">
                    <span>Total</span>
                    <span>₹{fmt(billPreview.total)}</span>
                  </div>
                </div>
              )}

              <button
                className="place-order-btn"
                onClick={placeOrder}
                disabled={!cart.length || isPlacingOrder || !table}
              >
                {isPlacingOrder
                  ? "Placing Order..."
                  : `Place Order • ₹${fmt(billPreview.total)}`}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
