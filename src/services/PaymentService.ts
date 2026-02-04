import axiosInstance from "./ApiService";
import type { Payment, PaginationParams, PaginatedResponse } from "../types";

export const paymentService = {
  createPayment: async (payment: Payment): Promise<Payment> => {
    const response = await axiosInstance.post<Payment>("/paiements", payment);
    return response.data;
  },

  getAllPayments: async (
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Payment>> => {
    const queryParams = new URLSearchParams({
      page: String(params?.page || 0),
      size: String(params?.size || 10),
      sortBy: params?.sortBy || "datePaiement",
      sortDir: params?.sortDir || "desc",
    });
    const response = await axiosInstance.get<PaginatedResponse<Payment>>(
      `/paiements?${queryParams}`,
    );
    return response.data;
  },

  getPaymentByNumber: async (numero: string): Promise<Payment> => {
    const response = await axiosInstance.get<Payment>(`/paiements/${numero}`);
    return response.data;
  },

  confirmPayment: async (numero: string): Promise<void> => {
    await axiosInstance.put(`/paiements/${numero}/confirmer`);
  },

  cancelPayment: async (numero: string): Promise<void> => {
    await axiosInstance.put(`/paiements/${numero}/annuler`);
  },
};
