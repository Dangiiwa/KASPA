import type { 
  Field, 
  createPolygonsPayload, 
  ResponsePayload, 
  WeatherData, 
  CurrentSoil, 
  CurrentUVI, 
  SatelliteImage, 
  PrecipitationData, 
  TemperatureData 
} from '../types';
import { $axios } from './api';

const geo = '/geo';

// Polygon/Field API
export const createPolygon = async (payload: createPolygonsPayload): Promise<ResponsePayload> => {
  return $axios.post(`${geo}/polygons`, payload);
};

export const getPolygons = async (): Promise<Field[]> => {
  return $axios.get(`${geo}/polygons`);
};

export const getPolygonById = async (id: string): Promise<Field> => {
  return $axios.get(`${geo}/polygons/${id}`);
};

export const updatePolygon = async (id: string, payload: Partial<Field>): Promise<ResponsePayload> => {
  return $axios.put(`${geo}/polygons/${id}`, payload);
};

export const deletePolygon = async (id: string): Promise<ResponsePayload> => {
  return $axios.delete(`${geo}/polygons/${id}`);
};

// Weather Data API
export const getCurrentWeather = async (id: string): Promise<WeatherData> => {
  return $axios.get(`${geo}/polygons/${id}/weather/current`);
};

export const getWeatherForecast = async (id: string): Promise<ResponsePayload> => {
  return $axios.get(`${geo}/polygons/${id}/weather/forecast`);
};

export const getWeatherHistory = async (
  id: string, 
  start_date: string, 
  end_date: string
): Promise<WeatherData[]> => {
  return $axios.get(`${geo}/polygons/${id}/weather/history?start_date=${start_date}&end_date=${end_date}`);
};

// Accumulated Weather Parameters API
export const getWeatherAccumulatedTemperature = async (
  id: string, 
  start_date: string, 
  end_date: string
): Promise<TemperatureData[]> => {
  return $axios.get(`${geo}/polygons/${id}/weather/accumulated-temperature?start_date=${start_date}&end_date=${end_date}`);
};

export const getWeatherAccumulatedPrecipitation = async (
  id: string, 
  start_date: string, 
  end_date: string
): Promise<PrecipitationData[]> => {
  return $axios.get(`${geo}/polygons/${id}/weather/accumulated-precipitation?start_date=${start_date}&end_date=${end_date}`);
};

// Soil Data API
export const getCurrentSoil = async (id: string): Promise<CurrentSoil> => {
  return $axios.get(`${geo}/polygons/${id}/soil/current`);
};

export const getSoilHistory = async (
  id: string, 
  start_date: string, 
  end_date: string
): Promise<ResponsePayload> => {
  return $axios.get(`${geo}/polygons/${id}/soil/history?start_date=${start_date}&end_date=${end_date}`);
};

// UV Index API
export const getCurrentUVI = async (id: string): Promise<CurrentUVI> => {
  return $axios.get(`${geo}/polygons/${id}/uvi/current`);
};

export const getUVIForecast = async (
  id: string, 
  start_date?: string, 
  end_date?: string
): Promise<ResponsePayload> => {
  const params = start_date && end_date ? `?start_date=${start_date}&end_date=${end_date}` : '';
  return $axios.get(`${geo}/polygons/${id}/uvi/forecast${params}`);
};

// Satellite Imagery API
export const getSatelliteImages = async (
  id: string, 
  start_date: string, 
  end_date: string,
  type?: 'ndvi' | 'evi' | 'rgb' | 'infrared'
): Promise<SatelliteImage[]> => {
  const params = new URLSearchParams({
    start_date,
    end_date,
    ...(type && { type })
  });
  return $axios.get(`${geo}/satellite-images/${id}?${params.toString()}`);
};

// NDVI-specific API endpoints
export const getNDVIImages = async (
  id: string, 
  start_date: string, 
  end_date: string
): Promise<SatelliteImage[]> => {
  return getSatelliteImages(id, start_date, end_date, 'ndvi');
};

export const getNDVIStatistics = async (
  id: string, 
  imageId: string
): Promise<{
  min: number;
  max: number;
  mean: number;
  std: number;
  histogram: Array<{ value: number; count: number }>;
}> => {
  return $axios.get(`${geo}/satellite-images/${id}/ndvi/${imageId}/statistics`);
};

export const getNDVITileUrl = (imageId: string, apiKey?: string): string => {
  // This would generate the tile URL for NDVI overlay
  // For now, returning a mock URL structure
  const key = apiKey || import.meta.env.VITE_AGROMONITORING_API_KEY || 'demo';
  return `https://api.agromonitoring.com/image/1.0/${imageId}/{z}/{x}/{y}?appid=${key}`;
};

export const getFieldHealth = async (
  id: string,
  imageId?: string
): Promise<{
  healthScore: number;
  vegetation: number;
  stress: number;
  moisture: number;
  coverage: number;
}> => {
  const params = imageId ? `?image_id=${imageId}` : '';
  return $axios.get(`${geo}/polygons/${id}/health${params}`);
};

// Get available satellite data sources
export const getSatelliteDataSources = async (
  id: string
): Promise<{
  sentinel2: boolean;
  landsat8: boolean;
  lastUpdate: string;
  coverage: number;
}> => {
  return $axios.get(`${geo}/polygons/${id}/satellite-sources`);
};