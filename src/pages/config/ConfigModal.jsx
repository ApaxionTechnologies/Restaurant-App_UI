import "./configModal.css";

export const ConfigModal = ({
  isOpen,
  formData,
  setFormData,
  handleSubmit,
  onClose,
}) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = type === "checkbox" ? checked : value;

    if (name === "taxValue") {
      const num = parseFloat(value);
      if (isNaN(num)) {
        newValue = "";
      } else {
        newValue = Math.min(100, Math.max(0, num)); // Clamp between 0–100
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.type !== "" &&
    (!formData.hasTax ||
      (formData.hasTax && String(formData.taxValue ?? "").trim() !== ""));

  return (
    <>
      <div className="container8x">
        {isOpen && (
          <div className="overlay4m" onClick={onClose}>
            <div className="modal7k" onClick={(e) => e.stopPropagation()}>
              <div className="header2n">
                <h2 className="title5p">Add New Item</h2>
              </div>

              <div>
                <div className="content3w">
                  {/* Name Field */}
                  <div className="field6r">
                    <label className="label8t" htmlFor="name">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="input1s"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter name..."
                    />
                  </div>

                  {/* Type Field */}
                  <div className="field6r">
                    <label className="label8t" htmlFor="type">
                      Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      className="select9v"
                      value={formData.type}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Type</option>
                      <option value="Category">Category</option>
                      <option value="Cuisine">Cuisine</option>
                    </select>
                  </div>
                </div>

                {/* Footer */}
                <div className="footer4b">
                  <button
                    type="button"
                    className="btnSecondary2q"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btnPrimary7x"
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const TaxConfigModal = ({
  isOpen,
  formData,
  setFormData,
  handleSubmit,
  onClose,
}) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = type === "checkbox" ? checked : value;

    if (name === "taxValue") {
      const num = parseFloat(value);
      if (isNaN(num)) {
        newValue = "";
      } else {
        newValue = Math.min(100, Math.max(0, num)); // Clamp between 0–100
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const isFormValid = String(formData.taxValue ?? "").trim() !== "";

  return (
    <>
      <div className="container8x">
        {isOpen && (
          <div className="overlay4m" onClick={onClose}>
            <div className="modal7k" onClick={(e) => e.stopPropagation()}>
              <div className="header2n">
                <h2 className="title5p">Add New Tax Configuration</h2>
              </div>

              <div>
                <div className="content3w">
                  <div className="field6r">
                    <label className="label8t" htmlFor="tax">
                      Tax (%)
                    </label>
                    <input
                      type="number"
                      id="taxValue"
                      name="taxValue"
                      className="input1s"
                      value={formData.taxValue || ""}
                      onChange={handleInputChange}
                      placeholder="Enter tax percentage..."
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {/* )} */}
                </div>

                {/* Footer */}
                <div className="footer4b">
                  <button
                    type="button"
                    className="btnSecondary2q"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btnPrimary7x"
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
