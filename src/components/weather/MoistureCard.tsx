import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { TrendingDown, WaterDrop } from '@mui/icons-material';
import type { CurrentSoil } from '../../types';

interface MoistureCardProps {
  currentSoil?: CurrentSoil;
}

const MoistureCard: React.FC<MoistureCardProps> = ({ currentSoil }) => {
  const [animatedPercentage, setAnimatedPercentage] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  const moisturePercentage = currentSoil ? (currentSoil.moisture * 100) : 8;

  React.useEffect(() => {
    // Animate the percentage when component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
      setAnimatedPercentage(moisturePercentage);
    }, 400);

    return () => clearTimeout(timer);
  }, [moisturePercentage]);
  
  const getMoistureColor = () => {
    if (moisturePercentage >= 30) return '#4caf50';
    if (moisturePercentage >= 15) return '#ff9800';
    return '#f44336';
  };

  const getMoistureGradient = () => {
    if (moisturePercentage >= 30) {
      return 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)';
    } else if (moisturePercentage >= 15) {
      return 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)';
    } else {
      return 'linear-gradient(135deg, #f44336 0%, #e57373 100%)';
    }
  };

  const getMoistureLevel = () => {
    if (moisturePercentage >= 30) return 'Optimal';
    if (moisturePercentage >= 15) return 'Low';
    return 'Critical';
  };

  // Generate mock chart data points for the arc visualization
  const generateChartData = () => {
    const points = [];
    const days = ['10', '11', '12', '13', '14', '15', '16'];
    for (let i = 0; i < days.length; i++) {
      const value = moisturePercentage + Math.random() * 10 - 5;
      points.push({ day: days[i], value: Math.max(0, Math.min(100, value)) });
    }
    return points;
  };

  const chartData = generateChartData();

  return (
    <div className={`dashlet ${
      getMoistureLevel() === 'Critical' ? 'dashlet--primary' : 
      getMoistureLevel() === 'Low' ? 'dashlet--warning' : 
      'dashlet--info'
    } animate-fade-in-up`}>
        {/* Header */}
        <div className="dashlet-header">
          <h3 className="dashlet-title">Moisture</h3>
          <Box display="flex" alignItems="center" gap={0.5}>
            <WaterDrop className="dashlet-icon" sx={{ color: getMoistureColor() }} />
            <span className={`status-indicator ${
              getMoistureLevel() === 'Critical' ? 'status-critical' : 
              getMoistureLevel() === 'Low' ? 'status-low-match' : 
              'status-best-match'
            }`}>
              {getMoistureLevel()}
            </span>
          </Box>
        </div>

        {/* Compact Content */}
        <Box display="flex" flexDirection="column" flex={1} justifyContent="space-between">
          {/* Value and Simple Trend */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <div className="dashlet-value">
              {Math.round(animatedPercentage)}%
            </div>
            <Box display="flex" alignItems="center" gap={0.5}>
              <TrendingDown sx={{ 
                color: '#dc2626', 
                fontSize: 16
              }} />
              <Typography variant="caption" sx={{ 
                color: '#dc2626',
                fontWeight: 500,
                fontSize: '12px'
              }}>
                -7%
              </Typography>
            </Box>
          </Box>

          {/* Clean Progress Bar */}
          <Box mb={1}>
            <LinearProgress 
              variant="determinate" 
              value={animatedPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#f1f5f9',
                '& .MuiLinearProgress-bar': {
                  background: getMoistureGradient(),
                  borderRadius: 4
                }
              }}
            />
          </Box>

          {/* Temperature Info */}
          {currentSoil && (
            <p className="dashlet-subtitle">
              Soil: {currentSoil.t0.toFixed(1)}°C
            </p>
          )}
        </Box>
    </div>
  );
};

export default MoistureCard;