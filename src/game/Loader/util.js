export function readInt(bytes, i) {
  return bytes[i] + 0x100 * bytes[i + 1]
}

export function readLong(bytes, i) {
  return bytes[i] + 0x100 * bytes[i + 1] + 0x10000 * bytes[i + 2] + 0x1000000 * bytes[i + 3]
}

export function readZString(bytes, i) {
  let str = ""
  for (let j = i; j < bytes.length && bytes[j] > 0; j++) str += String.fromCharCode(bytes[j])
  return str
}