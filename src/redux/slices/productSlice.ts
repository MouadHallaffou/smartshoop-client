import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product, PaginationParams, PaginatedResponse } from "../../types";
import { productService } from "../../services/ProductService";

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
  },
};


export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params?: PaginationParams) => {
    const response = await productService.getAllActiveProducts(params);
    return response;
  },
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: number) => {
    const response = await productService.getProductById(id);
    return response;
  },
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (product: Product) => {
    const response = await productService.createProduct(product);
    return response;
  },
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, product }: { id: number; product: Product }) => {
    const response = await productService.updateProduct(id, product);
    return response;
  },
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: number) => {
    await productService.deleteProduct(id);
    return id;
  },
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Product>>) => {
          state.loading = false;
          state.products = action.payload.content;
          state.pagination = {
            totalElements: action.payload.totalElements,
            totalPages: action.payload.totalPages,
            currentPage: action.payload.number,
            pageSize: action.payload.size,
          };
        },
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Erreur lors du chargement des produits";
      })

      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.currentProduct = action.payload;
        },
      )
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Erreur lors du chargement du produit";
      })

      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.products.unshift(action.payload);
        },
      )
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Erreur lors de la création du produit";
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          const index = state.products.findIndex(
            (p) => p.id === action.payload.id,
          );
          if (index !== -1) {
            state.products[index] = action.payload;
          }
          state.currentProduct = action.payload;
        },
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Erreur lors de la mise à jour du produit";
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.products = state.products.filter(
            (p) => p.id !== action.payload,
          );
        },
      )
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Erreur lors de la suppression du produit";
      });
  },
});

export const { clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
