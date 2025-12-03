import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurantName: "",
  ownerName: "",
  contact: "",
  email: "",
  password: "",
  confirmPassword: "",

  address: {
    line1: "",
    line2: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
  },

  branding: {
    logoImage: null,
    image: null,
    headerImage: null,
    footerImage: null,
    tagline: "",
      previewImage: null,
    previewLogo: null,
  },

  settings: {
    hasCuisines: false,
    isTaxInclusive: true,
    isActive: true,
    tables: 0,
  },

  taxConfiguration: [],

  subscription: {
    type: "Trial",
  },

  errors: {},
  touched: {},
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormField: (state, action) => {
      const { field, value } = action.payload;
      if (typeof value === "object" && !Array.isArray(value)) {
        state[field] = { ...state[field], ...value };
      } else {
        state[field] = value;
      }
    },
    updateAddress: (state, action) => {
      const { field, value } = action.payload;
      state.address[field] = value;
    },

    updateBranding: (state, action) => {
      const { field, value } = action.payload;
      state.branding[field] = value;
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

export const {
  setFormField,
  updateAddress,
  updateBranding,
  setErrors,
  setTouched,
  resetForm,
} = formSlice.actions;

export default formSlice.reducer;
