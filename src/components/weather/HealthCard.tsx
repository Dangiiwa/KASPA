import React from 'react';
import { Box, Typography } from '@mui/material';

interface HealthCardProps {
  healthPercentage?: number;
  trend?: 'up' | 'down' | 'stable';
}

const HealthCard: React.FC<HealthCardProps> = ({ 
  healthPercentage = 42,
  trend = 'up'
}) => {
  const [animatedPercentage, setAnimatedPercentage] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(healthPercentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [healthPercentage]);

  const getProgressColor = () => {
    if (healthPercentage >= 70) return '#10b981';
    if (healthPercentage >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getTrendChange = () => {
    return trend === 'up' ? '+22%' : trend === 'down' ? '-22%' : '0%';
  };

  const getHealthAssessment = () => {
    if (healthPercentage >= 85) return { 
      level: 'excellent', 
      color: '#10b981', 
      status: 'Excellent', 
      insight: 'Optimal field conditions'
    };
    if (healthPercentage >= 70) return { 
      level: 'good', 
      color: '#059669', 
      status: 'Good', 
      insight: 'Healthy growth detected'
    };
    if (healthPercentage >= 50) return { 
      level: 'fair', 
      color: '#d97706', 
      status: 'Fair', 
      insight: 'Monitor closely'
    };
    if (healthPercentage >= 30) return { 
      level: 'poor', 
      color: '#dc2626', 
      status: 'Poor', 
      insight: 'Action required'
    };
    return { 
      level: 'critical', 
      color: '#dc2626', 
      status: 'Critical', 
      insight: 'Immediate attention needed'
    };
  };

  const getProgressGradient = () => {
    const assessment = getHealthAssessment();
    return `conic-gradient(
      from 0deg,
      ${assessment.color} 0deg,
      ${assessment.color}aa ${animatedPercentage * 3.6}deg,
      #f1f5f9 ${animatedPercentage * 3.6}deg,
      #e2e8f0 360deg
    )`;
  };

  const getTrendIndicator = () => {
    // Simulate trend based on current health
    if (healthPercentage >= 70) return { direction: 'up', change: '+2.1%', color: '#059669' };
    if (healthPercentage >= 40) return { direction: 'stable', change: '+0.3%', color: '#64748b' };
    return { direction: 'down', change: '-1.2%', color: '#dc2626' };
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
        Health
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
            stroke={getProgressColor()}
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
          color: getProgressColor(),
          fontWeight: 500,
        }}
      >
        {getTrendChange()}
      </Typography>
    </Box>
  );
};

export default HealthCard;