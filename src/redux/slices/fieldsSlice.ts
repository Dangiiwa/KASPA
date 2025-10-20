import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Field } from '../../types';

interface FieldsState {
  data: Field[];
  loading: boolean;
  selectedField: Field | null;
  isTransitioning: boolean;
  autoSelecting: boolean;
  lastSelectedFieldId: string | null;
}

const initialState: FieldsState = {
  data: [],
  loading: false,
  selectedField: null,
  isTransitioning: false,
  autoSelecting: false,
  lastSelectedFieldId: null,
};

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
  clearSelection
} = fieldsSlice.actions;

export default fieldsSlice.reducer;