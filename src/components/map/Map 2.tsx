import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { Box } from '@mui/material';
import { useAppSelector } from '../../redux/hooks';
import type { Field } from '../../types';
import { useMapTransitions } from '../../hooks/useMapTransitions';
import NDVIOverlay from './NDVIOverlay';
import NDVIControls from './NDVIControls';
import CustomMapControls from './CustomMapControls';
import MapControls from './MapControls';

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
}

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
  autoSelecting = false
}) => {
  const [center] = useState<[number, number]>([6.5244, 3.3792]); // Lagos, Nigeria as default
  const [zoom] = useState(10);

  const getPolygonColor = (field: Field) => {
    if (selectedField?.id === field.id) {
      return '#2E7D32'; // Green for selected
    }
    return field.field_status === 'active' ? '#4CAF50' : '#FFC107'; // Different colors for status
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

        <MapController fields={fields} selectedField={selectedField} />
        
        {/* NDVI Overlay */}
        <NDVIOverlay fieldId={selectedField?.id} />

        {/* Custom Map Controls */}
        <CustomMapControls />

        {fields.map((field) => {
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
      />
      
      {/* NDVI Controls - positioned outside MapContainer for proper overlay */}
      <NDVIControls fieldId={selectedField?.id} />
    </Box>
  );
};

export default Map;