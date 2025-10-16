import { SimulationState } from './state.js';
import { Renderer } from './renderer.js';
import { UIController } from './ui.js';
import { CONFIG } from './config.js';

class OrbitalSimulation {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.state = new SimulationState();
    this.renderer = new Renderer(this.canvas);
    this.ui = new UIController(this.state, this.renderer);
    
    this.lastTime = performance.now();
    this.fpsFrames = [];
    
    // Initial setup
    this.renderer.resize(window.innerWidth, window.innerHeight);
    this.state.resize(window.innerWidth, window.innerHeight);
    
    // Start animation loop
    this.animate();
  }
  
  calculateFPS(currentTime) {
    this.fpsFrames.push(currentTime);
    
    // Keep only last second of frames
    while (this.fpsFrames.length > 0 && currentTime - this.fpsFrames[0] > 1000) {
      this.fpsFrames.shift();
    }
    
    this.state.fps = this.fpsFrames.length;
  }
  
  animate() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;
    
    // Update FPS
    this.calculateFPS(currentTime);
    
    // Update simulation
    this.state.update(deltaTime);
    
    // Render
    this.renderer.render(this.state);
    
    // Update UI
    this.ui.updateUI();
    
    // Continue animation loop
    requestAnimationFrame(() => this.animate());
  }
}

// Start simulation when page loads
window.addEventListener('DOMContentLoaded', () => {
  new OrbitalSimulation();
});