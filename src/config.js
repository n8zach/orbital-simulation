// Configuration Constants - Easily Adjustable

export const CONFIG = {
  // Time settings
  DEFAULT_TIME_SCALE: 6307200, // 1 Earth year = 5 seconds (in sim seconds per real second)
  MIN_TIME_SCALE: 86400, // 1 day/second
  MAX_TIME_SCALE: 31557600000, // 1000 years/second
  
  // Trail settings - PERFORMANCE IMPACT
  TRAIL_MIN_PIXEL_DISTANCE: 3, // Minimum pixels moved before adding trail point
                                // Lower = smoother trails, more points, worse performance
                                // Higher = fewer points, better performance
  MAX_TRAIL_ORBITS: 10,
  TRAIL_FADE_EXPONENT: 2, // Non-linear fade (higher = faster fade at end)
  
  // Visual settings - Planet display size multipliers for natural appearance
  PLANET_DISPLAY_SCALES: {
    sun: 15.0,
    mercury: 10.0,
    venus: 10.0,
    earth: 10.0,
    mars: 10.0,
    jupiter: 8.0,
    saturn: 8.0,
    uranus: 9.0,
    neptune: 9.0,
  },
  
  // Zoom settings
  INITIAL_ZOOM_PADDING: 1.2, // Multiplier for initial view (show all planets with padding)
  ZOOM_STEP: 1.2, // Multiplier per zoom in/out step
  MIN_ZOOM: 0.01,
  MAX_ZOOM: 100,
  
  // Performance settings - CLEARLY LABELED FOR EASY ADJUSTMENT
  TARGET_FPS: 60,
  
  // Physics
  AU: 1.496e11, // Astronomical Unit in meters
  
  // Epoch (J2000.0)
  EPOCH_YEAR: 2000,
  EPOCH_MONTH: 1,
  EPOCH_DAY: 1,
};