import React from "react";
import Adminlayout from "../components/AdminLayout"; 
import "../styles/AdminDashBoard.css";

export default function AdminDashboard() {
  return (
    <Adminlayout>
      <div className="adb-dashboard">
        <div className="adb-kpis">
          <div className="adb-kpi">
            <img src='./Icon_Order.png' className="adb-icon"></img>
            <div>
              <div className="adb-num">75</div>
              <div className="adb-label">Total Orders</div>
              <div className="adb-label"> 4% (30 days) </div>
            </div>
          </div>

          <div className="adb-kpi">
            <img src='./icon_Delivered.png' className="adb-icon"></img>
            <div>
              <div className="adb-num">357</div>
              <div className="adb-label">Total Delivered</div>
              <div className="adb-label"> 4% (30 days) </div>
            </div>
          </div>

          <div className="adb-kpi">
          <img src='./Icon_Order1.png' className="adb-icon"></img>
            <div>
              <div className="adb-num">65</div>
              <div className="adb-label">Total Canceled</div>
              <div className="adb-label"> 25% (30 days) </div>
            </div>
          </div>

          <div className="adb-kpi">
          <img src='./Group_148.png' className="adb-icon"></img>
            <div>
              <div className="adb-num">12k</div>
              <div className="adb-label">Total Revenue</div>
              <div className="adb-label"> 12% (30 days) </div>
            </div>
          </div>
        </div>
        <div className="adb-cards">
          
        
          {/* <div className="adb-card adb-card-big">
            <div className="adb-card-left">
              <h3 className="adb-card-title">Add Menu Item</h3>
              <p className="adb-card-desc">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.
              </p>
              <button className="adb-btn adb-btn-primary">View Menu</button>
            </div>

            <div className="adb-card-right">
             
            <button className="adb-btn adb-btn-primary">+Add items </button>
            <img src="./tasty-burger.png"></img>
            </div>
          </div> */}
<div className="adb-card adb-card-big">
  <div className="adb-card-left">
    <h3 className="adb-card-title">Add Menu Item</h3>
    <p className="adb-card-desc">
    “Create a complete digital menu by adding items with images, 
    pricing, variant options, ingredients, and dietary information.
     Organize dishes into categories and control visibility with a single tap. 
     Every change reflects instantly across all QR menus.
    </p>
    <button className="adb-btn adb-btn-outline">View Menu</button>
  </div>

  <div className="adb-card-right">
    <button className="adb-btn adb-btn-primary adb-add-btn">
      + Add items
    </button>

    <img
      src="./tasty-burger.png"
      alt="Burger"
      className="adb-burger-img"
    />
  </div>
</div>

      
          <div className="adb-card adb-card-small">
            <h5>Generate menu QR</h5>
            <p className="adb-card-desc">
            “Create QR codes for each table and let customers order instantly with a quick scan.”
              </p>
            <img src='./image_70.png' className="adb-qr"></img>
            <div className="adb-card-actions">
              <button className="adb-btn adb-btn-primary">Generate</button>
            </div>
          </div>

         
          <div className="adb-card adb-card-small">
            <h4>Manage Tables</h4>
            <img src='./t3_t2.png' className="adb-tables"></img>
            <div className="adb-card-actions">
              <button className="adb-btn adb-btn-primary">Manage</button>
            </div>
          </div>
          
        </div>
        <section className="adb-reviews">
  <h3>Customer Review</h3>

  <div className="adb-reviews-row">
    {/* card 1 */}
    <div className="adb-review">
      <div className="adb-review-content">
        <div className="adb-review-head">
          <div className="adb-avatar-small" />
          <div className="adb-review-meta-wrap">
            <div className="adb-review-name">Jons Sena</div>
            <div className="adb-review-meta">2 days ago</div>
          </div>
        </div>

        <div className="adb-review-text">
          Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
        </div>

        <div className="adb-review-bottom">
          <div className="adb-stars" aria-hidden="true">
            <span className="star filled">★</span>
            <span className="star filled">★</span>
            <span className="star filled">★</span>
            <span className="star filled">★</span>
            <span className="star">☆</span>
          </div>
          <div className="adb-score">4.5</div>
        </div>
      </div>

      <div
        className="adb-review-img"
        role="img"
        aria-label="dish image"
        style={{ backgroundImage: "url('./food1.png')" }}
      />
    </div>

    {/* card 2 */}
    <div className="adb-review">
      <div className="adb-review-content">
        <div className="adb-review-head">
          <div className="adb-avatar-small" />
          <div className="adb-review-meta-wrap">
            <div className="adb-review-name">Sofia</div>
            <div className="adb-review-meta">2 days ago</div>
          </div>
        </div>

        <div className="adb-review-text">
          Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
        </div>

        <div className="adb-review-bottom">
          <div className="adb-stars" aria-hidden="true">
            <span className="star filled">★</span>
            <span className="star filled">★</span>
            <span className="star filled">★</span>
            <span className="star">☆</span>
            <span className="star">☆</span>
          </div>
          <div className="adb-score">4.0</div>
        </div>
      </div>

      <div
        className="adb-review-img"
        role="img"
        aria-label="dish image"
        style={{ backgroundImage: "url('./food2.png')" }}
      />
    </div>

    {/* card 3 */}
    <div className="adb-review">
      <div className="adb-review-content">
        <div className="adb-review-head">
          <div className="adb-avatar-small" />
          <div className="adb-review-meta-wrap">
            <div className="adb-review-name">Andreansyah</div>
            <div className="adb-review-meta">2 days ago</div>
          </div>
        </div>

        <div className="adb-review-text">
          Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
        </div>

        <div className="adb-review-bottom">
          <div className="adb-stars" aria-hidden="true">
            <span className="star filled">★</span>
            <span className="star filled">★</span>
            <span className="star filled">★</span>
            <span className="star filled">★</span>
            <span className="star filled">★</span>
          </div>
          <div className="adb-score">5.0</div>
        </div>
      </div>

      <div
        className="adb-review-img"
        role="img"
        aria-label="dish image"
        style={{ backgroundImage: "url('./food3.png')" }}
      />
    </div>
  </div>
</section>

      </div>
    </Adminlayout>
  );
}
