import API from "./api";

// Item Config
export const getConfigList = (params) => API.get("/config/getItemConfig", { params });
export const addConfigItem = (payload) => API.post("/config/addItemConfig", payload);
export const configItemAction = (payload) => API.post("/config/itemConfigAction", payload);
export const editConfigItemDetails = (payload) => API.post("/config/updateItemDetails", payload);

// Tax Config
export const getTaxConfigList = () => API.get("/config/getTaxConfigList");
export const addTaxConfigList = (payload) => API.post("/config/addTaxConfig", payload);
export const taxConfigAction = (payload) => API.post("/config/taxConfigAction", payload);
export const updateTaxDefault = (payload) => API.post("/config/updateDefaultTaxConfig", payload);

// Tax slabs
export const addTaxSlab = (data) => API.post("/tax-slabs", data);
export const getTaxSlabs = () => API.get("/tax-slabs");
export const updateTaxSlab = (id, data) => API.put(`/tax-slabs/${id}`, data);
