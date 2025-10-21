import React, { useState, useRef, useEffect } from 'react';
import { 
  TextField, 
  InputAdornment, 
  IconButton, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Box,
  CircularProgress
} from '@mui/material';
import { Search, Clear, LocationOn } from '@mui/icons-material';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

export interface SearchResult {
  label: string;
  bounds: [[number, number], [number, number]];
  lat: number;
  lng: number;
  raw: any;
}

interface SearchBarProps {
  onLocationSelect: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onLocationSelect, 
  placeholder = "Search for a location...",
  className 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<number | undefined>(undefined);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const provider = useRef<OpenStreetMapProvider | null>(null);
  
  // Initialize provider
  useEffect(() => {
    if (!provider.current) {
      provider.current = new OpenStreetMapProvider({
        params: {
          'accept-language': 'en',
          countrycodes: '',
          addressdetails: 1,
        },
      });
    }
  }, []);

  // Handle search query changes with debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    searchTimeoutRef.current = window.setTimeout(async () => {
      if (!provider.current) return;
      
      setLoading(true);
      try {
        const searchResults = await provider.current.search({ query });
        const formattedResults: SearchResult[] = searchResults.map((result: any) => ({
          label: result.label,
          bounds: result.bounds,
          lat: result.y,
          lng: result.x,
          raw: result
        }));
        setResults(formattedResults);
        setShowResults(formattedResults.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setShowResults(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  // Handle clicks outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultSelect = (result: SearchResult) => {
    setQuery(result.label);
    setShowResults(false);
    onLocationSelect(result);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <Box ref={searchContainerRef} sx={{ position: 'relative', width: '100%' }} className={className}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setShowResults(true)}
        size="small"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderRadius: '10px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            '& fieldset': {
              borderColor: 'rgba(226, 232, 240, 0.8)',
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1e293b',
              borderWidth: '2px',
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {loading ? (
                <CircularProgress size={20} sx={{ color: '#64748b' }} />
              ) : (
                <Search sx={{ color: '#64748b', fontSize: 20 }} />
              )}
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton 
                size="small" 
                onClick={handleClear}
                sx={{ color: '#64748b' }}
              >
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {showResults && results.length > 0 && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 2000,
            maxHeight: '300px',
            overflowY: 'auto',
            mt: 1,
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(226, 232, 240, 0.6)',
            boxShadow: '0 8px 28px rgba(0, 0, 0, 0.12), 0 3px 8px rgba(0, 0, 0, 0.06)',
          }}
        >
          <List disablePadding>
            {results.map((result, index) => (
              <ListItem
                key={index}
                component="div"
                onClick={() => handleResultSelect(result)}
                sx={{
                  borderBottom: index < results.length - 1 ? '1px solid #f1f5f9' : 'none',
                  transition: 'all 200ms ease-in-out',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <LocationOn sx={{ color: '#64748b', mr: 2, fontSize: 20 }} />
                <ListItemText
                  primary={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#1e293b',
                        fontWeight: 500,
                        fontSize: '14px'
                      }}
                    >
                      {result.label}
                    </Typography>
                  }
                  secondary={
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b',
                        fontSize: '12px'
                      }}
                    >
                      {result.lat.toFixed(4)}, {result.lng.toFixed(4)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;