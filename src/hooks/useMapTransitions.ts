import { useRef, useCallback } from 'react';
import { Map as LeafletMap, LatLngBounds } from 'leaflet';
import type { Field } from '../types';

export interface MapTransitionOptions {
  duration?: number;
  padding?: [number, number];
  maxZoom?: number;
  animate?: boolean;
}

const DEFAULT_OPTIONS: Required<MapTransitionOptions> = {
  duration: 800,
  padding: [20, 20],
  maxZoom: 18,
  animate: true,
};

export const useMapTransitions = () => {
  const activeTransitionRef = useRef<boolean>(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calculateFieldBounds = useCallback((field: Field): LatLngBounds => {
    const coordinates = field.geo_json.geometry.coordinates[0];
    const bounds = new LatLngBounds(
      coordinates.map(coord => [coord[1], coord[0]] as [number, number])
    );
    return bounds;
  }, []);

  const calculateAllFieldsBounds = useCallback((fields: Field[]): LatLngBounds => {
    if (fields.length === 0) {
      throw new Error('Cannot calculate bounds for empty fields array');
    }

    let bounds: LatLngBounds | null = null;

    fields.forEach(field => {
      const fieldBounds = calculateFieldBounds(field);
      bounds = bounds ? bounds.extend(fieldBounds) : fieldBounds;
    });

    return bounds!;
  }, [calculateFieldBounds]);

  const transitionToField = useCallback(
    async (
      map: LeafletMap, 
      field: Field, 
      options: MapTransitionOptions = {}
    ): Promise<void> => {
      const opts = { ...DEFAULT_OPTIONS, ...options };
      
      return new Promise((resolve) => {
        // Clear any existing transition
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }

        activeTransitionRef.current = true;
        const bounds = calculateFieldBounds(field);

        if (opts.animate) {
          // Use Leaflet's flyToBounds for smooth animation
          map.flyToBounds(bounds, {
            padding: opts.padding,
            maxZoom: opts.maxZoom,
            duration: opts.duration / 1000, // Leaflet expects seconds
          });

          // Set timeout to match animation duration
          transitionTimeoutRef.current = setTimeout(() => {
            activeTransitionRef.current = false;
            resolve();
          }, opts.duration);
        } else {
          // Instant transition
          map.fitBounds(bounds, {
            padding: opts.padding,
            maxZoom: opts.maxZoom,
          });
          activeTransitionRef.current = false;
          resolve();
        }
      });
    },
    [calculateFieldBounds]
  );

  const transitionToAllFields = useCallback(
    async (
      map: LeafletMap, 
      fields: Field[], 
      options: MapTransitionOptions = {}
    ): Promise<void> => {
      const opts = { ...DEFAULT_OPTIONS, ...options };
      
      return new Promise((resolve, reject) => {
        try {
          // Clear any existing transition
          if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
          }

          activeTransitionRef.current = true;
          const bounds = calculateAllFieldsBounds(fields);

          if (opts.animate) {
            // Use Leaflet's flyToBounds for smooth animation
            map.flyToBounds(bounds, {
              padding: opts.padding,
              maxZoom: opts.maxZoom,
              duration: opts.duration / 1000, // Leaflet expects seconds
            });

            // Set timeout to match animation duration
            transitionTimeoutRef.current = setTimeout(() => {
              activeTransitionRef.current = false;
              resolve();
            }, opts.duration);
          } else {
            // Instant transition
            map.fitBounds(bounds, {
              padding: opts.padding,
              maxZoom: opts.maxZoom,
            });
            activeTransitionRef.current = false;
            resolve();
          }
        } catch (error) {
          activeTransitionRef.current = false;
          reject(error);
        }
      });
    },
    [calculateAllFieldsBounds]
  );

  const cancelTransition = useCallback(() => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    activeTransitionRef.current = false;
  }, []);

  const isTransitioning = useCallback(() => {
    return activeTransitionRef.current;
  }, []);

  // Cleanup effect
  const cleanup = useCallback(() => {
    cancelTransition();
  }, [cancelTransition]);

  return {
    transitionToField,
    transitionToAllFields,
    cancelTransition,
    isTransitioning,
    cleanup,
  };
};