import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Order, PaginationParams, PaginatedResponse } from "../../types";
import { orderService } from "../../services/OrderService";

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  pagination: {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: {
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  },
};


export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (params?: PaginationParams) => {
    const response = await orderService.getAllOrders(params);
    return response;
  },
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (id: number) => {
    const response = await orderService.getOrderById(id);
    return response;
  },
);

export const createOrder = createAsyncThunk(
  "orders/create",
  async (order: Order) => {
    const response = await orderService.createOrder(order);
    return response;
  },
);

export const updateOrder = createAsyncThunk(
  "orders/update",
  async ({ id, order }: { id: number; order: Order }) => {
    const response = await orderService.updateOrder(id, order);
    return response;
  },
);

export const deleteOrder = createAsyncThunk(
  "orders/delete",
  async (id: number) => {
    await orderService.deleteOrder(id);
    return id;
  },
);

export const confirmOrder = createAsyncThunk(
  "orders/confirm",
  async (id: number) => {
    await orderService.confirmOrder(id);
    return id;
  },
);

export const cancelOrder = createAsyncThunk(
  "orders/cancel",
  async (id: number) => {
    await orderService.cancelOrder(id);
    return id;
  },
);

export const searchOrderByClientName = createAsyncThunk(
  "orders/search",
  async (clientName: string) => {
    const response = await orderService.searchOrderByClientName(clientName);
    return response;
  },
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Order>>) => {
          state.loading = false;
          state.orders = action.payload.content;
          state.pagination = {
            totalElements: action.payload.totalElements,
            totalPages: action.payload.totalPages,
            currentPage: action.payload.number,
            pageSize: action.payload.size,
          };
        },
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Erreur lors du chargement des commandes";
      })

      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.loading = false;
          state.currentOrder = action.payload;
        },
      )
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Erreur lors du chargement de la commande";
      })

      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Erreur lors de la création de la commande";
      })

      // Update order
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.currentOrder = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "Erreur lors de la mise à jour de la commande";
      })

      // Delete order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteOrder.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.orders = state.orders.filter((o) => o.id !== action.payload);
        },
      )
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "Erreur lors de la suppression de la commande";
      })

      // Confirm order
      .addCase(
        confirmOrder.fulfilled,
        (state, action: PayloadAction<number>) => {
          const order = state.orders.find((o) => o.id === action.payload);
          if (order) {
            order.status = "CONFIRMED";
          }
        },
      )

      // Cancel order
      .addCase(
        cancelOrder.fulfilled,
        (state, action: PayloadAction<number>) => {
          const order = state.orders.find((o) => o.id === action.payload);
          if (order) {
            order.status = "CANCELLED";
          }
        },
      )

      // Search order by client name
      .addCase(searchOrderByClientName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchOrderByClientName.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
        },
      )
      .addCase(searchOrderByClientName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erreur lors de la recherche";
      });
  },
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
