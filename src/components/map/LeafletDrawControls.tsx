import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet-geometryutil';
import type { GeoJSON } from '../../types';

interface LeafletDrawControlsProps {
  isDrawingMode: boolean;
  onDrawingModeChange: (isDrawing: boolean) => void;
  onPolygonDrawn: (geoJson: GeoJSON, area: number) => void;
  onPolygonCleared: () => void;
}

const LeafletDrawControls: React.FC<LeafletDrawControlsProps> = ({
  isDrawingMode,
  onDrawingModeChange,
  onPolygonDrawn,
  onPolygonCleared,
}) => {
  const map = useMap();
  const currentPolygonRef = useRef<L.Polygon | null>(null);
  const isInitializedRef = useRef(false);
  
  // Use refs to store the latest callback functions (fixes stale closure)
  const onDrawingModeChangeRef = useRef(onDrawingModeChange);
  const onPolygonDrawnRef = useRef(onPolygonDrawn);
  const onPolygonClearedRef = useRef(onPolygonCleared);

  // Update callback refs on every render (fixes stale closure)
  useEffect(() => {
    onDrawingModeChangeRef.current = onDrawingModeChange;
    onPolygonDrawnRef.current = onPolygonDrawn;
    onPolygonClearedRef.current = onPolygonCleared;
  });

  // Initialize Geoman once
  useEffect(() => {
    if (!map || isInitializedRef.current) return;

    console.log('🚀 Initializing Geoman controls...');

    // Wait a moment for map to be fully ready
    const initTimeout = setTimeout(() => {
      try {
        // Initialize Geoman
        map.pm.addControls({
          position: 'bottomleft',
          drawCircle: false,
          drawMarker: false,
          drawCircleMarker: false,
          drawPolyline: false,
          drawRectangle: false,
          drawPolygon: true,
          editMode: true,
          dragMode: false,
          cutPolygon: false,
          removalMode: true,
          rotateMode: false,
        });

        console.log('✅ Geoman controls added successfully');

        // Configure polygon drawing options with better completion settings
        map.pm.setPathOptions({
          color: '#059669',
          weight: 3,
          opacity: 0.8,
          fillOpacity: 0.2,
          fillColor: '#059669'
        });

        // Set global options for better polygon completion
        map.pm.setGlobalOptions({
          finishOn: 'dblclick', // Double-click to finish
          allowSelfIntersection: false,
          templineStyle: {
            color: '#059669',
            opacity: 0.6,
            weight: 2
          },
          hintlineStyle: {
            color: '#059669',
            opacity: 0.4,
            weight: 1
          }
        });

        console.log('✅ Geoman configuration complete');
        isInitializedRef.current = true;

      } catch (error) {
        console.error('❌ Geoman initialization failed:', error);
      }
    }, 100); // Small delay to ensure map is ready

    // Event handlers for drawing using refs (fixes stale closure)
    const handleDrawCreated = (e: any) => {
      console.log('pm:create event fired!', e);
      const { layer } = e;
      
      // Clear any existing polygons
      map.eachLayer((layer) => {
        if (layer instanceof L.Polygon && layer !== currentPolygonRef.current) {
          map.removeLayer(layer);
        }
      });
      
      currentPolygonRef.current = layer;
      
      // Calculate area in hectares
      const latLngs = layer.getLatLngs()[0] as L.LatLng[];
      const area = L.GeometryUtil.geodesicArea(latLngs) / 10000;
      
      console.log('Polygon area calculated:', area);
      
      // Convert to GeoJSON with proper closure
      const geoJson = layer.toGeoJSON() as GeoJSON;
      
      // Ensure the polygon is properly closed (first point = last point)
      const coordinates = geoJson.geometry.coordinates[0];
      if (coordinates.length > 0) {
        const firstPoint = coordinates[0];
        const lastPoint = coordinates[coordinates.length - 1];
        
        // If not properly closed, close it
        if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
          coordinates.push([firstPoint[0], firstPoint[1]]);
        }
      }
      
      console.log('Calling onPolygonDrawn with:', { geoJson, area });
      
      // Use refs to call the latest callback functions
      onDrawingModeChangeRef.current(false);
      onPolygonDrawnRef.current(geoJson, area);
    };

    const handleDrawDeleted = (e: any) => {
      const { layer } = e;
      if (layer === currentPolygonRef.current) {
        currentPolygonRef.current = null;
        onPolygonClearedRef.current();
      }
    };

    const handleDrawEdited = (e: any) => {
      const { layer } = e;
      if (layer === currentPolygonRef.current) {
        // Recalculate area
        const latLngs = layer.getLatLngs()[0] as L.LatLng[];
        const area = L.GeometryUtil.geodesicArea(latLngs) / 10000;
        
        // Convert to GeoJSON
        const geoJson = layer.toGeoJSON() as GeoJSON;
        
        // Ensure proper closure
        const coordinates = geoJson.geometry.coordinates[0];
        if (coordinates.length > 0) {
          const firstPoint = coordinates[0];
          const lastPoint = coordinates[coordinates.length - 1];
          
          if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
            coordinates.push([firstPoint[0], firstPoint[1]]);
          }
        }
        
        onPolygonDrawnRef.current(geoJson, area);
      }
    };

    const handleDrawStart = (e: any) => {
      console.log('pm:drawstart event fired!', e);
      onDrawingModeChangeRef.current(true);
    };

    const handleDrawStop = (e: any) => {
      console.log('pm:drawend event fired!', e);
      onDrawingModeChangeRef.current(false);
    };

    const handleGlobalCreate = (e: any) => {
      console.log('pm:globaldrawmodetoggled event fired!', e);
    };

    // Attach event listeners for Geoman
    map.on('pm:create', handleDrawCreated);
    map.on('pm:remove', handleDrawDeleted);
    map.on('pm:update', handleDrawEdited);
    map.on('pm:drawstart', handleDrawStart);
    map.on('pm:drawend', handleDrawStop);
    map.on('pm:globaldrawmodetoggled', handleGlobalCreate);
    
    // Additional debugging events
    map.on('pm:vertexadded', (e: any) => console.log('pm:vertexadded', e));
    map.on('pm:centerplaced', (e: any) => console.log('pm:centerplaced', e));

    return () => {
      // Cleanup Geoman events
      map.off('pm:create', handleDrawCreated);
      map.off('pm:remove', handleDrawDeleted);
      map.off('pm:update', handleDrawEdited);
      map.off('pm:drawstart', handleDrawStart);
      map.off('pm:drawend', handleDrawStop);
      map.off('pm:globaldrawmodetoggled', handleGlobalCreate);
      map.off('pm:vertexadded');
      map.off('pm:centerplaced');
    };
  }, [map]); // Remove callback dependencies - they're handled by refs now

  // Handle drawing mode changes from parent
  useEffect(() => {
    if (!map || !isInitializedRef.current) {
      console.log('Drawing mode change skipped - map:', !!map, 'initialized:', isInitializedRef.current);
      return;
    }

    console.log('Drawing mode changed:', isDrawingMode);

    if (isDrawingMode) {
      console.log('✅ Enabling polygon drawing mode...');
      // Enable polygon drawing mode
      map.pm.enableDraw('Polygon');
      console.log('Polygon drawing enabled. Active draw mode:', map.pm.globalDrawModeEnabled());
    } else {
      console.log('❌ Disabling all drawing modes...');
      // Disable all drawing modes
      map.pm.disableDraw();
      console.log('Drawing disabled. Active draw mode:', map.pm.globalDrawModeEnabled());
    }
  }, [isDrawingMode, map]);

  // This component doesn't render anything visible - it just manages the leaflet-draw controls
  return null;
};

export default LeafletDrawControls;