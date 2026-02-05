import axiosInstance from "./ApiService";
import type { CodePromo, PaginationParams, PaginatedResponse } from "../types";

export const promoCodeService = {
  createPromoCode: async (promoCode: CodePromo): Promise<CodePromo> => {
    const response = await axiosInstance.post<CodePromo>(
      "/codes-promos",
      promoCode,
    );
    return response.data;
  },

  getPromoCodeByCode: async (code: string): Promise<CodePromo> => {
    const response = await axiosInstance.get<CodePromo>(
      `/codes-promos/${code}`,
    );
    return response.data;
  },

  updatePromoCode: async (
    code: string,
    promoCode: CodePromo,
  ): Promise<CodePromo> => {
    const response = await axiosInstance.put<CodePromo>(
      `/codes-promos/${code}`,
      promoCode,
    );
    return response.data;
  },

  deletePromoCode: async (code: string): Promise<void> => {
    await axiosInstance.put(`/codes-promos/${code}/delete`);
  },

  activatePromoCode: async (code: string): Promise<void> => {
    await axiosInstance.put(`/codes-promos/${code}/activate`);
  },

  deactivatePromoCode: async (code: string): Promise<void> => {
    await axiosInstance.put(`/codes-promos/${code}/deactivate`);
  },

  getAllActivePromoCodes: async (
    params?: PaginationParams,
  ): Promise<PaginatedResponse<CodePromo>> => {
    const queryParams = new URLSearchParams({
      page: String(params?.page || 0),
      size: String(params?.size || 10),
    });
    const response = await axiosInstance.get<PaginatedResponse<CodePromo>>(
      `/codes-promos/all-active?${queryParams}`,
    );
    return response.data;
  },
};
