import React, { useEffect, useState } from "react";

export default function TableManager({ restaurantEmail }) {
  const [tableCount, setTableCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5001/api/tables?email=${restaurantEmail}`)
      .then((res) => res.json())
      .then((data) => {
        setTableCount(data.tables || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tables:", err);
        setLoading(false);
      });
  }, [restaurantEmail]);

  const handleUpdate = () => {
    fetch("http://localhost:5001/api/tables/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: restaurantEmail, tables: tableCount }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(`✅ Table count updated to ${data.tables}`);
      })
      .catch((err) => {
        alert("❌ Failed to update tables");
        console.error(err);
      });
  };

  return (
    <div className="card p-3 mt-4">
      <h4>Manage Tables</h4>
      {loading ? (
        <p>Loading current table count...</p>
      ) : (
        <>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              className="form-control w-25"
              min={0}
              value={tableCount}
              onChange={(e) => setTableCount(Number(e.target.value))}
            />
            <button className="btn btn-primary" onClick={handleUpdate}>
              Update Tables
            </button>
          </div>
        </>
      )}
    </div>
  );
}
