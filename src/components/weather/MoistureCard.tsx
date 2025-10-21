import React from 'react';
import { Box, Typography } from '@mui/material';
import type { CurrentSoil } from '../../types';

interface MoistureCardProps {
  currentSoil?: CurrentSoil;
}

const MoistureCard: React.FC<MoistureCardProps> = ({ currentSoil }) => {
  const [animatedPercentage, setAnimatedPercentage] = React.useState(0);
  const moisturePercentage = currentSoil ? (currentSoil.moisture * 100) : 8;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(moisturePercentage);
    }, 200);
    return () => clearTimeout(timer);
  }, [moisturePercentage]);
  
  const getMoistureColor = () => {
    if (moisturePercentage >= 30) return '#10b981';
    if (moisturePercentage >= 15) return '#f59e0b';
    return '#ef4444';
  };

  const getTrendChange = () => {
    return '-7%'; // Mock trend data
  };



  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;
  
  return (
    <Box
      sx={{
        width: 160,
        height: 160,
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: 'none',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#fafafa',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)'
        }
      }}
    >
      {/* Header */}
      <Typography
        variant="caption"
        sx={{
          fontSize: '12px',
          color: '#6b7280',
          fontWeight: 500,
          textAlign: 'center',
          mb: 1
        }}
      >
        Moisture
      </Typography>

      {/* Circular Progress */}
      <Box position="relative" display="flex" alignItems="center" justifyContent="center" mb={1}>
        <svg width="70" height="70" viewBox="0 0 70 70">
          {/* Background Circle */}
          <circle
            cx="35"
            cy="35"
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="3"
          />
          {/* Progress Circle */}
          <circle
            cx="35"
            cy="35"
            r={radius}
            fill="none"
            stroke={getMoistureColor()}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 35 35)"
            style={{
              transition: 'stroke-dashoffset 0.6s ease-in-out',
            }}
          />
        </svg>
        {/* Center Value */}
        <Box
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: '28px',
              color: '#1a1a1a',
              lineHeight: 1,
            }}
          >
            {Math.round(animatedPercentage)}%
          </Typography>
        </Box>
      </Box>

      {/* Trend */}
      <Typography
        variant="caption"
        sx={{
          fontSize: '12px',
          color: getMoistureColor(),
          fontWeight: 500,
        }}
      >
        {getTrendChange()}
      </Typography>
    </Box>
  );
};

export default MoistureCard;