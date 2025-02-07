export type Point2d = [number, number]

export function randomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}

export function mapTo(x: number, x1: number, x2: number, y1: number, y2: number) {
  return ((x - x1) / (x2 - x1)) * (y2 - y1) + y1
}

export function mod(a: number, b: number) {
  return ((a % b) + b) % b
}

export function clamp(t: number, a: number, b: number) {
  return Math.max(Math.min(t, b), a)
}

const deg2rad = Math.PI / 180.0
const rad2deg = 180.0 / Math.PI
export const radians = (degree: number) => degree * deg2rad
export const degree = (radians: number) => radians * rad2deg