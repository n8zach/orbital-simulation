import { CONFIG } from './config.js';
import { getRelativePosition, generateOrbitReferencePath } from './physics.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.orbitReferencePaths = new Map();
  }
  
  resize(width, height) {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.ctx.scale(dpr, dpr);
  }
  
  clear() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  worldToScreen(x, y, zoom, width, height) {
    return {
      x: (x / zoom) + (width / 2),
      y: -(y / zoom) + (height / 2)
    };
  }
  
  drawTrail(trail, color, state) {
    if (trail.points.length < 2) return;
    
    const maxAge = state.trailLengthOrbits * CONFIG.MAX_TRAIL_ORBITS;
    const currentTime = state.currentTime;
    
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    for (let i = 0; i < trail.points.length - 1; i++) {
      const p1 = trail.points[i];
      const p2 = trail.points[i + 1];
      
      const age = currentTime - p1.time;
      const normalizedAge = age / (maxAge * 86400); // Convert to normalized 0-1
      const opacity = Math.pow(1 - Math.min(normalizedAge, 1), CONFIG.TRAIL_FADE_EXPONENT);
      
      const screen1 = this.worldToScreen(p1.x, p1.y, state.viewport.zoom, state.viewport.width, state.viewport.height);
      const screen2 = this.worldToScreen(p2.x, p2.y, state.viewport.zoom, state.viewport.width, state.viewport.height);
      
      // Parse color and apply opacity
      const rgb = this.hexToRgb(color);
      this.ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
      
      this.ctx.beginPath();
      this.ctx.moveTo(screen1.x, screen1.y);
      this.ctx.lineTo(screen2.x, screen2.y);
      this.ctx.stroke();
    }
  }
  
  drawOrbitReferencePath(body, state) {
    const centerBody = state.getCenterBody();
    const key = `${body.id}_${centerBody.id}`;
    
    // Generate or retrieve cached path
    if (!this.orbitReferencePaths.has(key)) {
      const path = generateOrbitReferencePath(body, centerBody, state.currentTime);
      this.orbitReferencePaths.set(key, path);
    }
    
    const path = this.orbitReferencePaths.get(key);
    if (path.length < 2) return;
    
    this.ctx.strokeStyle = body.visual.trailColor;
    this.ctx.globalAlpha = 0.3;
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([5, 5]);
    
    this.ctx.beginPath();
    const first = this.worldToScreen(path[0].x, path[0].y, state.viewport.zoom, state.viewport.width, state.viewport.height);
    this.ctx.moveTo(first.x, first.y);
    
    for (let i = 1; i < path.length; i++) {
      const screen = this.worldToScreen(path[i].x, path[i].y, state.viewport.zoom, state.viewport.width, state.viewport.height);
      this.ctx.lineTo(screen.x, screen.y);
    }
    
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    this.ctx.globalAlpha = 1.0;
  }
  
  drawBody(body, state) {
    const centerBody = state.getCenterBody();
    const relPos = getRelativePosition(body, centerBody, state.currentTime);
    const screen = this.worldToScreen(relPos.x, relPos.y, state.viewport.zoom, state.viewport.width, state.viewport.height);
    
    // Calculate display radius
    const baseRadius = body.visual.actualRadius;
    const scale = CONFIG.PLANET_DISPLAY_SCALES[body.id] || 1.0;
    const displayRadius = Math.max(3, (baseRadius * scale) / state.viewport.zoom);
    
    // Draw planet as circle (we'll use colors instead of images for simplicity)
    this.ctx.fillStyle = body.visual.color;
    this.ctx.beginPath();
    this.ctx.arc(screen.x, screen.y, displayRadius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add a subtle glow for the sun
    if (body.id === 'sun') {
      const gradient = this.ctx.createRadialGradient(screen.x, screen.y, displayRadius * 0.5, screen.x, screen.y, displayRadius * 2);
      gradient.addColorStop(0, 'rgba(253, 184, 19, 0.8)');
      gradient.addColorStop(1, 'rgba(253, 184, 19, 0)');
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(screen.x, screen.y, displayRadius * 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    return { screen, displayRadius };
  }
  
  drawLabel(body, screen, state) {
    if (!state.showLabels) return;
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '14px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    
    // Draw text with shadow for readability
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    this.ctx.shadowBlur = 4;
    this.ctx.fillText(body.name, screen.x, screen.y + 15);
    this.ctx.shadowBlur = 0;
  }
  
  render(state) {
    this.clear();
    
    const centerBody = state.getCenterBody();
    
    // Clear orbit reference paths cache if center changed
    if (this._lastCenterBodyId !== centerBody.id) {
      this.orbitReferencePaths.clear();
      this._lastCenterBodyId = centerBody.id;
    }
    
    // Draw orbit reference paths if enabled
    if (state.showOrbitReferencePaths) {
      for (const body of state.bodies) {
        if (body.id !== centerBody.id) {
          this.drawOrbitReferencePath(body, state);
        }
      }
    }
    
    // Draw trails
    for (const body of state.bodies) {
      if (body.trail.points.length > 0) {
        this.drawTrail(body.trail, body.visual.trailColor, state);
      }
    }
    
    // Draw bodies and labels
    for (const body of state.bodies) {
      const { screen } = this.drawBody(body, state);
      this.drawLabel(body, screen, state);
    }
  }
  
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  }
}