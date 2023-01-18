export function create2dArray(width, height, defaultVal) {
  return [...Array(width).keys()].map(() => Array(height).fill(defaultVal))
}

export function union(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])].sort()
}

