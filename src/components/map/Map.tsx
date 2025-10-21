import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box } from '@mui/material';
import { useAppSelector } from '../../redux/hooks';
import type { Field, GeoJSON } from '../../types';
import { useMapTransitions } from '../../hooks/useMapTransitions';
import NDVIOverlay from './NDVIOverlay';
import NDVIControls from './NDVIControls';
import CustomMapControls from './CustomMapControls';
import MapControls from './MapControls';
import LeafletDrawControls from './LeafletDrawControls';
import SearchBar from './SearchBar';
import type { SearchResult } from './SearchBar';

// Fix default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  fields: Field[];
  selectedField?: Field | null;
  onFieldSelect?: (field: Field) => void;
  height?: string;
  showSatellite?: boolean;
  loading?: boolean;
  isTransitioning?: boolean;
  autoSelecting?: boolean;
  // Drawing mode props
  isDrawingMode?: boolean;
  onDrawingModeChange?: (isDrawing: boolean) => void;
  onPolygonDrawn?: (geoJson: GeoJSON, area: number) => void;
  onPolygonCleared?: () => void;
  showSearchBar?: boolean;
  onAddFarm?: () => void;
  isCreatingFarm?: boolean;
}

// Component to handle map reference
const MapRefHandler: React.FC<{ onMapReady: (map: L.Map) => void }> = ({ onMapReady }) => {
  const map = useMap();
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  return null;
};

