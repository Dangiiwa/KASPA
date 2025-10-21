import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Field, createPolygonsPayload } from '../../types';
import { createPolygon } from '../../services/geo';

interface FieldsState {
  data: Field[];
  loading: boolean;
  selectedField: Field | null;
  isTransitioning: boolean;
  autoSelecting: boolean;
  lastSelectedFieldId: string | null;
  creating: boolean;
  createError: string | null;
}

const initialState: FieldsState = {
  data: [],
  loading: false,
  selectedField: null,
  isTransitioning: false,
  autoSelecting: false,
  lastSelectedFieldId: null,
  creating: false,
  createError: null,
};

// Async thunk for creating a new farm/polygon
export const createFarm = createAsyncThunk(
  'fields/createFarm',
  async (farmData: createPolygonsPayload, { rejectWithValue }) => {
    try {
      const response = await createPolygon(farmData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create farm');
    }
  }
);

const fieldsSlice = createSlice({
  name: 'fields',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFields: (state, action: PayloadAction<Field[]>) => {
      state.data = action.payload;
      state.loading = false;
    },
    addField: (state, action: PayloadAction<Field>) => {
      state.data.push(action.payload);
    },
    updateField: (state, action: PayloadAction<Field>) => {
      const index = state.data.findIndex(field => field.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(field => field.id !== action.payload);
    },
    setSelectedField: (state, action: PayloadAction<Field | null>) => {
      state.selectedField = action.payload;
      state.lastSelectedFieldId = action.payload?.id || null;
    },
    setTransitioning: (state, action: PayloadAction<boolean>) => {
      state.isTransitioning = action.payload;
    },
    setAutoSelecting: (state, action: PayloadAction<boolean>) => {
      state.autoSelecting = action.payload;
    },
    selectFirstField: (state) => {
      if (state.data.length > 0) {
        state.selectedField = state.data[0];
        state.lastSelectedFieldId = state.data[0].id;
      }
    },
    clearSelection: (state) => {
      state.selectedField = null;
      state.lastSelectedFieldId = null;
      state.isTransitioning = false;
      state.autoSelecting = false;
    },
    clearCreateError: (state) => {
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFarm.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createFarm.fulfilled, (state, action) => {
        state.creating = false;
        state.createError = null;
        // Note: The actual field data will be added when we refresh the fields list
        // or we could add it directly if the API returns the created field
      })
      .addCase(createFarm.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload as string;
      });
  },
});

export const { 
  setLoading, 
  setFields, 
  addField, 
  updateField, 
  deleteField, 
  setSelectedField,
  setTransitioning,
  setAutoSelecting,
  selectFirstField,
  clearSelection,
  clearCreateError
} = fieldsSlice.actions;

export default fieldsSlice.reducer;