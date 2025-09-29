import { useState, useEffect } from "react";
import "../styles/TaxSlabManagement.css";
import { getTaxSlabs, addTaxSlab, updateTaxSlab } from "../services/apiService";

export default function TaxSlabManagement() {
  const [slabs, setSlabs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSlab, setEditingSlab] = useState(null);

//   useEffect(() => {
//     const dummySlabs = [
//       {
//         _id: "1",
//         name: "Restaurant Food (No ITC)",
//         rate: 5,
//         type: "without_itc",
//         hsn_code: "9963",
//         effective_from: new Date(),
//         effective_to: null,
//       },
//       {
//         _id: "2",
//         name: "Luxury Goods",
//         rate: 18,
//         type: "with_itc",
//         hsn_code: "9987",
//         effective_from: new Date(),
//         effective_to: null,
//       },
//     ];
//     setSlabs(dummySlabs);
//   }, []);
useEffect(() => {
  const fetchSlabs = async () => {
    try {
      const slabsData = await getTaxSlabs();
      setSlabs(slabsData);
    } catch (error) {
      console.error("Failed to fetch slabs:", error);
    }
  };
  fetchSlabs();
}, []);

  const handleAddSlab = () => {
    setEditingSlab(null);
    setShowModal(true);
  };

  const handleEditSlab = (slab) => {
    setEditingSlab(slab);
    setShowModal(true);
  };

//   const handleSaveSlab = (newSlab) => {
//     setSlabs((prev) => {
//       const exists = prev.find((s) => s._id === newSlab._id);
//       if (exists) {
//         return prev.map((s) => (s._id === newSlab._id ? newSlab : s));
//       }
//       return [...prev, newSlab];
//     });
//     setShowModal(false);
//   };
const handleSaveSlab = async (newSlab) => {
  try {
    if (newSlab._id && slabs.find((s) => s._id === newSlab._id)) {
      // Update slab
      const updated = await updateTaxSlab(newSlab._id, newSlab);
      setSlabs((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );
    } else {
      // Add slab
      const created = await addTaxSlab(newSlab);
      setSlabs((prev) => [...prev, created]);
    }
    setShowModal(false);
  } catch (error) {
    console.error("Error saving slab:", error);
  }
};

  return (
    <div className="tax-slab-container">
      <h1>GST Tax Slabs</h1>

      <button className="btn btn-add" onClick={handleAddSlab}>
        + Add New Slab
      </button>

      <div>
        <table className="tax-slab-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Rate (%)</th>
              <th>Type</th>
              <th>HSN Code</th>
              <th>Effective From</th>
              <th>Effective To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slabs.map((slab) => (
              <tr key={slab._id}>
                <td>{slab.name}</td>
                <td>{slab.rate}%</td>
                <td>{slab.type === "with_itc" ? "With ITC" : "Without ITC"}</td>
                <td>{slab.hsn_code || "-"}</td>
                <td>{new Date(slab.effective_from).toLocaleDateString()}</td>
                <td>
                  {slab.effective_to
                    ? new Date(slab.effective_to).toLocaleDateString()
                    : "Active"}
                </td>
                <td>
                  {slab.effective_to ? (
                    <span className="status-expired">Expired</span>
                  ) : (
                    <span className="status-active">Active</span>
                  )}
                </td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEditSlab(slab)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <SlabModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveSlab}
          slab={editingSlab}
        />
      )}
    </div>
  );
}

function SlabModal({ isOpen, onClose, onSave, slab }) {
  const [name, setName] = useState(slab?.name || "");
  const [rate, setRate] = useState(slab?.rate || "");
  const [type, setType] = useState(slab?.type || "without_itc");
  const [hsn_code, setHsnCode] = useState(slab?.hsn_code || "");
  const [effective_from, setEffectiveFrom] = useState(
    slab ? new Date(slab.effective_from).toISOString().split("T")[0] : ""
  );
  const [effective_to, setEffectiveTo] = useState(
    slab?.effective_to
      ? new Date(slab.effective_to).toISOString().split("T")[0]
      : ""
  );

  useEffect(() => {
    if (slab) {
      setName(slab.name);
      setRate(slab.rate);
      setType(slab.type);
      setHsnCode(slab.hsn_code);
      setEffectiveFrom(new Date(slab.effective_from).toISOString().split("T")[0]);
      setEffectiveTo(slab.effective_to ? new Date(slab.effective_to).toISOString().split("T")[0] : "");
    }
  }, [slab]);

  const handleSubmit = () => {
    onSave({
      _id: slab?._id || Date.now().toString(),
      name,
      rate: Number(rate),
      type,
      hsn_code,
      effective_from: new Date(effective_from),
      effective_to: effective_to ? new Date(effective_to) : null,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
 <div className="modal-wrapper">
    <div className="modal-box">
      <h2>{slab ? "Edit Slab" : "Add Slab"}</h2>
      <input type="text" value={name} placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input type="number" value={rate} placeholder="Rate (%)" onChange={(e) => setRate(e.target.value)} />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="with_itc">With ITC</option>
        <option value="without_itc">Without ITC</option>
      </select>
      <input type="text" value={hsn_code} placeholder="HSN Code" onChange={(e) => setHsnCode(e.target.value)} />
      <input type="date" value={effective_from} onChange={(e) => setEffectiveFrom(e.target.value)} />
      <input type="date" value={effective_to} onChange={(e) => setEffectiveTo(e.target.value)} />

      <div className="modal-buttons">
        <button className="btn btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn btn-save" onClick={handleSubmit}>Save</button>
      </div>
    </div>
  </div>
  );
}
