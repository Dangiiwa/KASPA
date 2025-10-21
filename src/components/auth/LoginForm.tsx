import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Paper,
  Container
} from '@mui/material';
import { Visibility, VisibilityOff, Agriculture } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { enqueueSnackbar } from 'notistack';
import { login, getProfile } from '../../services/auth';
import { loginSuccess, setLoading } from '../../redux/slices/userSlice';
import type { LoginPayload } from '../../types';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
});

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values: LoginPayload) => {
      setError('');
      dispatch(setLoading(true));
      
      try {
        const { access_token, refresh_token } = await login(values);
        
        if (access_token) {
          const user = await getProfile(access_token);
          
          dispatch(loginSuccess({
            ...user,
            access_token,
            refresh_token,
          }));
          
          enqueueSnackbar('Login successful!', { variant: 'success' });
          navigate('/dashboard');
        }
      } catch (err: any) {
        const message = err?.error || err?.message || 'Login failed';
        setError(message);
        enqueueSnackbar(message, { variant: 'error' });
      } finally {
        dispatch(setLoading(false));
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2
    }}>
      <Container component="main" maxWidth="xs">
        <Paper 
          elevation={0}
          sx={{ 
            padding: 4, 
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
            transition: 'all 200ms ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              mb: 3,
              px: 3,
              py: 1.5,
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <Agriculture sx={{ fontSize: 24, color: '#059669' }} />
              <Typography 
                component="h1" 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: '#1e293b',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: '18px'
                }}
              >
                KASPA
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              sx={{
                color: '#64748b',
                fontWeight: 500,
                fontSize: '13px'
              }}
            >
              Agricultural Intelligence & Monitoring System
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                  transition: 'all 200ms ease-in-out',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#cbd5e1'
                    }
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1e293b',
                      borderWidth: '1px'
                    }
                  }
                }
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                  transition: 'all 200ms ease-in-out',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#cbd5e1'
                    }
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1e293b',
                      borderWidth: '1px'
                    }
                  }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{
                        color: '#64748b',
                        transition: 'color 200ms ease-in-out',
                        '&:hover': {
                          color: '#1e293b'
                        }
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={formik.values.rememberMe}
                  onChange={formik.handleChange}
                  color="primary"
                />
              }
              label="Remember me"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 3, 
                mb: 2,
                backgroundColor: '#0ea5e9',
                borderRadius: '8px',
                padding: '12px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#0284c7',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                },
                '&:disabled': {
                  backgroundColor: '#94a3b8'
                }
              }}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <Typography 
              variant="body2" 
              align="center"
              sx={{
                color: '#64748b',
                fontSize: '14px'
              }}
            >
              Use your existing AetherView credentials to login
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginForm;