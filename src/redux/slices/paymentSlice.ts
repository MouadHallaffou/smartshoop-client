import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Payment, PaginationParams, PaginatedResponse } from "../../types";
import { paymentService } from "../../services/PaymentService";

interface PaymentState {
  payments: Payment[];
  currentPayment: Payment | null;
  loading: boolean;
  error: string | null;
  pagination: {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

const initialState: PaymentState = {
  payments: [],
  currentPayment: null,
  loading: false,
  error: null,
  pagination: {
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  },
};


export const fetchPayments = createAsyncThunk(
  "payments/fetchAll",
  async (params?: PaginationParams) => {
    const response = await paymentService.getAllPayments(params);
    return response;
  },
);

export const fetchPaymentByNumber = createAsyncThunk(
  "payments/fetchByNumber",
  async (numero: string) => {
    const response = await paymentService.getPaymentByNumber(numero);
    return response;
  },
);

export const createPayment = createAsyncThunk(
  "payments/create",
  async (payment: Payment) => {
    const response = await paymentService.createPayment(payment);
    return response;
  },
);

export const confirmPayment = createAsyncThunk(
  "payments/confirm",
  async (numero: string) => {
    await paymentService.confirmPayment(numero);
    return numero;
  },
);

export const cancelPayment = createAsyncThunk(
  "payments/cancel",
  async (numero: string) => {
    await paymentService.cancelPayment(numero);
    return numero;
  },
);

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all payments
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPayments.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Payment>>) => {
          state.loading = false;
          state.payments = action.payload.content;
          state.pagination = {
            totalElements: action.payload.totalElements,
            totalPages: action.payload.totalPages,
            currentPage: action.payload.number,
            pageSize: action.payload.size,
          };
        },
      )
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Erreur lors du chargement des paiements";
      })

      // Fetch payment by number
      .addCase(fetchPaymentByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPaymentByNumber.fulfilled,
        (state, action: PayloadAction<Payment>) => {
          state.loading = false;
          state.currentPayment = action.payload;
        },
      )
      .addCase(fetchPaymentByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Erreur lors du chargement du paiement";
      })

      // Create payment
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createPayment.fulfilled,
        (state, action: PayloadAction<Payment>) => {
          state.loading = false;
          state.payments.unshift(action.payload);
        },
      )
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Erreur lors de la création du paiement";
      })

      // Confirm payment
      .addCase(
        confirmPayment.fulfilled,
        (state, action: PayloadAction<string>) => {
          const payment = state.payments.find(
            (p) => p.numero === action.payload,
          );
          if (payment) {
            payment.status = "COMPLETED";
          }
        },
      )

      // Cancel payment
      .addCase(
        cancelPayment.fulfilled,
        (state, action: PayloadAction<string>) => {
          const payment = state.payments.find(
            (p) => p.numero === action.payload,
          );
          if (payment) {
            payment.status = "FAILED";
          }
        },
      );
  },
});

export const { clearCurrentPayment, clearError } = paymentSlice.actions;
export default paymentSlice.reducer;
