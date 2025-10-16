import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import "./CartDrawer.css";

export default function CartDrawer() {
  const cart = useSelector((state) => state.cart.items); 
  const navigate = useNavigate();
  const location = useLocation();
  const [showFlyout, setShowFlyout] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const cartCount = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
  const total = cart.reduce((sum, item) => sum + (item.qty || 0) * (item.price || 0), 0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hideCartPages = ["/cart", "/feedback", "/order-success", "/checkout"];
  const shouldShowCart = !hideCartPages.includes(location.pathname);

  const handleCartClick = () => {
    if (!isMobile) {
      setShowFlyout(!showFlyout);
    } else {
      navigate("/cart");
    }
  };

  const handleViewCart = () => {
    navigate("/cart");
    setShowFlyout(false);
  };

  const handleCheckout = () => {
    navigate("/checkout");
    setShowFlyout(false);
  };

  
  const getButtonText = () => {
    if (cartCount > 0) {
      return `${cartCount} Item${cartCount !== 1 ? 's' : ''} | ₹${total.toFixed(2)}`;
    } else {
      return "Cart is Empty";
    }
  };

  
  if (!shouldShowCart) {
    return null;
  }

  return (
    <div className="navbar-cart" aria-live="polite">
      <button
        onClick={handleCartClick}
        onMouseEnter={() => !isMobile && setShowFlyout(true)}
        className={`cart-toggle ${cartCount > 0 ? "highlight" : ""}`}
        aria-label="View cart"
      >
        {getButtonText()}
        {!isMobile && cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>

      
      {!isMobile && (
        <div 
          className="cart-flyout"
          onMouseLeave={() => setShowFlyout(false)}
          style={{ display: showFlyout ? 'block' : 'none' }}
        >
          <div className="cart-flyout-header">
            <h3 className="cart-flyout-title">Your Cart</h3>
            <span className="cart-flyout-count">{cartCount} items</span>
          </div>
          
          {cartCount > 0 ? (
            <>
              <div className="cart-flyout-items">
                {cart.map((item, index) => (
                  <div key={index} className="cart-flyout-item">
                    <span className="cart-flyout-item-name">{item.name}</span>
                    <span className="cart-flyout-item-price">₹{item.price}</span>
                    <span className="cart-flyout-item-qty">x{item.qty}</span>
                  </div>
                ))}
              </div>
              
              <div className="cart-flyout-total">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              
              <div className="cart-flyout-actions">
                <button className="view-cart-btn" onClick={handleViewCart}>
                  View Cart
                </button>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </>
          ) : (
            <div className="empty-cart-message">
              <p>Your cart is empty</p>
              <p>Add some delicious items to get started!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}