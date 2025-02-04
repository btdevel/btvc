import {radians} from "../util/math";

const sin = Math.sin
const cos = Math.cos

export function sunPosition(phi, theta) {
  const x = cos(theta) * sin(phi + Math.PI)
  const y = cos(theta) * cos(phi + Math.PI)
  const z = sin(theta)
  return [x, y, z]
}

// export function sunPosition2 (inclination, azimuth) {
//   var theta = Math.PI * (inclination - 0.5)
//   var phi = 2 * Math.PI * (azimuth - 0.5)
//   return sunPosition(phi, theta)
// }

export const declination = d =>
  radians(-23.45 * cos(radians(360.0 / 365.0) * (d + 10)))

// https://www.pveducation.org/pvcdrom/properties-of-sunlight/solar-time#HRA
const hour2rad = Math.PI / 12.0
export const hour_angle = hour => (hour - 12) * hour2rad

// https://www.pveducation.org/pvcdrom/properties-of-sunlight/elevation-angle
export const elevation = (latitude, declination, hour_angle) =>
  Math.asin(
    sin(declination) * sin(latitude) +
    cos(declination) * cos(latitude) * cos(hour_angle)
  )

// https://www.pveducation.org/pvcdrom/properties-of-sunlight/azimuth-angle
export const azimuth = (latitude, declination, hour_angle) =>
  Math.acos(
    (sin(declination) * cos(latitude) +
      cos(declination) * sin(latitude) * cos(hour_angle)) /
    elevation(latitude, declination, hour_angle)
  )
