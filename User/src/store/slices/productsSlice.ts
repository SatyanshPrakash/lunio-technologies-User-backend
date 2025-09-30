import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product, FilterState } from '../../pages/products';

interface ProductsState {
  items: Product[];
  featuredProducts: Product[];
  hardwareProducts: Product[];
  softwareProducts: Product[];
  serviceProducts: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: FilterState;
}

const initialState: ProductsState = {
  items: [],
  featuredProducts: [],
  hardwareProducts: [],
  softwareProducts: [],
  serviceProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  },
  filters: {
    productType: '',
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 10000,
    stockStatus: '',
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  },
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, filters }: { page?: number; filters?: Partial<FilterState> }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        status: 'active',
        ...(filters?.productType && { productType: filters.productType }),
        ...(filters?.category && { category: filters.category }),
        ...(filters?.brand && { brand: filters.brand }),
        ...(filters?.minPrice && filters.minPrice > 0 && { minPrice: filters.minPrice.toString() }),
        ...(filters?.maxPrice && filters.maxPrice < 10000 && { maxPrice: filters.maxPrice.toString() }),
        ...(filters?.stockStatus && { stockStatus: filters.stockStatus }),
        sortBy: filters?.sortBy || 'createdAt',
        sortOrder: filters?.sortOrder || 'DESC',
      });

      const response = await fetch(`http://localhost:5000/api/products?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch products');
      }

      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/products?featured=true&limit=8&status=active');
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch featured products');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch product');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const fetchProductsByType = createAsyncThunk(
  'products/fetchProductsByType',
  async ({ productType, limit = 4 }: { productType: 'hardware' | 'software' | 'service'; limit?: number }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        productType,
        featured: 'true',
        limit: limit.toString(),
        status: 'active',
      });

      const response = await fetch(`http://localhost:5000/api/products?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch products');
      }

      return { type: productType, products: data.data };
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductsByType.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByType.fulfilled, (state, action) => {
        state.loading = false;
        const { type, products } = action.payload;
        if (type === 'hardware') {
          state.hardwareProducts = products;
        } else if (type === 'software') {
          state.softwareProducts = products;
        } else if (type === 'service') {
          state.serviceProducts = products;
        }
      })
      .addCase(fetchProductsByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, setPage, clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;