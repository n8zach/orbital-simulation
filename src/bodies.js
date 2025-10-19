import { CONFIG } from './config.js';

// Accurate NASA/JPL orbital parameters (J2000.0 epoch)
// Semi-major axis in AU, converted to meters
// Orbital period in Earth days, converted to seconds

const AU = CONFIG.AU;
const DAY = 86400; // seconds

export const BODIES = [
  {
    id: 'sun',
    name: 'Sun',
    orbitalParams: {
      semiMajorAxis: 0, // Sun is at the origin
      eccentricity: 0,
      orbitalPeriod: 0,
      argumentOfPeriapsis: 0,
      longitudeAscNode: 0,
      inclination: 0,
      meanAnomalyEpoch: 0,
    },
    visual: {
      actualRadius: 6.96e8, // meters
      color: '#FDB813',
      trailColor: '#FDB813',
    },
    mass: 1.989e30,
  },
  {
    id: 'mercury',
    name: 'Mercury',
    orbitalParams: {
      semiMajorAxis: 0.38710 * AU,
      eccentricity: 0.2056,
      orbitalPeriod: 87.969 * DAY,
      argumentOfPeriapsis: 29.124 * Math.PI / 180,
      longitudeAscNode: 48.331 * Math.PI / 180,
      inclination: 7.005 * Math.PI / 180,
      meanAnomalyEpoch: 174.796 * Math.PI / 180,
    },
    visual: {
      actualRadius: 2.4397e6,
      color: '#af5c28',
      trailColor: '#af5c28',
    },
    mass: 3.3011e23,
  },
  {
    id: 'venus',
    name: 'Venus',
    orbitalParams: {
      semiMajorAxis: 0.72333 * AU,
      eccentricity: 0.0067,
      orbitalPeriod: 224.701 * DAY,
      argumentOfPeriapsis: 54.884 * Math.PI / 180,
      longitudeAscNode: 76.680 * Math.PI / 180,
      inclination: 3.395 * Math.PI / 180,
      meanAnomalyEpoch: 50.115 * Math.PI / 180,
    },
    visual: {
      actualRadius: 6.0518e6,
      color: '#49ff76',
      trailColor: '#49ff76',
    },
    mass: 4.8675e24,
  },
  {
    id: 'earth',
    name: 'Earth',
    orbitalParams: {
      semiMajorAxis: 1.00000 * AU,
      eccentricity: 0.0167,
      orbitalPeriod: 365.256 * DAY,
      argumentOfPeriapsis: 114.208 * Math.PI / 180,
      longitudeAscNode: 174.873 * Math.PI / 180,
      inclination: 0.000 * Math.PI / 180,
      meanAnomalyEpoch: 358.617 * Math.PI / 180,
    },
    visual: {
      actualRadius: 6.371e6,
      color: '#4A90E2',
      trailColor: '#4A90E2',
    },
    mass: 5.972e24,
  },
  {
    id: 'mars',
    name: 'Mars',
    orbitalParams: {
      semiMajorAxis: 1.52368 * AU,
      eccentricity: 0.0934,
      orbitalPeriod: 686.980 * DAY,
      argumentOfPeriapsis: 286.502 * Math.PI / 180,
      longitudeAscNode: 49.558 * Math.PI / 180,
      inclination: 1.850 * Math.PI / 180,
      meanAnomalyEpoch: 19.412 * Math.PI / 180,
    },
    visual: {
      actualRadius: 3.3895e6,
      color: '#E1420D',
      trailColor: '#e1420d',
    },
    mass: 6.4171e23,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    orbitalParams: {
      semiMajorAxis: 5.20288 * AU,
      eccentricity: 0.0489,
      orbitalPeriod: 4332.589 * DAY,
      argumentOfPeriapsis: 273.867 * Math.PI / 180,
      longitudeAscNode: 100.464 * Math.PI / 180,
      inclination: 1.303 * Math.PI / 180,
      meanAnomalyEpoch: 20.020 * Math.PI / 180,
    },
    visual: {
      actualRadius: 6.9911e7,
      color: '#ae3ac8',
      trailColor: '#AE3AC8',
    },
    mass: 1.8982e27,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    orbitalParams: {
      semiMajorAxis: 9.53667 * AU,
      eccentricity: 0.0565,
      orbitalPeriod: 10759.22 * DAY,
      argumentOfPeriapsis: 339.392 * Math.PI / 180,
      longitudeAscNode: 113.665 * Math.PI / 180,
      inclination: 2.485 * Math.PI / 180,
      meanAnomalyEpoch: 317.020 * Math.PI / 180,
    },
    visual: {
      actualRadius: 5.8232e7,
      color: '#FAD5A5',
      trailColor: '#FAD5A5',
    },
    mass: 5.6834e26,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    orbitalParams: {
      semiMajorAxis: 19.18916 * AU,
      eccentricity: 0.0457,
      orbitalPeriod: 30688.5 * DAY,
      argumentOfPeriapsis: 96.998857 * Math.PI / 180,
      longitudeAscNode: 74.006 * Math.PI / 180,
      inclination: 0.773 * Math.PI / 180,
      meanAnomalyEpoch: 142.238600 * Math.PI / 180,
    },
    visual: {
      actualRadius: 2.5362e7,
      color: '#4FD0E7',
      trailColor: '#4FD0E7',
    },
    mass: 8.6810e25,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    orbitalParams: {
      semiMajorAxis: 30.06992 * AU,
      eccentricity: 0.0113,
      orbitalPeriod: 60182.0 * DAY,
      argumentOfPeriapsis: 273.187 * Math.PI / 180,
      longitudeAscNode: 131.784 * Math.PI / 180,
      inclination: 1.770 * Math.PI / 180,
      meanAnomalyEpoch: 256.228 * Math.PI / 180,
    },
    visual: {
      actualRadius: 2.4622e7,
      color: '#4166F5',
      trailColor: '#4166F5',
    },
    mass: 1.02413e26,
  },
];