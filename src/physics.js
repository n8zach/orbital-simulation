// Orbital mechanics calculations using Keplerian elements

/**
 * Solve Kepler's equation: M = E - e*sin(E) for eccentric anomaly E
 * Using Newton-Raphson iteration
 */
function solveKeplersEquation(M, e, tolerance = 1e-6, maxIterations = 20) {
  let E = M; // Initial guess
  
  for (let i = 0; i < maxIterations; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;
    
    if (Math.abs(dE) < tolerance) {
      break;
    }
  }
  
  return E;
}

/**
 * Calculate heliocentric position of a body at given time
 * @param {Object} body - Body with orbital parameters
 * @param {number} time - Simulation time in seconds
 * @returns {Object} - {x, y} position in meters
 */
export function calculateHeliocentricPosition(body, time) {
  const params = body.orbitalParams;
  
  // Sun is always at origin
  if (params.semiMajorAxis === 0) {
    return { x: 0, y: 0 };
  }
  
  // Calculate mean motion (radians per second)
  const n = (2 * Math.PI) / params.orbitalPeriod;
  
  // Calculate mean anomaly
  const M = params.meanAnomalyEpoch + n * time;
  
  // Solve for eccentric anomaly
  const E = solveKeplersEquation(M, params.eccentricity);
  
  // Calculate true anomaly
  const sinE = Math.sin(E);
  const cosE = Math.cos(E);
  const sqrtTerm = Math.sqrt(1 - params.eccentricity * params.eccentricity);
  const nu = Math.atan2(sqrtTerm * sinE, cosE - params.eccentricity);
  
  // Calculate radius
  const r = params.semiMajorAxis * (1 - params.eccentricity * cosE);
  
  // Position in orbital plane
  const xOrbital = r * Math.cos(nu);
  const yOrbital = r * Math.sin(nu);
  
  // Apply argument of periapsis rotation
  const omega = params.argumentOfPeriapsis;
  const cosOmega = Math.cos(omega);
  const sinOmega = Math.sin(omega);
  
  const x = xOrbital * cosOmega - yOrbital * sinOmega;
  const y = xOrbital * sinOmega + yOrbital * cosOmega;
  
  return { x, y };
}

/**
 * Get position of body relative to center body
 * @param {Object} body - Body to get position for
 * @param {Object} centerBody - Reference frame center body
 * @param {number} time - Simulation time
 * @returns {Object} - {x, y} position relative to center body
 */
export function getRelativePosition(body, centerBody, time) {
  const bodyPos = calculateHeliocentricPosition(body, time);
  const centerPos = calculateHeliocentricPosition(centerBody, time);
  
  return {
    x: bodyPos.x - centerPos.x,
    y: bodyPos.y - centerPos.y
  };
}

/**
 * Generate orbit reference path (one complete orbital period)
 * @param {Object} body - Body to generate path for
 * @param {Object} centerBody - Reference frame center
 * @param {number} currentTime - Current simulation time
 * @param {number} points - Number of points to generate
 * @returns {Array} - Array of {x, y} positions
 */
export function generateOrbitReferencePath(body, centerBody, currentTime, points = 360) {
  const path = [];
  
  // Determine which orbital period to use
  const period = centerBody.id === 'sun' 
    ? body.orbitalParams.orbitalPeriod 
    : centerBody.orbitalParams.orbitalPeriod;
  
  if (period === 0) return path; // Sun has no orbit
  
  for (let i = 0; i < points; i++) {
    const t = currentTime + (i / points) * period;
    const pos = getRelativePosition(body, centerBody, t);
    path.push(pos);
  }
  
  // Close the loop
  if (path.length > 0) {
    path.push({ ...path[0] });
  }
  
  return path;
}