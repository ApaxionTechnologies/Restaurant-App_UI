import React, { useEffect, useState } from "react";
import {
  addConfigItem,
  addTaxConfigList,
  configItemAction,
  editConfigItemDetails,
  flipCuisineStatus,
  getConfigList,
  getMyRestaurant,
  getTaxConfigList,
  taxConfigAction,
  updateTaxDefault,
  updateRestaurantProfile, // ✅ replaces updateTaxStatus
} from "../../services/apiService";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { ConfigModal, TaxConfigModal } from "./ConfigModal"; // ✅ fixed import
import TableComp from "./tableComp";
import "./config.css";

const Config = () => {
  const [configData, setConfigData] = useState([]);
  const [taxData, setTaxData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);
  const [isTaxEnabled, setIsTaxEnabled] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", type: "", hasTax: false, taxValue: 0 });
  const [taxForm, setTaxForm] = useState({ taxValue: 0 });
  const [defaultTaxId, setDefaultTaxId] = useState(null);

  useEffect(() => {
    fetchRestaurantDetails();
    fetchConfigList();
    fetchTaxConfigList();
  }, []);

  const fetchRestaurantDetails = async () => {
    try {
      const res = await getMyRestaurant();
      setRestaurantId(res?._id);
      setIsTaxEnabled(res?.isTaxInclusive || false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchConfigList = async () => {
    setLoading(true);
    try {
      const res = await getConfigList();
      setConfigData(res || []);
    } catch (error) {
      toast.error("Error fetching configuration list");
    } finally {
      setLoading(false);
    }
  };

  const fetchTaxConfigList = async () => {
    setLoading(true);
    try {
      const res = await getTaxConfigList();
      setTaxData(res || []);
      const defaultTax = res.find((item) => item.isDefault);
      setDefaultTaxId(defaultTax ? defaultTax._id : null);
    } catch (error) {
      toast.error("Error fetching tax configuration list");
    } finally {
      setLoading(false);
    }
  };

  // ✅ replaced updateTaxStatus with updateRestaurantProfile
  const handleTaxStatusChange = async () => {
    const newValue = !isTaxEnabled;
    setIsTaxEnabled(newValue);
    setLoading(true);
    try {
      const payload = { isTaxInclusive: newValue };
      const res = await updateRestaurantProfile(payload);
      toast.success(res?.message || "Status updated successfully");
    } catch (err) {
      toast.error("Error updating tax status");
    } finally {
      setLoading(false);
    }
  };

  const handleAddConfig = async () => {
    if (!formData.name || !formData.type) return toast.error("Fill all fields");
    setLoading(true);
    try {
      const payload = { ...formData, restaurantId };
      const res = await addConfigItem(payload);
      toast.success(res?.message || "Config added successfully");
      setIsConfigModalOpen(false);
      fetchConfigList();
    } catch (err) {
      toast.error("Error adding config");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTax = async () => {
    if (!taxForm.taxValue) return toast.error("Enter tax value");
    setLoading(true);
    try {
      const payload = { ...taxForm, restaurantId };
      const res = await addTaxConfigList(payload);
      toast.success(res?.message || "Tax added successfully");
      setIsTaxModalOpen(false);
      fetchTaxConfigList();
    } catch (err) {
      toast.error("Error adding tax config");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setLoading(true);
    try {
      const payload = { restaurantId };
      const res =
        type === "Tax"
          ? await taxConfigAction(id, "delete", payload)
          : await configItemAction(id, "delete", payload);
      toast.success(res?.message || "Item deleted successfully");
      type === "Tax" ? fetchTaxConfigList() : fetchConfigList();
    } catch (err) {
      toast.error("Error deleting item");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultTax = async (id) => {
    setLoading(true);
    try {
      const res = await updateTaxDefault(id);
      toast.success(res?.message || "Default tax updated");
      fetchTaxConfigList();
    } catch (err) {
      toast.error("Error updating default tax");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id) => {
    setLoading(true);
    try {
      const res = await flipCuisineStatus(id);
      toast.success(res?.message || "Status updated");
      fetchConfigList();
    } catch (err) {
      toast.error("Error updating status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="config-page">
      <h2 className="page-title">Configuration</h2>

      <div className="tax-toggle">
        <label>
          <input
            type="checkbox"
            checked={isTaxEnabled}
            onChange={handleTaxStatusChange}
          />{" "}
          Tax Inclusive
        </label>
      </div>

      {loading && <Loader />}

      <div className="config-section">
        <h3>General Config</h3>
        <button className="btn btn-primary" onClick={() => setIsConfigModalOpen(true)}>
          Add Config Item
        </button>
        <TableComp
          data={configData}
          type="General"
          handleStatusToggle={handleStatusToggle}
          handleDeleteItem={handleDeleteItem}
        />
      </div>

      <div className="config-section">
        <h3>Tax Config</h3>
        <button className="btn btn-primary" onClick={() => setIsTaxModalOpen(true)}>
          Add Tax Config
        </button>
        <TableComp
          data={taxData}
          type="Tax"
          handleSetDefaultTax={handleSetDefaultTax}
          defaultTaxId={defaultTaxId}
          handleDeleteItem={handleDeleteItem}
        />
      </div>

      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleAddConfig}
      />

      <TaxConfigModal
        isOpen={isTaxModalOpen}
        onClose={() => setIsTaxModalOpen(false)}
        formData={taxForm}
        setFormData={setTaxForm}
        handleSubmit={handleAddTax}
      />
    </div>
  );
};

export default Config;
