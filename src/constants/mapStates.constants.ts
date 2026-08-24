import type { TStateOrUT } from '@beautinique/frontend-types';

// Approximate state/UT centroid (capital-city coordinates, a reasonable
// stand-in - the Territory Map (task 6.3) just needs one marker location
// per state, not precise boundary polygons) - `[lng, lat]`, MapLibre's
// order (which `olamaps-web-sdk` wraps), not `{lat, lng}`.
export const STATE_MAP_COORDINATES: Record<TStateOrUT, [number, number]> = {
  'Andhra Pradesh': [80.648, 16.5062],
  'Arunachal Pradesh': [93.6053, 27.0844],
  Assam: [91.7898, 26.1433],
  Bihar: [85.1376, 25.5941],
  Chhattisgarh: [81.6296, 21.2514],
  Goa: [73.8278, 15.4909],
  Gujarat: [72.6369, 23.2156],
  Haryana: [76.0856, 29.0588],
  'Himachal Pradesh': [77.1734, 31.1048],
  Jharkhand: [85.3096, 23.3441],
  Karnataka: [77.5946, 12.9716],
  Kerala: [76.9366, 8.5241],
  'Madhya Pradesh': [77.4126, 23.2599],
  Maharashtra: [72.8777, 19.076],
  Manipur: [93.9368, 24.817],
  Meghalaya: [91.8933, 25.5788],
  Mizoram: [92.7176, 23.7271],
  Nagaland: [94.1086, 25.6751],
  Odisha: [85.8245, 20.2961],
  Punjab: [76.7794, 30.7333],
  Rajasthan: [75.7873, 26.9124],
  Sikkim: [88.6065, 27.3389],
  'Tamil Nadu': [80.2707, 13.0827],
  Telangana: [78.4867, 17.385],
  Tripura: [91.2868, 23.8315],
  'Uttar Pradesh': [80.9462, 26.8467],
  Uttarakhand: [78.0322, 30.3165],
  'West Bengal': [88.3639, 22.5726],
  'Andaman and Nicobar Islands': [92.7265, 11.6234],
  Chandigarh: [76.7794, 30.7333],
  'Dadra and Nagar Haveli and Daman and Diu': [73.0169, 20.2738],
  'Delhi (National Capital Territory of Delhi)': [77.209, 28.6139],
  'Jammu and Kashmir': [74.7973, 34.0837],
  Ladakh: [77.5771, 34.1526],
  Lakshadweep: [72.6358, 10.5593],
  Puducherry: [79.8083, 11.9416],
};

// Shown before anything's picked/hovered - India, roughly centered (same
// default BQ-Client's address-picker map uses).
export const INDIA_MAP_CENTER: [number, number] = [78.6677, 23.3511];
export const INDIA_MAP_ZOOM = 3.6;
