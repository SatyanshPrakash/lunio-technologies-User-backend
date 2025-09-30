import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface KYCDocument {
  documentType: string;
  documentNumber: string;
  fullName: string;
  frontImage: string;
  backImage: string;
  selfieImage: string;
}

interface KYCStatus {
  id?: number;
  status: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  documentType?: string;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

interface KYCState {
  currentSubmission: Partial<KYCDocument>;
  status: KYCStatus;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
}

const initialState: KYCState = {
  currentSubmission: {},
  status: {
    status: 'not_submitted',
  },
  loading: false,
  error: null,
  uploadProgress: 0,
};

export const submitKYC = createAsyncThunk(
  'kyc/submit',
  async (kycData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch('http://localhost:5000/api/kyc/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: kycData,
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'KYC submission failed');
      }

      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

export const fetchKYCStatus = createAsyncThunk(
  'kyc/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch('http://localhost:5000/api/kyc/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch KYC status');
      }

      return data;
    } catch (error) {
      return rejectWithValue('Network error. Please try again.');
    }
  }
);

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    updateCurrentSubmission: (state, action: PayloadAction<Partial<KYCDocument>>) => {
      state.currentSubmission = { ...state.currentSubmission, ...action.payload };
    },
    clearCurrentSubmission: (state) => {
      state.currentSubmission = {};
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitKYC.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(submitKYC.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.data;
        state.currentSubmission = {};
        state.uploadProgress = 100;
      })
      .addCase(submitKYC.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.uploadProgress = 0;
      })
      .addCase(fetchKYCStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKYCStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.data || { status: 'not_submitted' };
      })
      .addCase(fetchKYCStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateCurrentSubmission, clearCurrentSubmission, setUploadProgress, clearError } = kycSlice.actions;
export default kycSlice.reducer;