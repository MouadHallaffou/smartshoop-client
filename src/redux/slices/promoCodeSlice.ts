import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  CodePromo,
  PaginationParams,
  PaginatedResponse,
} from "../../types";
import { promoCodeService } from "../../services/PromoCodeService";

interface PromoCodeState {
  promoCodes: CodePromo[];
  currentPromoCode: CodePromo | null;
  loading: boolean;
  error: string | null;
  pagination: {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

const initialState: PromoCodeState = {
  promoCodes: [],
  currentPromoCode: null,
  loading: false,
  error: null,
  pagination: {
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  },
};

export const fetchPromoCodes = createAsyncThunk(
  "promoCodes/fetchAll",
  async (params?: PaginationParams) => {
    const response = await promoCodeService.getAllActivePromoCodes(params);
    return response;
  },
);

export const fetchPromoCodeByCode = createAsyncThunk(
  "promoCodes/fetchByCode",
  async (code: string) => {
    const response = await promoCodeService.getPromoCodeByCode(code);
    return response;
  },
);

export const createPromoCode = createAsyncThunk(
  "promoCodes/create",
  async (promoCode: CodePromo) => {
    const response = await promoCodeService.createPromoCode(promoCode);
    return response;
  },
);

export const updatePromoCode = createAsyncThunk(
  "promoCodes/update",
  async ({ code, promoCode }: { code: string; promoCode: CodePromo }) => {
    const response = await promoCodeService.updatePromoCode(code, promoCode);
    return response;
  },
);

export const deletePromoCode = createAsyncThunk(
  "promoCodes/delete",
  async (code: string) => {
    await promoCodeService.deletePromoCode(code);
    return code;
  },
);

export const activatePromoCode = createAsyncThunk(
  "promoCodes/activate",
  async (code: string) => {
    await promoCodeService.activatePromoCode(code);
    return code;
  },
);

export const deactivatePromoCode = createAsyncThunk(
  "promoCodes/deactivate",
  async (code: string) => {
    await promoCodeService.deactivatePromoCode(code);
    return code;
  },
);

const promoCodeSlice = createSlice({
  name: "promoCodes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all promo codes
      .addCase(fetchPromoCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPromoCodes.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<CodePromo>>) => {
          state.loading = false;
          state.promoCodes = action.payload.content;
          state.pagination = {
            totalElements: action.payload.totalElements,
            totalPages: action.payload.totalPages,
            currentPage: action.payload.number,
            pageSize: action.payload.size,
          };
        },
      )
      .addCase(fetchPromoCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch promo codes";
      })
      // Fetch promo code by code
      .addCase(fetchPromoCodeByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPromoCodeByCode.fulfilled,
        (state, action: PayloadAction<CodePromo>) => {
          state.loading = false;
          state.currentPromoCode = action.payload;
        },
      )
      .addCase(fetchPromoCodeByCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch promo code";
      })
      // Create promo code
      .addCase(createPromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createPromoCode.fulfilled,
        (state, action: PayloadAction<CodePromo>) => {
          state.loading = false;
          state.promoCodes.push(action.payload);
        },
      )
      .addCase(createPromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create promo code";
      })
      // Update promo code
      .addCase(updatePromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updatePromoCode.fulfilled,
        (state, action: PayloadAction<CodePromo>) => {
          state.loading = false;
          const index = state.promoCodes.findIndex(
            (pc) => pc.code === action.payload.code,
          );
          if (index !== -1) {
            state.promoCodes[index] = action.payload;
          }
        },
      )
      .addCase(updatePromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update promo code";
      })
      // Delete promo code
      .addCase(deletePromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deletePromoCode.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.promoCodes = state.promoCodes.filter(
            (pc) => pc.code !== action.payload,
          );
        },
      )
      .addCase(deletePromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete promo code";
      })
      // Activate promo code
      .addCase(activatePromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        activatePromoCode.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          const promoCode = state.promoCodes.find(
            (pc) => pc.code === action.payload,
          );
          if (promoCode) {
            promoCode.isActive = true;
          }
        },
      )
      .addCase(activatePromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to activate promo code";
      })
      // Deactivate promo code
      .addCase(deactivatePromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deactivatePromoCode.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          const promoCode = state.promoCodes.find(
            (pc) => pc.code === action.payload,
          );
          if (promoCode) {
            promoCode.isActive = false;
          }
        },
      )
      .addCase(deactivatePromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to deactivate promo code";
      });
  },
});

export const { clearError } = promoCodeSlice.actions;
export default promoCodeSlice.reducer;
