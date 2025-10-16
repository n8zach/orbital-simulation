import { CONFIG } from './config.js';
import { BODIES } from './bodies.js';
import { calculateHeliocentricPosition, getRelativePosition } from './physics.js';

class Trail {
  constructor() {
    this.points = [];
    this.lastScreenX = null;
    this.lastScreenY = null;
  }
  
  addPoint(x, y, time, screenX, screenY) {
    this.points.push({ x, y, time, screenX, screenY });
    this.lastScreenX = screenX;
    this.lastScreenY = screenY;
  }
  
  clear() {
    this.points = [];
    this.lastScreenX = null;
    this.lastScreenY = null;
  }
  
  prune(maxAge) {
    const cutoffTime = this.points.length > 0 ? this.points[this.points.length - 1].time - maxAge : 0;
    while (this.points.length > 0 && this.points[0].time < cutoffTime) {
      this.points.shift();
    }
  }
}

export class SimulationState {
  constructor() {
    // Initialize bodies with trail objects
    this.bodies = BODIES.map(body => ({
      ...body,
      trail: new Trail(),
    }));
    
    this.centerBodyId = 'sun';
    this.currentTime = 0;
    this.timeScale = CONFIG.DEFAULT_TIME_SCALE;
    this.isPaused = false;
    
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      zoom: 1.0,
      lastZoom: 1.0,
    };
    
    this.trailLengthOrbits = 1.0;
    this.showLabels = true;
    this.showOrbitReferencePaths = false;
    this.showFPS = true;
    
    this.fps = 0;
    this.frameTime = 0;
    
    // Calculate initial zoom to fit all planets
    this.resetView();
  }
  
  getCenterBody() {
    return this.bodies.find(b => b.id === this.centerBodyId);
  }
  
  getBody(id) {
    return this.bodies.find(b => b.id === id);
  }
  
  setCenterBody(bodyId) {
    if (this.centerBodyId !== bodyId) {
      this.centerBodyId = bodyId;
      this.clearAllTrails();
    }
  }
  
  setZoom(newZoom) {
    // Clamp zoom
    newZoom = Math.max(CONFIG.MIN_ZOOM, Math.min(CONFIG.MAX_ZOOM, newZoom));
    
    if (Math.abs(newZoom - this.viewport.zoom) > 1e-6) {
      this.viewport.zoom = newZoom;
      this.clearAllTrails();
    }
  }
  
  zoomIn() {
    this.setZoom(this.viewport.zoom * CONFIG.ZOOM_STEP);
  }
  
  zoomOut() {
    this.setZoom(this.viewport.zoom / CONFIG.ZOOM_STEP);
  }
  
  resetView() {
    // Find maximum orbital radius (Neptune)
    let maxRadius = 0;
    for (const body of this.bodies) {
      if (body.orbitalParams.semiMajorAxis > maxRadius) {
        maxRadius = body.orbitalParams.semiMajorAxis;
      }
    }
    
    // If we have trails, include them in the calculation
    if (this.trailLengthOrbits > 0) {
      // Add some padding for trails extending beyond orbit
      maxRadius *= (1 + this.trailLengthOrbits * 0.1);
    }
    
    // Calculate zoom to fit in viewport with padding
    const minDimension = Math.min(this.viewport.width, this.viewport.height);
    const targetZoom = (maxRadius * 2 * CONFIG.INITIAL_ZOOM_PADDING) / minDimension;
    
    this.setZoom(targetZoom);
  }
  
  clearAllTrails() {
    for (const body of this.bodies) {
      body.trail.clear();
    }
  }
  
  updateTrails() {
    const centerBody = this.getCenterBody();
    
    for (const body of this.bodies) {
      const relPos = getRelativePosition(body, centerBody, this.currentTime);
      
      // Transform to screen coordinates for distance check
      const screenX = (relPos.x / this.viewport.zoom) + (this.viewport.width / 2);
      const screenY = -(relPos.y / this.viewport.zoom) + (this.viewport.height / 2);
      
      // Check if we should add a new trail point
      let shouldAdd = false;
      
      if (body.trail.lastScreenX === null || body.trail.lastScreenY === null) {
        shouldAdd = true;
      } else {
        const dx = screenX - body.trail.lastScreenX;
        const dy = screenY - body.trail.lastScreenY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance >= CONFIG.TRAIL_MIN_PIXEL_DISTANCE) {
          shouldAdd = true;
        }
      }
      
      if (shouldAdd) {
        body.trail.addPoint(relPos.x, relPos.y, this.currentTime, screenX, screenY);
      }
      
      // Prune old trail points
      const maxAge = this.trailLengthOrbits * body.orbitalParams.orbitalPeriod;
      body.trail.prune(maxAge);
    }
  }
  
  update(deltaTime) {
    if (!this.isPaused && deltaTime > 0) {
      this.currentTime += deltaTime * this.timeScale;
      this.updateTrails();
    }
  }
  
  resize(width, height) {
    this.viewport.width = width;
    this.viewport.height = height;
  }
  
  // Convert simulation time to date string
  getDateString() {
    const epochDate = new Date(CONFIG.EPOCH_YEAR, CONFIG.EPOCH_MONTH - 1, CONFIG.EPOCH_DAY);
    const simulationDate = new Date(epochDate.getTime() + this.currentTime * 1000);
    
    return simulationDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  // Get time scale as human-readable string
  getTimeScaleString() {
    const daysPerSecond = this.timeScale / 86400;
    
    if (daysPerSecond < 1) {
      return `${daysPerSecond.toFixed(2)}x`;
    } else if (daysPerSecond < 30) {
      return `${daysPerSecond.toFixed(1)} days/sec`;
    } else if (daysPerSecond < 365) {
      const monthsPerSecond = daysPerSecond / 30;
      return `${monthsPerSecond.toFixed(1)} months/sec`;
    } else {
      const yearsPerSecond = daysPerSecond / 365.25;
      return `${yearsPerSecond.toFixed(1)} years/sec`;
    }
  }
}