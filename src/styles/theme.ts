export const theme = {
  colors: {
    primary: '#FF78B9',       // Soft pink
    secondary: '#9EEAF9',     // Light blue
    accent: '#FFC2E2',        // Light pink
    background: {
      primary: '#1A1B1E',     // Dark background
      secondary: '#2C2D31',   // Slightly lighter background
      card: '#252629'         // Card background
    },
    text: {
      primary: '#FFFFFF',     // White text
      secondary: '#B4B4B4',   // Light gray text
      accent: '#FF78B9'       // Pink accent text
    },
    shadow: 'rgba(0, 0, 0, 0.3)',
    gradients: {
      primary: 'linear-gradient(135deg, #FF78B9 0%, #FF99CC 100%)',
      secondary: 'linear-gradient(135deg, #9EEAF9 0%, #B5F0FF 100%)',
      card: 'linear-gradient(135deg, #2C2D31 0%, #252629 100%)',
      glow: 'linear-gradient(rgba(255, 120, 185, 0.2) 0%, transparent 100%)'
    }
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.3)',
    large: '0 8px 16px rgba(0, 0, 0, 0.3)',
    glow: '0 4px 20px rgba(255, 120, 185, 0.3)',
    text: '0 0 10px rgba(255, 120, 185, 0.5)'
  },
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.45s ease'
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '20px',
    circle: '50%'
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    heading: {
      fontSize: '2.5rem',
      fontWeight: 700
    },
    subheading: {
      fontSize: '1.8rem',
      fontWeight: 600
    },
    body: {
      fontSize: '1rem',
      fontWeight: 400
    }
  },
  zIndex: {
    menu: 100,
    modal: 200,
    overlay: 150
  }
};
