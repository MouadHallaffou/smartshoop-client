import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Client, PaginationParams, PaginatedResponse } from "../../types";
import { clientService } from "../../services/ClientService";

interface ClientState {
  clients: Client[];
  currentClient: Client | null;
  loading: boolean;
  error: string | null;
  pagination: {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

const initialState: ClientState = {
  clients: [],
  currentClient: null,
  loading: false,
  error: null,
  pagination: {
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  },
};


export const fetchClients = createAsyncThunk(
  "clients/fetchAll",
  async (params?: PaginationParams) => {
    const response = await clientService.getAllActiveClients(params);
    return response;
  },
);

export const fetchClientById = createAsyncThunk(
  "clients/fetchById",
  async (id: number) => {
    const response = await clientService.getClientById(id);
    return response;
  },
);

export const createClient = createAsyncThunk(
  "clients/create",
  async (client: Client) => {
    const response = await clientService.createClient(client);
    return response;
  },
);

export const updateClient = createAsyncThunk(
  "clients/update",
  async ({ id, client }: { id: number; client: Client }) => {
    const response = await clientService.updateClient(id, client);
    return response;
  },
);

export const deleteClient = createAsyncThunk(
  "clients/delete",
  async (id: number) => {
    await clientService.deleteClient(id);
    return id;
  },
);

export const searchClientByName = createAsyncThunk(
  "clients/search",
  async (name: string) => {
    const response = await clientService.searchClientByName(name);
    return response;
  },
);

const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    clearCurrentClient: (state) => {
      state.currentClient = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all clients
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchClients.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Client>>) => {
          state.loading = false;
          state.clients = action.payload.content;
          state.pagination = {
            totalElements: action.payload.totalElements,
            totalPages: action.payload.totalPages,
            currentPage: action.payload.number,
            pageSize: action.payload.size,
          };
        },
      )
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Erreur lors du chargement des clients";
      })

      // Fetch client by ID
      .addCase(fetchClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchClientById.fulfilled,
        (state, action: PayloadAction<Client>) => {
          state.loading = false;
          state.currentClient = action.payload;
        },
      )
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Erreur lors du chargement du client";
      })

      // Create client
      .addCase(createClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createClient.fulfilled,
        (state, action: PayloadAction<Client>) => {
          state.loading = false;
          state.clients.unshift(action.payload);
        },
      )
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Erreur lors de la création du client";
      })

      // Update client
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateClient.fulfilled,
        (state, action: PayloadAction<Client>) => {
          state.loading = false;
          const index = state.clients.findIndex(
            (c) => c.id === action.payload.id,
          );
          if (index !== -1) {
            state.clients[index] = action.payload;
          }
          state.currentClient = action.payload;
        },
      )
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Erreur lors de la mise à jour du client";
      })

      // Delete client
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteClient.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.clients = state.clients.filter((c) => c.id !== action.payload);
        },
      )
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Erreur lors de la suppression du client";
      })

      // Search client by name
      .addCase(searchClientByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchClientByName.fulfilled,
        (state, action: PayloadAction<Client[]>) => {
          state.loading = false;
          state.clients = action.payload;
        },
      )
      .addCase(searchClientByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur lors de la recherche";
      });
  },
});

export const { clearCurrentClient, clearError } = clientSlice.actions;
export default clientSlice.reducer;
