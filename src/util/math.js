export function randomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

export function mapTo(x, a, b, c, d) {
  return ((x - a) / (b - a)) * (d - c) + c
}
