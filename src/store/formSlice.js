import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  restaurantName: "",
  ownerName: "",
  contact: "",
  tagline: "",
  address: {
    line1: "",
    line2: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
  },
  email: "",
  password: "",
  confirmPassword: "",
  image: null,       
  logoImage: null,  
  previewImage: null,  
  previewLogo: null,   
};
const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormField: (state, action) => {
      const { field, value } = action.payload;

      if (field === "address") {
        state.address = { ...state.address, ...value };
      } else {
        state[field] = value;
      }
    },
    updateAddress: (state, action) => {
      const { field, value } = action.payload;
      state.address[field] = value;
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    setTouched: (state, action) => {
      state.touched = { ...state.touched, ...action.payload };
    },
    resetForm: () => initialState,
  },
});

export const { setFormField, updateAddress, setErrors, setTouched, resetForm } =
  formSlice.actions;
export default formSlice.reducer;
