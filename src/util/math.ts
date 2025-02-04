export function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

export function mapTo(x, x1, x2, y1, y2) {
  return ((x - x1) / (x2 - x1)) * (y2 - y1) + y1
}

export function mod(a, b) {
  return ((a % b) + b) % b
}

export function clamp(t, a, b) {
  return Math.max(Math.min(t, b), a)
}

const deg2rad = Math.PI / 180.0
const rad2deg = 180.0 / Math.PI
export const radians = degree => degree * deg2rad
export const degree = radians => radians * rad2deg