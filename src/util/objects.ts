import {mergeArrays, union} from './arrays'

export interface IStringIndex {
  // An object that has strings as index (this is the default in JS, but somehow TS needs this...)
  // See: https://stackoverflow.com/questions/56833469/typescript-error-ts7053-element-implicitly-has-an-any-type
  [key: string]: any
}

function isObject(obj: any): obj is IStringIndex {
  return (typeof obj==="object") && !Array.isArray(obj)
}


export function mergeObject(obj1: IStringIndex, obj2: IStringIndex) {
  if (!obj1) return obj2

  for (const prop in obj2) {
    const value = obj2[prop]
    if (Array.isArray(value)) {
      obj1[prop] = mergeArrays(obj1[prop], value)
    } else if (typeof value === 'object') {
      obj1[prop] = mergeObject(obj1[prop], value)
    } else {
      obj1[prop] = value
    }
  }
  return obj1
}

export function diffObjects(obj1: IStringIndex, obj2: IStringIndex): IStringIndex {
  const o1: IStringIndex = {}
  const o2: IStringIndex = {}
  const d: IStringIndex = {}
  for (const key of union(Object.keys(obj1), Object.keys(obj2))) {
    const v1 = obj1[key]
    const v2 = obj2[key]
    if( isObject(v1) && isObject(v2)) {
      const diff = diffObjects(v1, v2)
      o1[key] = diff[0]
      o2[key] = diff[1]
      d[key] = diff[2]
    } else if (v1===v2) {
      d[key] = v1
    } else {
      if (key in obj1) o1[key] = v1
      if (key in obj2) o2[key] = v2
    }
  }
  return [o1, o2, d]
}