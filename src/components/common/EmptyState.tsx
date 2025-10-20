import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Agriculture, Add } from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon = <Agriculture sx={{ fontSize: 64 }} />
}) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column"
      alignItems="center" 
      justifyContent="center" 
      p={4}
      textAlign="center"
      color="text.secondary"
    >
      <Box mb={2} color="action.disabled">
        {icon}
      </Box>
      
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <Typography variant="body2" paragraph>
        {description}
      </Typography>
      
      {actionText && onAction && (
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={onAction}
          sx={{ mt: 1 }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;