import { useEffect, useCallback } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { 
  setFields, 
  setLoading, 
  setSelectedField, 
  setAutoSelecting,
  setTransitioning,
  clearSelection 
} from '../redux/slices/fieldsSlice';
import { 
  setCurrentField, 
  fetchSatelliteImages 
} from '../redux/slices/satelliteSlice';
import { getPolygons } from '../services/geo';
import type { Field } from '../types';

export const useFields = (autoSelectFirst: boolean = true) => {
  const dispatch = useAppDispatch();
  const { 
    data: fields, 
    loading, 
    selectedField, 
    isTransitioning, 
    autoSelecting,
    lastSelectedFieldId 
  } = useAppSelector((state) => state.fields);
  const { authenticated } = useAppSelector((state) => state.user);

  const selectFieldWithTransition = useCallback(async (field: Field | null, isAutoSelect: boolean = false) => {
    if (!field) {
      dispatch(setSelectedField(null));
      dispatch(setCurrentField(null));
      return;
    }

    try {
      // Set loading states
      if (isAutoSelect) {
        dispatch(setAutoSelecting(true));
      } else {
        dispatch(setTransitioning(true));
      }

      // Update selected field
      dispatch(setSelectedField(field));
      dispatch(setCurrentField(field.id));
      
      // Fetch satellite images for the field
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      await dispatch(fetchSatelliteImages({
        fieldId: field.id,
        startDate,
        endDate,
        type: 'ndvi'
      }));

      enqueueSnackbar(`Selected ${field.name}`, { variant: 'info' });
    } catch (error: unknown) {
      console.error('Error selecting field:', error);
      enqueueSnackbar('Failed to select field', { variant: 'error' });
    } finally {
      // Clear loading states after a short delay to allow animations
      setTimeout(() => {
        if (isAutoSelect) {
          dispatch(setAutoSelecting(false));
        } else {
          dispatch(setTransitioning(false));
        }
      }, 100);
    }
  }, [dispatch]);

  const selectField = useCallback((field: Field | null) => {
    selectFieldWithTransition(field, false);
  }, [selectFieldWithTransition]);

  const clearFieldSelection = useCallback(() => {
    dispatch(clearSelection());
    dispatch(setCurrentField(null));
  }, [dispatch]);

  const fetchFields = useCallback(async () => {
    if (!authenticated) return;
    
    dispatch(setLoading(true));
    try {
      const fieldsData = await getPolygons();
      dispatch(setFields(fieldsData));
      
      // Auto-select first field if enabled and no field is currently selected
      if (autoSelectFirst && fieldsData.length > 0 && !selectedField) {
        await selectFieldWithTransition(fieldsData[0], true);
      }
    } catch (error: unknown) {
      console.error('Error fetching fields:', error);
      enqueueSnackbar('Failed to fetch fields', { variant: 'error' });
    } finally {
      dispatch(setLoading(false));
    }
  }, [authenticated, autoSelectFirst, selectedField, dispatch, selectFieldWithTransition]);

  useEffect(() => {
    if (authenticated && fields.length === 0) {
      fetchFields();
    }
  }, [authenticated, fields.length, fetchFields]);

  // Clear selection when user logs out
  useEffect(() => {
    if (!authenticated) {
      clearFieldSelection();
    }
  }, [authenticated, clearFieldSelection]);

  return {
    fields,
    loading,
    selectedField,
    isTransitioning,
    autoSelecting,
    lastSelectedFieldId,
    fetchFields,
    selectField,
    selectFieldWithTransition,
    clearFieldSelection,
  };
};