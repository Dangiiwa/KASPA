// User and Authentication Types
export interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  business_name?: string;
  access_token?: string;
  refresh_token?: string;
  scheduled_analysis_enabled?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  business_name?: string;
}

export interface ResponsePayload {
  message: string;
  [key: string]: any;
}

// Field/Farm Types
export interface Field {
  id: string;
  name: string;
  area: number;
  field_status: "unplanted" | "active";
  geo_json: GeoJSON;
  currentWeather?: WeatherData;
  currentSoil?: CurrentSoil;
  currentUVI?: CurrentUVI;
  satelliteImage?: SatelliteImage[];
  precipitationData?: PrecipitationData[];
  weatherHistory?: WeatherData[];
}

export interface GeoJSON {
  type: string;
  properties: {};
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

export interface createPolygonsPayload {
  name: string;
  geo_json: GeoJSON;
  field_status: "unplanted" | "active";
}

// Weather Types
export interface WeatherData {
  dt: number;
  wind: { deg: number; gust: number; speed: number };
  clouds: { all: number };
  weather: { description: string; id: number; main: string; icon: string }[];
  main: {
    feels_like: number;
    grnd_level: number;
    humidity: number;
    pressure: number;
    sea_level: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
}

export interface PrecipitationData {
  rain: number;
  count: number;
  dt: number;
}

export interface TemperatureData {
  temp: number;
  count: number;
  dt: number;
}

export interface CurrentSoil {
  dt: number;
  t0: number;
  t10: number;
  moisture: number;
}

export interface CurrentUVI {
  dt: number;
  uvi: number;
}

export interface SatelliteImage {
  date: string;
  time: string;
  timestamp: number;
  satellite_type: string;
  cloud_cover: number;
  tile_urls: Record<string, string>;
  image_previews: Record<string, string>;
  available_indices: string[];
  default_index: string;
  default_preview: string;
  default_tile: string;
  index_stats: Record<string, IndexStats>;
}

export interface IndexStats {
  mean: number;
  max: number;
  min: number;
}

// Redux State Types
export interface GlobalState {
  user: {
    userData: UserData;
    authenticated: boolean;
  };
  fields: {
    data: Field[];
    loading: boolean;
  };
}