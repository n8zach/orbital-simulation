# Orbital Simulation

An interactive solar system orbital simulation showing the Sun and 8 planets with accurate Keplerian mechanics, dynamic reference frames, and configurable trails.

## Features

- **Accurate Orbital Mechanics**: Uses NASA/JPL orbital parameters with Keplerian elliptical orbits
- **Dynamic Reference Frames**: Center on any celestial body to see motion from that perspective
- **Visual Trails**: Configurable trails showing historical paths with non-linear fade
- **Time Controls**: Adjustable simulation speed (default: 1 Earth year = 5 seconds)
- **Zoom Controls**: Mouse wheel, buttons, and pinch-to-zoom on mobile
- **Mobile Responsive**: Touch-friendly controls and full-screen canvas

## Live Demo

Visit: `https://YOUR-USERNAME.github.io/orbital-simulation/`

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/YOUR-USERNAME/orbital-simulation.git
cd orbital-simulation
```

2. Open in VS Code:
```bash
code .
```

3. Install Live Server extension in VS Code (if not already installed)

4. Right-click `index.html` and select "Open with Live Server"

5. The simulation will open in your browser at `http://localhost:5500`

## Project Structure

```
/orbital-simulation
  /src
    - main.js           # Application entry point
    - physics.js        # Orbital mechanics calculations
    - renderer.js       # Canvas rendering
    - ui.js             # UI controls and events
    - state.js          # State management
    - config.js         # Configuration constants
    - bodies.js         # Planetary data
  /assets
    /images            # (Future: planet images)
  - index.html         # Main HTML file
  - styles.css         # Styling
  - README.md          # This file
  - .gitignore
```

## Configuration

All configurable parameters are in `src/config.js`:

- **Time Scale**: Default speed and range
- **Trail Settings**: Point density, fade effect
- **Visual Settings**: Planet size multipliers
- **Performance**: Adjust for better performance on slower devices

### Performance Tuning

If experiencing low FPS:

1. Reduce `TRAIL_MIN_PIXEL_DISTANCE` in `config.js` (higher = fewer trail points)
2. Reduce trail length slider in UI
3. Disable orbit reference paths

## Controls

### Desktop
- **Zoom**: Scroll wheel or +/- buttons
- **Select Planet**: Click on any planet to center view
- **Time**: Play/pause button and speed slider
- **Display**: Toggle labels and orbit paths

### Mobile/Tablet
- **Zoom**: Pinch gesture or +/- buttons
- **Select Planet**: Tap on any planet
- **All other controls**: Same as desktop

## How It Works

### Orbital Mechanics
- All bodies follow accurate heliocentric Keplerian orbits
- Kepler's equation solved using Newton-Raphson iteration
- Reference frame transformations show relative motion

### Trail System
- Screen-space adaptive: Trail point density adjusts to zoom level
- Trails clear on zoom changes for consistent appearance
- Non-linear fade effect (faster at oldest end)

### Reference Frames
- Click any planet to make it the center
- All other bodies' motion shown relative to centered body
- Trails automatically clear when changing reference frames

## Deployment

### GitHub Pages

1. Push code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to Pages
   - Set Source to "main" branch
   - Save

3. Site will be live at: `https://YOUR-USERNAME.github.io/orbital-simulation/`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

Manual testing checklist in specification document. Key tests:

- Verify Earth completes orbit in 5 seconds at default speed
- Test all zoom controls
- Test planet selection (clicking/tapping)
- Verify trails clear on zoom/reference frame changes
- Check FPS counter for performance monitoring

## Future Enhancements

- 3D visualization
- Planet images/textures
- Additional celestial bodies (moons, asteroids)
- Historical date selection
- Screenshot export
- Keyboard shortcuts

## License

MIT License - Feel free to use and modify

## Credits

- Orbital data: NASA/JPL
- Built with vanilla JavaScript and HTML5 Canvas