import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "../slices/clientSlice";
import productReducer from "../slices/productSlice";
import orderReducer from "../slices/orderSlice";
import paymentReducer from "../slices/paymentSlice";

export const store = configureStore({
  reducer: {
    clients: clientReducer,
    products: productReducer,
    orders: orderReducer,
    payments: paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
