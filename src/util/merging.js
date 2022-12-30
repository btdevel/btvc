function mergeArray(obj1, obj2) {
  if (!obj1) return obj2
  return [...obj1, ...obj2]
}

export function mergeArrays(a, b) {
  for (let [i, x] of b.entries()) a[i] = a[i] || x
  return a
}

export function mergeObject(obj1, obj2) {
  if (!obj1) return obj2

  for (const prop in obj2) {
    const value = obj2[prop]
    if (Array.isArray(value)) {
      obj1[prop] = mergeArray(obj1[prop], value)
    } else if (typeof value === 'object') {
      obj1[prop] = mergeObject(obj1[prop], value)
    } else {
      obj1[prop] = value
    }
  }
  return obj1
}

