import React from 'react';
import { Box, Typography } from '@mui/material';
import { TrendingUp, Grass } from '@mui/icons-material';

interface HealthCardProps {
  healthPercentage?: number;
  trend?: 'up' | 'down' | 'stable';
}

const HealthCard: React.FC<HealthCardProps> = ({ 
  healthPercentage = 42,
  trend = 'up'
}) => {
  const [animatedPercentage, setAnimatedPercentage] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Animate the percentage when component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
      setAnimatedPercentage(healthPercentage);
    }, 300);

    return () => clearTimeout(timer);
  }, [healthPercentage]);

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return '#4caf50';
      case 'down': return '#f44336';
      default: return '#ff9800';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
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

  return (
    <div className={`dashlet ${
      healthPercentage >= 70 ? 'dashlet--success' : 
      healthPercentage >= 40 ? 'dashlet--warning' : 
      'dashlet--primary'
    } animate-fade-in-up`}>
      {/* Header */}
      <div className="dashlet-header">
        <h3 className="dashlet-title">Health</h3>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Grass className="dashlet-icon" sx={{ color: getHealthAssessment().color }} />
          <span className={`status-indicator ${
            healthPercentage >= 85 ? 'status-best-match' : 
            healthPercentage >= 70 ? 'status-good-match' : 
            healthPercentage >= 50 ? 'status-fair-match' :
            healthPercentage >= 30 ? 'status-bad-match' : 'status-critical-match'
          }`}>
            {getHealthAssessment().status}
          </span>
        </Box>
      </div>

      {/* Simplified Layout */}
      <Box display="flex" alignItems="center" justifyContent="space-between" flex={1}>
        {/* Advanced Circular Progress */}
        <div 
          className="progress-circular"
          style={{
            background: getProgressGradient(),
            boxShadow: `0 0 0 2px ${getHealthAssessment().color}20`
          }}
        >
          <div 
            className="progress-value"
            style={{ color: getHealthAssessment().color }}
          >
            {Math.round(animatedPercentage)}%
          </div>
        </div>

        {/* Executive Intelligence Section */}
        <Box flex={1} ml={2} display="flex" flexDirection="column" justifyContent="center">
          {/* Advanced Trend Analysis */}
          <Box display="flex" alignItems="center" gap={0.5} mb={1}>
            <TrendingUp sx={{ 
              color: getTrendIndicator().color, 
              fontSize: 16
            }} />
            <Typography 
              variant="caption" 
              sx={{ 
                color: getTrendIndicator().color,
                fontWeight: 600,
                fontSize: '12px'
              }}
            >
              {getTrendIndicator().change}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#64748b',
                fontSize: '11px'
              }}
            >
              vs last week
            </Typography>
          </Box>

          {/* Intelligent Insight */}
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#475569',
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: 1.3
            }}
          >
            {getHealthAssessment().insight}
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default HealthCard;