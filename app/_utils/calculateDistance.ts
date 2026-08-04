export const calculateDistanceInMiles = (
  coord1: number[],
  coord2: number[],
) => {
  const coord1Lat = coord1[0];
  const coord1Long = coord1[1];
  const coord2Lat = coord2[0];
  const coord2Long = coord2[1];

  const EARTH_RADIUS_MILES = 3958.8; // Radius of the Earth in miles

  // Convert all degrees to radians upfront
  const φ1 = (coord1Lat * Math.PI) / 180;
  const φ2 = (coord2Lat * Math.PI) / 180;
  const Δφ = ((coord2Lat - coord1Lat) * Math.PI) / 180;
  const Δλ = ((coord2Long - coord1Long) * Math.PI) / 180;

  // Haversine formula for distance calculation in miles
  // Standard Haversine math
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_MILES * c; // Returns distance in miles
};
