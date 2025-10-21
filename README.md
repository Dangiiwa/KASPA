# KASPA Farm Management System

A simplified agricultural mapping and weather monitoring application built with React, TypeScript, and Material-UI. This demo app leverages the core geoservice features from AetherView to provide farmers with essential farm management tools.

## Features

### 🗺️ Interactive Farm Mapping
- **Leaflet-based Maps**: Interactive satellite and street view maps
- **Farm Polygon Visualization**: View and select farm boundaries
- **Real-time Field Selection**: Click on map polygons to select fields
- **Multi-field Support**: Manage multiple farm fields in one dashboard

### 🌤️ Weather Monitoring
- **Current Weather Data**: Real-time temperature, humidity, wind, and pressure
- **UV Index Monitoring**: Track UV exposure levels for farm safety
- **Soil Moisture**: Monitor soil conditions for optimal crop growth
- **Visual Weather Cards**: Easy-to-read weather information cards
- **Field-specific Data**: Weather data tied to selected farm fields

### 🔐 Authentication
- **Secure Login**: Email/password authentication
- **Existing User Support**: Compatible with AetherView user accounts
- **Session Management**: Automatic token refresh and logout handling
- **Protected Routes**: Secure access to farm data

### 📱 Responsive Design
- **Mobile-friendly**: Optimized for desktop, tablet, and mobile devices
- **Material-UI Components**: Modern, accessible user interface
- **Flexible Layouts**: Adaptive grid layouts for different screen sizes

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: Material-UI (MUI) v6
- **Mapping**: Leaflet, React-Leaflet
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios with interceptors
- **Forms**: Formik with Yup validation
- **Notifications**: Notistack

## Backend Integration

This application integrates with the existing AetherView API:
- **Base URL**: `https://api-aetherview.com/api`
- **Authentication**: JWT-based token authentication
- **Geoservice**: Field/polygon CRUD operations
- **Weather Service**: Current weather, soil, and UV data
- **Cross-compatible**: Works with existing AetherView user accounts

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Access to AetherView API (existing user account recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kaspa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - The `.env` file is already configured for the AetherView API
   - Modify if you need to use a different API endpoint

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Login with existing AetherView credentials

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── common/         # Reusable UI components
│   ├── map/           # Map and geospatial components
│   └── weather/       # Weather information components
├── hooks/             # Custom React hooks
├── pages/             # Main application pages
├── redux/             # State management
│   ├── slices/        # Redux slices
│   └── store.ts       # Store configuration
├── routes/            # Application routing
├── services/          # API service layer
├── types/             # TypeScript type definitions
└── App.tsx           # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

### Authentication
- Login with email/password
- Automatic token management
- Session persistence
- Compatible with existing AetherView accounts

### Geoservice Features
- Fetch user's farm fields/polygons
- Display field boundaries on map
- Field selection and metadata display

### Weather Data
- Current weather conditions
- Soil moisture readings
- UV index monitoring
- Field-specific weather data

## Development Notes

### Key Components

1. **Map Component** (`src/components/map/Map.tsx`)
   - Leaflet integration with polygon display
   - Field selection handling
   - Satellite/street view toggle

2. **Weather Dashboard** (`src/components/weather/WeatherDashboard.tsx`)
   - Weather data fetching and display
   - Multiple weather parameter cards
   - Field-specific weather information

3. **Authentication** (`src/components/auth/LoginForm.tsx`)
   - Simplified login form
   - Form validation with Formik/Yup
   - Redux state management

### State Management
- User authentication state
- Field data and selection
- Loading and error states
- Centralized with Redux Toolkit

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface elements
- Optimized for various screen sizes

## Future Enhancements

The current implementation provides core functionality. Potential improvements include:

1. **Polygon Drawing**: Add new farm field creation with drawing tools
2. **Weather History**: Historical weather data visualization
3. **Weather Forecasts**: Multi-day weather predictions
4. **Satellite Imagery**: Enhanced satellite image overlay
5. **Farm Analytics**: Basic farm health and productivity metrics
6. **Offline Support**: Cached data for offline viewing
7. **Export Features**: Data export to CSV/PDF

## Contributing

This is a demo application showcasing agricultural technology integration. For production use, consider:

- Adding comprehensive error handling
- Implementing proper loading states
- Adding data validation
- Including comprehensive testing
- Optimizing performance for large datasets

## License

This project is a demonstration application for agricultural technology integration.

## Support

For questions about the AetherView API or integration:
- Check the existing AetherView documentation
- Contact the AetherView support team
- Review the API endpoints in `src/services/`

---

**Note**: This application requires valid AetherView API credentials to function properly. The demo showcases the integration patterns and UI components for agricultural farm management.