const MapController: React.FC<{ 
  fields: Field[]; 
  selectedField?: Field | null; 
}> = ({ fields, selectedField }) => {
  const map = useMap();
  const { isTransitioning, autoSelecting } = useAppSelector((state) => state.fields);
  const { transitionToField, transitionToAllFields, cleanup } = useMapTransitions();
  const prevSelectedFieldRef = useRef<Field | null>(null);
  const prevFieldsLengthRef = useRef<number>(0);
  const hasInitializedRef = useRef<boolean>(false);

  // Handle field selection changes with smooth transitions
  useEffect(() => {
    const handleFieldTransition = async () => {
      const prevSelectedField = prevSelectedFieldRef.current;
      const prevFieldsLength = prevFieldsLengthRef.current;
      
      // Skip if no change in selection
      if (prevSelectedField?.id === selectedField?.id && prevFieldsLength === fields.length) {
        return;
      }

      try {
        if (selectedField) {
          // Transition to specific field
          const isInitialLoad = !hasInitializedRef.current && autoSelecting;
          const duration = isInitialLoad ? 1200 : 800; // Longer duration for initial load
          
          await transitionToField(map, selectedField, {
            duration,
            padding: [30, 30],
            maxZoom: 16,
            animate: true,
          });
        } else if (fields.length > 0 && !selectedField) {
          // Show all fields if no specific field is selected
          await transitionToAllFields(map, fields, {
            duration: 800,
            padding: [20, 20],
            maxZoom: 14,
            animate: true,
          });
        }
        
        hasInitializedRef.current = true;
      } catch (error) {
        console.error('Error during map transition:', error);
        // Fallback to instant transition
        if (selectedField) {
          const coordinates = selectedField.geo_json.geometry.coordinates[0];
          const latLngs = coordinates.map(coord => L.latLng(coord[1], coord[0]));
          const polygon = L.polygon(latLngs);
          map.fitBounds(polygon.getBounds(), { padding: [30, 30] });
        } else if (fields.length > 0) {
          const group = new L.FeatureGroup();
          fields.forEach(field => {
            const coordinates = field.geo_json.geometry.coordinates[0];
            const latLngs = coordinates.map(coord => L.latLng(coord[1], coord[0]));
            const polygon = L.polygon(latLngs);
            group.addLayer(polygon);
          });
          if (group.getLayers().length > 0) {
            map.fitBounds(group.getBounds(), { padding: [20, 20] });
          }
        }
      }
      
      // Update refs
      prevSelectedFieldRef.current = selectedField || null;
      prevFieldsLengthRef.current = fields.length;
    };

    handleFieldTransition();
  }, [map, fields, selectedField, isTransitioning, autoSelecting, transitionToField, transitionToAllFields]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return null;
};

const Map: React.FC<MapProps> = ({ 
  fields, 
  selectedField, 
  onFieldSelect, 
  height = '400px',
  showSatellite = true,
  loading = false,
  isTransitioning = false,
  autoSelecting = false,
  isDrawingMode = false,
  onDrawingModeChange,
  onPolygonDrawn,
  onPolygonCleared,
  showSearchBar = false,
  onAddFarm,
  isCreatingFarm = false
}) => {
  const [center, setCenter] = useState<[number, number]>([6.5244, 3.3792]); // Lagos, Nigeria as default
  const [zoom, setZoom] = useState(10);
  const mapRef = useRef<L.Map | null>(null);

  const getPolygonColor = (field: Field) => {
    if (selectedField?.id === field.id) {
      return '#2E7D32'; // Green for selected
    }
    return field.field_status === 'active' ? '#4CAF50' : '#FFC107'; // Different colors for status
  };

  const handleLocationSelect = (result: SearchResult) => {
    if (mapRef.current) {
      const bounds = L.latLngBounds(result.bounds);
      mapRef.current.fitBounds(bounds, {
        padding: [20, 20],
        maxZoom: 18
      });
    }
  };

  const handleMapReady = (map: L.Map) => {
    mapRef.current = map;
  };

  return (
    <Box sx={{ height, width: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        {showSatellite ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri, Maxar, Earthstar Geographics"
          />
        ) : (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
        )}

        <MapRefHandler onMapReady={handleMapReady} />
        <MapController fields={fields} selectedField={selectedField} />
        
        {/* NDVI Overlay - only show when not creating farm */}
        {!isCreatingFarm && <NDVIOverlay fieldId={selectedField?.id} />}

        {/* Custom Map Controls */}
        <CustomMapControls />

        {/* Leaflet Draw Controls */}
        {(() => {
          const hasCallbacks = !!(onDrawingModeChange && onPolygonDrawn && onPolygonCleared);
          console.log('🔍 Map.tsx - LeafletDrawControls conditional check:', {
            isDrawingMode,
            onDrawingModeChange: !!onDrawingModeChange,
            onPolygonDrawn: !!onPolygonDrawn, 
            onPolygonCleared: !!onPolygonCleared,
            hasCallbacks,
            shouldRender: hasCallbacks
          });
          
          return hasCallbacks ? (
            <LeafletDrawControls
              isDrawingMode={isDrawingMode}
              onDrawingModeChange={onDrawingModeChange}
              onPolygonDrawn={onPolygonDrawn}
              onPolygonCleared={onPolygonCleared}
            />
          ) : (
            <div>⚠️ LeafletDrawControls NOT RENDERING - Missing callbacks</div>
          );
        })()}

        {/* Existing Farm Polygons - only show when not creating farm */}
        {!isCreatingFarm && fields.map((field) => {
          const coordinates = field.geo_json.geometry.coordinates[0];
          const positions: [number, number][] = coordinates.map(coord => [coord[1], coord[0]]);

          return (
            <Polygon
              key={field.id}
              positions={positions}
              pathOptions={{
                color: getPolygonColor(field),
                weight: selectedField?.id === field.id ? 3 : 2,
                opacity: 0.8,
                fillOpacity: 0.3,
              }}
              eventHandlers={{
                click: () => {
                  if (onFieldSelect) {
                    onFieldSelect(field);
                  }
                },
              }}
            >
              <Popup>
                <div>
                  <h4>{field.name}</h4>
                  <p>Area: {field.area.toFixed(1)} hectares</p>
                  <p>Status: {field.field_status}</p>
                </div>
              </Popup>
            </Polygon>
          );
        })}
      </MapContainer>
      
      {/* Map Controls - Field Selector */}
      <MapControls 
        fields={fields}
        selectedField={selectedField || null}
        onFieldSelect={onFieldSelect || (() => {})}
        loading={loading}
        isTransitioning={isTransitioning}
        autoSelecting={autoSelecting}
        onAddFarm={onAddFarm}
        isCreatingFarm={isCreatingFarm}
      />
      
      {/* Search Bar */}
      {showSearchBar && (
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 1000,
            width: '300px',
          }}
        >
          <SearchBar onLocationSelect={handleLocationSelect} />
        </Box>
      )}
      
      {/* NDVI Controls - positioned outside MapContainer for proper overlay, hide when creating farm */}
      {!isCreatingFarm && <NDVIControls fieldId={selectedField?.id} />}
    </Box>
  );
};

export default Map;