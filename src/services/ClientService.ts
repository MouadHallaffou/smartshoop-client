import axiosInstance from "./ApiService";
import type { Client, PaginationParams, PaginatedResponse } from "../types";

export const clientService = {
  createClient: async (client: Client): Promise<Client> => {
    const response = await axiosInstance.post<Client>("/clients", client);
    return response.data;
  },

  getClientById: async (id: number): Promise<Client> => {
    const response = await axiosInstance.get<Client>(`/clients/${id}`);
    return response.data;
  },

  updateClient: async (id: number, client: Client): Promise<Client> => {
    const response = await axiosInstance.put<Client>(`/clients/${id}`, client);
    return response.data;
  },

  updateClientStatus: async (id: number, active: boolean): Promise<void> => {
    await axiosInstance.put(`/clients/${id}/status?active=${active}`);
  },

  deleteClient: async (id: number): Promise<void> => {
    await axiosInstance.put(`/clients/${id}/delete`);
  },

  searchClientByName: async (name: string): Promise<Client[]> => {
    const response = await axiosInstance.get<Client[]>(
      `/clients/searchByName?name=${name}`,
    );
    return response.data;
  },

  getAllActiveClients: async (
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Client>> => {
    const queryParams = new URLSearchParams({
      page: String(params?.page || 0),
      size: String(params?.size || 10),
      sortBy: params?.sortBy || "id",
      sortDir: params?.sortDir || "asc",
    });
    const response = await axiosInstance.get<PaginatedResponse<Client>>(
      `/clients/allActiveClients?${queryParams}`,
    );
    return response.data;
  },
};
