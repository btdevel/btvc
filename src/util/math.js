export function randomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

export function mapTo(x, x1, x2, y1, y2) {
  return ((x - x1) / (x2 - x1)) * (y2 - y1) + y1
}
