import { CONFIG } from './config.js';

export class UIController {
  constructor(state, renderer) {
    this.state = state;
    this.renderer = renderer;
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Play/Pause
    document.getElementById('play-pause').addEventListener('click', () => {
      this.state.isPaused = !this.state.isPaused;
      document.getElementById('play-pause').textContent = this.state.isPaused ? '▶' : '⏸';
    });
    
    // Speed slider
    const speedSlider = document.getElementById('speed-slider');
    speedSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      // Map 0-100 to logarithmic scale
      const minLog = Math.log(CONFIG.MIN_TIME_SCALE);
      const maxLog = Math.log(CONFIG.MAX_TIME_SCALE);
      const scale = minLog + (value / 100) * (maxLog - minLog);
      this.state.timeScale = Math.exp(scale);
    });
    
    // Set initial speed slider position
    const minLog = Math.log(CONFIG.MIN_TIME_SCALE);
    const maxLog = Math.log(CONFIG.MAX_TIME_SCALE);
    const currentLog = Math.log(this.state.timeScale);
    const initialValue = ((currentLog - minLog) / (maxLog - minLog)) * 100;
    speedSlider.value = initialValue;
    
    // Zoom controls
    document.getElementById('zoom-in').addEventListener('click', () => {
      this.state.zoomIn();
    });
    
    document.getElementById('zoom-out').addEventListener('click', () => {
      this.state.zoomOut();
    });
    
    document.getElementById('reset-view').addEventListener('click', () => {
      this.state.resetView();
    });
    
    // Mouse wheel zoom
    this.renderer.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1 / CONFIG.ZOOM_STEP : CONFIG.ZOOM_STEP;
      this.state.setZoom(this.state.viewport.zoom * zoomFactor);
    }, { passive: false });
    
    // Touch zoom (pinch)
    let lastTouchDistance = null;
    
    this.renderer.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
      }
    });
    
    this.renderer.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && lastTouchDistance !== null) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const zoomFactor = distance / lastTouchDistance;
        this.state.setZoom(this.state.viewport.zoom * zoomFactor);
        
        lastTouchDistance = distance;
      }
    }, { passive: false });
    
    this.renderer.canvas.addEventListener('touchend', () => {
      lastTouchDistance = null;
    });
    
    // Planet clicking
    this.renderer.canvas.addEventListener('click', (e) => {
      this.handleCanvasClick(e.clientX, e.clientY);
    });
    
    this.renderer.canvas.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        this.handleCanvasClick(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
    });
    
    // Display toggles
    document.getElementById('toggle-labels').addEventListener('change', (e) => {
      this.state.showLabels = e.target.checked;
    });
    
    document.getElementById('toggle-orbits').addEventListener('change', (e) => {
      this.state.showOrbitReferencePaths = e.target.checked;
      if (e.target.checked) {
        // Clear cache to regenerate paths
        this.renderer.orbitReferencePaths.clear();
      }
    });
    
    // Trail length slider
    const trailSlider = document.getElementById('trail-slider');
    const trailValue = document.getElementById('trail-value');
    
    trailSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.state.trailLengthOrbits = value;
      trailValue.textContent = value.toFixed(1);
    });
    
    // Window resize
    window.addEventListener('resize', () => {
      this.state.resize(window.innerWidth, window.innerHeight);
      this.renderer.resize(window.innerWidth, window.innerHeight);
    });
  }
  
  handleCanvasClick(clientX, clientY) {
    const rect = this.renderer.canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Check if click is on a planet
    const centerBody = this.state.getCenterBody();
    
    // Import at top of file
    import('./physics.js').then(({ getRelativePosition }) => {
      for (const body of this.state.bodies) {
        // Calculate current position for accurate hit detection
        const currentRelPos = getRelativePosition(body, centerBody, this.state.currentTime);
        const screen = this.renderer.worldToScreen(
          currentRelPos.x,
          currentRelPos.y,
          this.state.viewport.zoom,
          this.state.viewport.width,
          this.state.viewport.height
        );
        
        const baseRadius = body.visual.actualRadius;
        const scale = CONFIG.PLANET_DISPLAY_SCALES[body.id] || 1.0;
        const displayRadius = Math.max(3, (baseRadius * scale) / this.state.viewport.zoom);
        
        const dx = x - screen.x;
        const dy = y - screen.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= displayRadius + 10) { // 10px tolerance for easier clicking
          this.state.setCenterBody(body.id);
          return;
        }
      }
    }
  }
  
  updateUI() {
    // Update time display
    document.getElementById('sim-time').textContent = `Time: ${this.state.getDateString()}`;
    
    // Update time scale display
    document.getElementById('time-scale').textContent = `Speed: ${this.state.getTimeScaleString()}`;
    
    // Update FPS display
    if (this.state.showFPS) {
      document.getElementById('fps-counter').textContent = `FPS: ${this.state.fps}`;
    }
  }
}