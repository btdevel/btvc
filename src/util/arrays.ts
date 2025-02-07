export function create2dArray<T>(width: number, height: number, defaultVal: T): T[][] {
  return [...Array(width).keys()].map(() => Array(height).fill(defaultVal))
}

export function union<T>(arr1: T[], arr2: T[]) {
  return [...new Set([...arr1, ...arr2])].sort()
}

export function mergeMaps<T>(map1: Array<T>, map2: Array<T>): Array<T> {
  // todo: check type Array vs Map vs WhatEver
  for (const [i, val] of map2.entries()) map1[i] = map1[i] || val
  return map1
}

export function mergeArrays<T>(arr1: T[], arr2: T[]) {
  if (!arr1) return arr2
  arr1.push(...arr2)
  return arr1
}
