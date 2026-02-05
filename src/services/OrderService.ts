import axiosInstance from "./ApiService";
import type { Order, PaginationParams, PaginatedResponse } from "../types";

export const orderService = {
  createOrder: async (order: Order): Promise<Order> => {
    const response = await axiosInstance.post<Order>("/orders", order);
    return response.data;
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await axiosInstance.get<Order>(`/orders/${id}`);
    return response.data;
  },

  updateOrder: async (id: number, order: Order): Promise<Order> => {
    const response = await axiosInstance.put<Order>(
      `/orders/${id}/update`,
      order,
    );
    return response.data;
  },

  deleteOrder: async (id: number): Promise<void> => {
    await axiosInstance.put(`/orders/${id}/delete`);
  },

  confirmOrder: async (id: number): Promise<void> => {
    await axiosInstance.put(`/orders/${id}/confirm`);
  },

  cancelOrder: async (id: number): Promise<void> => {
    await axiosInstance.put(`/orders/${id}/cancel`);
  },

  searchOrderByClientName: async (clientName: string): Promise<Order[]> => {
    const response = await axiosInstance.get<Order[]>(
      `/orders/search?clientName=${clientName}`,
    );
    return response.data;
  },

  getAllOrders: async (
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Order>> => {
    const queryParams = new URLSearchParams({
      page: String(params?.page || 0),
      size: String(params?.size || 10),
      sortBy: params?.sortBy || "id",
      sortDir: params?.sortDir || "asc",
    });
    const response = await axiosInstance.get<PaginatedResponse<Order>>(
      `/orders/allOrders?${queryParams}`,
    );
    return response.data;
  },
};
