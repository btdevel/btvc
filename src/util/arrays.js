export function create2dArray(width, height, defaultVal) {
  return [...Array(width).keys()].map(() => Array(height).fill(defaultVal))
}

export function union(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])].sort()
}

export function mergeMaps(map1, map2) {
  for (let [i, val] of map2.entries()) map1[i] = map1[i] || val
  return map1
}

export function mergeArrays(arr1, arr2) {
  if (!arr1) return arr2
  arr1.push(...arr2)
  return arr1
}
