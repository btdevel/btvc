export function create2dArray(width, height, defaultVal) {
  return [...Array(width).keys()].map(() => Array(height).fill(defaultVal))
}
