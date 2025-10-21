import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { SatelliteImage, IndexStats } from '../../types';

// Extended satellite image interface for NDVI overlay
export interface NDVISatelliteImage extends SatelliteImage {
  id: string;
  type: 'ndvi' | 'evi' | 'rgb' | 'infrared';
  tileUrl: string;
  source: 'sentinel-2' | 'landsat-8';
}

export interface NDVIData {
  fieldId: string;
  images: NDVISatelliteImage[];
  stats: IndexStats & { std: number };
  histogram: Array<{ value: number; count: number }>;
}

export interface SatelliteState {
  // Current overlay state
  isVisible: boolean;
  opacity: number;
  selectedDate: string | null;
  selectedType: 'ndvi' | 'evi' | 'rgb' | 'infrared';
  
  // Data
  currentField: string | null;
  ndviData: NDVIData | null;
  availableImages: NDVISatelliteImage[];
  
  // UI state
  loading: boolean;
  error: string | null;
  
  // Settings
  dateRange: {
    start: string;
    end: string;
  };
  colorScale: {
    min: number;
    max: number;
    palette: string[];
  };
}

const initialState: SatelliteState = {
  isVisible: true,
  opacity: 1.0,
  selectedDate: null,
  selectedType: 'ndvi',
  currentField: null,
  ndviData: null,
  availableImages: [],
  loading: false,
  error: null,
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0] // today
  },
  colorScale: {
    min: 0,
    max: 1,
    palette: ['#8B0000', '#FF0000', '#FF4500', '#FFA500', '#FFD700', '#ADFF2F', '#32CD32', '#006400'] // Enhanced vibrant colors: dark red to dark green
  }
};

// Async thunks for API calls
export const fetchSatelliteImages = createAsyncThunk(
  'satellite/fetchImages',
  async (params: { fieldId: string; startDate: string; endDate: string; type?: string }) => {
    const { fieldId, startDate, endDate, type = 'ndvi' } = params;
    
    try {
      // Import the API functions dynamically to avoid circular dependencies
      const { getSatelliteImages, getNDVITileUrl } = await import('../../services/geo');
      
      const images = await getSatelliteImages(
        fieldId, 
        startDate, 
        endDate, 
        type as 'ndvi' | 'evi' | 'rgb' | 'infrared'
      );

      // Convert to NDVISatelliteImage format
      const imagesWithTileUrls: NDVISatelliteImage[] = images.map((img, index) => ({
        ...img,
        id: `${fieldId}_${index}_${Date.now()}`, // Generate unique ID
        type: type as 'ndvi' | 'evi' | 'rgb' | 'infrared',
        tileUrl: img.default_tile || getNDVITileUrl(`${fieldId}_${index}`),
        source: img.satellite_type.includes('Sentinel') ? 'sentinel-2' : 'landsat-8'
      }));

      return {
        fieldId,
        images: imagesWithTileUrls,
        stats: {
          min: 0.1,
          max: 0.9,
          mean: 0.65,
          std: 0.15
        },
        histogram: Array.from({ length: 10 }, (_, i) => ({
          value: i * 0.1,
          count: Math.floor(Math.random() * 100)
        }))
      };
    } catch {
      // Fallback to mock data for development
      const mockImages: NDVISatelliteImage[] = [
        {
          id: '1',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          time: '12:00:00',
          timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
          satellite_type: 'Sentinel-2',
          cloud_cover: 15,
          tile_urls: { ndvi: 'mock_url' },
          image_previews: { ndvi: 'mock_preview' },
          available_indices: ['ndvi', 'evi'],
          default_index: 'ndvi',
          default_preview: 'mock_preview',
          default_tile: 'https://api.agromonitoring.com/image/1.0/00000000000000000000000000000000/{z}/{x}/{y}?appid=demo',
          index_stats: {
            ndvi: { min: 0.1, max: 0.9, mean: 0.65 }
          },
          type: 'ndvi',
          tileUrl: 'https://api.agromonitoring.com/image/1.0/00000000000000000000000000000000/{z}/{x}/{y}?appid=demo',
          source: 'sentinel-2'
        },
        {
          id: '2',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          time: '12:00:00',
          timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
          satellite_type: 'Sentinel-2',
          cloud_cover: 8,
          tile_urls: { ndvi: 'mock_url' },
          image_previews: { ndvi: 'mock_preview' },
          available_indices: ['ndvi', 'evi'],
          default_index: 'ndvi',
          default_preview: 'mock_preview',
          default_tile: 'https://api.agromonitoring.com/image/1.0/11111111111111111111111111111111/{z}/{x}/{y}?appid=demo',
          index_stats: {
            ndvi: { min: 0.1, max: 0.9, mean: 0.65 }
          },
          type: 'ndvi',
          tileUrl: 'https://api.agromonitoring.com/image/1.0/11111111111111111111111111111111/{z}/{x}/{y}?appid=demo',
          source: 'sentinel-2'
        }
      ];

      return {
        fieldId,
        images: mockImages,
        stats: {
          min: 0.1,
          max: 0.9,
          mean: 0.65,
          std: 0.15
        },
        histogram: Array.from({ length: 10 }, (_, i) => ({
          value: i * 0.1,
          count: Math.floor(Math.random() * 100)
        }))
      };
    }
  }
);

