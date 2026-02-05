import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "../slices/clientSlice";
import productReducer from "../slices/productSlice";
import orderReducer from "../slices/orderSlice";
import paymentReducer from "../slices/paymentSlice";
import promoCodeReducer from "../slices/promoCodeSlice";

export const store = configureStore({
  reducer: {
    clients: clientReducer,
    products: productReducer,
    orders: orderReducer,
    payments: paymentReducer,
    promoCodes: promoCodeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
