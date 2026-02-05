import axiosInstance from "./ApiService";
import type { Product, PaginationParams, PaginatedResponse } from "../types";

export const productService = {
  createProduct: async (product: Product): Promise<Product> => {
    const response = await axiosInstance.post<Product>("/products", product);
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return response.data;
  },

  updateProduct: async (id: number, product: Product): Promise<Product> => {
    const response = await axiosInstance.put<Product>(
      `/products/${id}`,
      product,
    );
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await axiosInstance.put(`/products/${id}/delete`);
  },

  getAllActiveProducts: async (
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Product>> => {
    const queryParams = new URLSearchParams({
      page: String(params?.page || 0),
      size: String(params?.size || 10),
      sortBy: params?.sortBy || "id",
      sortDir: params?.sortDir || "asc",
    });
    const response = await axiosInstance.get<PaginatedResponse<Product>>(
      `/products/allActiveProducts?${queryParams}`,
    );
    return response.data;
  },
};