export const fetchNDVIData = createAsyncThunk(
  'satellite/fetchNDVI',
  async (params: { fieldId: string; imageId: string }) => {
    const { fieldId, imageId } = params;
    
    // Mock NDVI statistics - will be replaced with actual API call
    return {
      fieldId,
      imageId,
      statistics: {
        min: 0.1,
        max: 0.9,
        mean: 0.65,
        std: 0.15,
        healthScore: 78
      }
    };
  }
);

const satelliteSlice = createSlice({
  name: 'satellite',
  initialState,
  reducers: {
    toggleOverlay: (state) => {
      state.isVisible = !state.isVisible;
    },
    setOpacity: (state, action: PayloadAction<number>) => {
      state.opacity = Math.max(0, Math.min(1, action.payload));
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setSelectedType: (state, action: PayloadAction<'ndvi' | 'evi' | 'rgb' | 'infrared'>) => {
      state.selectedType = action.payload;
    },
    setDateRange: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.dateRange = action.payload;
    },
    setCurrentField: (state, action: PayloadAction<string | null>) => {
      state.currentField = action.payload;
      if (!action.payload) {
        // Clear data when no field is selected
        state.isVisible = false;
        state.ndviData = null;
        state.availableImages = [];
        state.selectedDate = null;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    hideOverlay: (state) => {
      state.isVisible = false;
    },
    showOverlay: (state) => {
      state.isVisible = true;
    },
    setColorScale: (state, action: PayloadAction<{ min: number; max: number; palette?: string[] }>) => {
      state.colorScale = { ...state.colorScale, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch satellite images
      .addCase(fetchSatelliteImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSatelliteImages.fulfilled, (state, action) => {
        state.loading = false;
        state.ndviData = action.payload;
        state.availableImages = action.payload.images;
        
        // Auto-select the most recent image
        if (action.payload.images.length > 0) {
          const mostRecent = action.payload.images.reduce((latest, current) => 
            new Date(current.date) > new Date(latest.date) ? current : latest
          );
          state.selectedDate = mostRecent.date;
        }
      })
      .addCase(fetchSatelliteImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch satellite images';
      })
      
      // Fetch NDVI data
      .addCase(fetchNDVIData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNDVIData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchNDVIData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch NDVI data';
      });
  }
});

export const {
  toggleOverlay,
  setOpacity,
  setSelectedDate,
  setSelectedType,
  setDateRange,
  setCurrentField,
  clearError,
  hideOverlay,
  showOverlay,
  setColorScale
} = satelliteSlice.actions;

export default satelliteSlice.reducer;

// Selectors
export const selectSatellite = (state: { satellite: SatelliteState }) => state.satellite;
export const selectIsOverlayVisible = (state: { satellite: SatelliteState }) => state.satellite.isVisible;
export const selectOverlayOpacity = (state: { satellite: SatelliteState }) => state.satellite.opacity;
export const selectCurrentImage = (state: { satellite: SatelliteState }) => {
  const { availableImages, selectedDate } = state.satellite;
  if (!selectedDate || !availableImages.length) return null;
  return availableImages.find(img => img.date === selectedDate) || null;
};
export const selectNDVIStats = (state: { satellite: SatelliteState }) => state.satellite.ndviData?.stats || null;