import React from 'react';
import { TileLayer } from 'react-leaflet';
import { useAppSelector } from '../../redux/hooks';
import { 
  selectIsOverlayVisible, 
  selectOverlayOpacity, 
  selectCurrentImage
} from '../../redux/slices/satelliteSlice';

interface NDVIOverlayProps {
  fieldId?: string;
}

const NDVIOverlay: React.FC<NDVIOverlayProps> = () => {
  const isVisible = useAppSelector(selectIsOverlayVisible);
  const opacity = useAppSelector(selectOverlayOpacity);
  const currentImage = useAppSelector(selectCurrentImage);

  // Don't render if overlay is not visible or no image selected
  if (!isVisible || !currentImage || !currentImage.tileUrl) {
    return null;
  }

  return (
    <TileLayer
      url={currentImage.tileUrl}
      opacity={opacity}
      zIndex={2000} // High z-index to ensure visibility above all map layers
      attribution='&copy; <a href="https://agromonitoring.com/">Agromonitoring</a>'
      className="ndvi-overlay-enhanced" // Add CSS class for enhanced visibility
      // Tile layer options for satellite imagery
      tms={false} // Standard XYZ tile scheme
      maxZoom={18}
      minZoom={1}
      // Optional: Add error handling
      errorTileUrl={undefined}
    />
  );
};

export default NDVIOverlay;