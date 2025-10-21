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

// Fallback area calculation using shoelace formula for polygons
const calculatePolygonArea = (latLngs: L.LatLng[]): number => {
  if (latLngs.length < 3) return 0;
  
  // Convert to projected coordinates for more accurate area calculation
  const points = latLngs.map(latLng => {
    // Simple Mercator projection approximation
    const x = latLng.lng * 111319.9; // degrees to meters at equator
    const y = latLng.lat * 110540.0; // degrees to meters
    return { x, y };
  });
  
  // Shoelace formula
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area) / 2; // Return absolute area in square meters
};

const LeafletDrawControls: React.FC<LeafletDrawControlsProps> = ({
  isDrawingMode,
  onDrawingModeChange,
  onPolygonDrawn,
  onPolygonCleared,
}) => {
  const map = useMap();
  const currentPolygonRef = useRef<L.Polygon | null>(null);
  const isInitializedRef = useRef(false);
  
  // Debug: Log component render and props
  console.log('🔧 LeafletDrawControls RENDER:', {
    isDrawingMode,
    hasMap: !!map,
    hasCallbacks: {
      onDrawingModeChange: !!onDrawingModeChange,
      onPolygonDrawn: !!onPolygonDrawn,
      onPolygonCleared: !!onPolygonCleared
    }
  });
  
  // Use refs to store the latest callback functions (fixes stale closure)
  const onDrawingModeChangeRef = useRef(onDrawingModeChange);
  const onPolygonDrawnRef = useRef(onPolygonDrawn);
  const onPolygonClearedRef = useRef(onPolygonCleared);

  // Debug: Log component mount/unmount
  useEffect(() => {
    console.log('🏗️ LeafletDrawControls MOUNTED');
    return () => {
      console.log('🧹 LeafletDrawControls UNMOUNTED');
    };
  }, []);

  // Update callback refs on every render (fixes stale closure)
  useEffect(() => {
    onDrawingModeChangeRef.current = onDrawingModeChange;
    onPolygonDrawnRef.current = onPolygonDrawn;
    onPolygonClearedRef.current = onPolygonCleared;
  });

  // Initialize Geoman configuration (without controls)
  useEffect(() => {
    if (!map || isInitializedRef.current) return;

    console.log('🚀 Initializing Geoman configuration...');
    
    // Add detailed Geoman state debugging
    console.log('🔍 Geoman state check:', {
      hasMapPm: !!map.pm,
      pmMethods: map.pm ? Object.getOwnPropertyNames(map.pm) : 'no pm',
      pmProto: map.pm ? Object.getOwnPropertyNames(Object.getPrototypeOf(map.pm)) : 'no proto'
    });

    try {
      // Wait for map to be fully ready before Geoman setup
      map.whenReady(() => {
        console.log('🗺️ Map is fully ready, setting up Geoman...');
        
        // Configure polygon drawing options (no controls added yet)
        map.pm.setPathOptions({
          color: '#059669',
          weight: 3,
          opacity: 0.8,
          fillOpacity: 0.2,
          fillColor: '#059669'
        });

        // Set global options for better polygon completion
        map.pm.setGlobalOptions({
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
        
        // Setup event listeners AFTER Geoman is fully configured
        setupGeomanEvents();
      });

    } catch (error) {
      console.error('❌ Geoman initialization failed:', error);
    }

    // Move event setup to separate function for better control
    const setupGeomanEvents = () => {
      console.log('🎧 Setting up Geoman event listeners...');
      
      // Try ONLY map.on() approach
      const setupMethod1 = () => {
        console.log('📡 Method 1: Using map.on() for Geoman events');
        
        // Attach event listeners with inline functions that access current ref values
          map.on('pm:create', (e: any) => {
            console.log('🎯 METHOD 1: pm:create event fired!', e);
            handlePolygonCreate(e);
          });
        };
        
        // Common polygon handling function
        const handlePolygonCreate = (e: any) => {
          console.log('🔍 pm:create event details:', {
            layerType: e.layerType,
            shape: e.shape,
            layer: e.layer,
            hasLayer: !!e.layer,
            layerLatLngs: e.layer?.getLatLngs ? e.layer.getLatLngs() : 'no getLatLngs'
          });
          const { layer } = e;
          
          // Set current polygon reference immediately
          currentPolygonRef.current = layer;

          // Clear any existing polygons except the one we just drew
          map.eachLayer((mapLayer) => {
            if (mapLayer instanceof L.Polygon && mapLayer !== currentPolygonRef.current) {
              map.removeLayer(mapLayer);
            }
          });
          
          // Calculate area in hectares with fallback
          const latLngs = layer.getLatLngs()[0] as L.LatLng[];
          let area: number;
          
          try {
            // Try using L.GeometryUtil if available
            if (L.GeometryUtil && typeof L.GeometryUtil.geodesicArea === 'function') {
              area = L.GeometryUtil.geodesicArea(latLngs) / 10000;
              console.log('📐 Area calculated using L.GeometryUtil:', area);
            } else {
              throw new Error('L.GeometryUtil.geodesicArea not available');
            }
          } catch (error) {
            console.warn('⚠️ L.GeometryUtil not available, using fallback area calculation');
            // Fallback: Simple polygon area calculation using shoelace formula
            area = calculatePolygonArea(latLngs) / 10000;
            console.log('📐 Area calculated using fallback method:', area);
          }
          
          console.log('📐 Polygon area calculated:', area);
          
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
          
          console.log('📞 Calling CURRENT onPolygonDrawn with:', { geoJson, area });
          
          // CRITICAL: Access current ref values (not stale closures)
          if (onPolygonDrawnRef.current) {
            onPolygonDrawnRef.current(geoJson, area);
            console.log('✅ onPolygonDrawn called successfully');
          } else {
            console.error('❌ onPolygonDrawnRef.current is null/undefined!');
          }
          
          // REMOVED: Don't immediately change drawing mode - let Dashboard handle timing
          console.log('ℹ️ Drawing mode change will be handled by Dashboard after state settles');
        };
        
        // Try only method 1
        setupMethod1();
        
        // Setup other events with only map.on() methods
        const setupOtherEvents = () => {
          // Standard events
          map.on('pm:drawstart', (e: any) => console.log('🎬 pm:drawstart - Drawing started', e));
          map.on('pm:drawend', (e: any) => {
            console.log('🏁 pm:drawend event fired!', e);
            setTimeout(() => {
              if (onDrawingModeChangeRef.current) {
                onDrawingModeChangeRef.current(false);
                console.log('🔄 Fallback: Drawing mode changed to false via pm:drawend');
              }
            }, 100);
          });
          map.on('pm:vertexadded', (e: any) => console.log('📍 pm:vertexadded - Point added to polygon', e));
        };
        
        setupOtherEvents();
        
        // ENHANCED FALLBACK: Periodic polygon detection
        let polygonCheckInterval: number;
        
        const startPolygonMonitoring = () => {
          console.log('🔄 Starting periodic polygon detection...');
          polygonCheckInterval = window.setInterval(() => {
            let foundPolygon = null;
            map.eachLayer((layer) => {
              if (layer instanceof L.Polygon && layer !== currentPolygonRef.current) {
                console.log('🔍 PERIODIC: Found potential polygon layer:', layer);
                foundPolygon = layer;
              }
            });
            
            if (foundPolygon && !currentPolygonRef.current) {
              console.log('🎯 PERIODIC FALLBACK: Found polygon that events missed!');
              clearInterval(polygonCheckInterval);
              handlePolygonCreate({ layer: foundPolygon, layerType: 'polygon', shape: 'Polygon' });
            }
          }, 500); // Check every 500ms
        };
        
        const stopPolygonMonitoring = () => {
          if (polygonCheckInterval) {
            clearInterval(polygonCheckInterval);
          }
        };
        
        // Start monitoring when drawing mode is enabled
        if (map.pm.globalDrawModeEnabled && map.pm.globalDrawModeEnabled()) {
          startPolygonMonitoring();
        }
      };
      
      // Try setting up events immediately and after delay
      setupGeomanEvents();
      setTimeout(setupGeomanEvents, 100);

    return () => {
      // Cleanup Geoman events (remove all event listeners)
      console.log('🧹 Cleaning up LeafletDrawControls event listeners');
      map.off('pm:create');
      map.off('pm:remove');
      map.off('pm:update');
      map.off('pm:drawstart');
      map.off('pm:drawend');
      map.off('pm:globaldrawmodetoggled');
      map.off('pm:vertexadded');
      map.off('pm:centerplaced');
      map.off('pm:snapdrag');
      map.off('pm:layerreset');
      map.off('pm:markerdragend');
      map.off('click');
    };
  }, [map]); // Remove callback dependencies - they're handled by refs now

  // Handle drawing mode changes - pure programmatic control (no toolbar controls)
  useEffect(() => {
    if (!map || !isInitializedRef.current) {
      console.log('Drawing mode change skipped - map:', !!map, 'initialized:', isInitializedRef.current);
      return;
    }

    console.log('Drawing mode changed:', isDrawingMode);

    if (isDrawingMode) {
      console.log('✅ Enabling polygon drawing mode (pure programmatic)...');
      
      // Enable polygon drawing directly without toolbar controls
      // Test different finishOn configurations to ensure pm:create fires
      console.log('🔧 Attempting polygon drawing with minimal config...');
      
      try {
        // Option 1: Try with no finishOn property (use Geoman defaults)
        map.pm.enableDraw('Polygon', {
          allowSelfIntersection: false,
          continueDrawing: false,
          snappable: true,
          snapDistance: 15
          // Removed finishOn entirely - let Geoman handle completion
        });
        console.log('✅ Polygon drawing enabled with default completion');
      } catch (error) {
        console.error('❌ Failed to enable polygon drawing:', error);
      }
      
      console.log('Polygon drawing enabled. Active draw mode:', map.pm.globalDrawModeEnabled());
    } else {
      console.log('❌ Disabling drawing mode...');
      
      // Disable drawing
      map.pm.disableDraw();
      
      console.log('Drawing disabled');
    }
  }, [isDrawingMode, map]);

  // This component doesn't render anything visible - it just manages the leaflet-draw controls
  return null;
};

export default LeafletDrawControls;