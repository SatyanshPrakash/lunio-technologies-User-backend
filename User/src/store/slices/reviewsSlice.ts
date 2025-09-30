import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  title: string;
  comment: string;
  userName: string;
  userEmail: string;
  productName: string;
  productSku: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ReviewsState {
  items: Review[];
  featuredReviews: Review[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: ReviewsState = {
  items: [],
  featuredReviews: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async ({ page = 1, limit = 10, status = 'approved' }: { page?: number; limit?: number; status?: string }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status,
      });

      const response = await fetch(`http://localhost:5000/api/reviews?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch reviews');
      }

      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const fetchFeaturedReviews = createAsyncThunk(
  'reviews/fetchFeaturedReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/reviews?status=approved&limit=10');
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch featured reviews');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFeaturedReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredReviews = action.payload;
      })
      .addCase(fetchFeaturedReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;