import JSZip from 'jszip'

export function readByte(bytes, i) {
  return bytes[i]
}

export function readInt(bytes, i, bigendian) {
  if( bigendian)
    return 0x100 * bytes[i] + bytes[i + 1]
  else
    return bytes[i] + 0x100 * bytes[i + 1]
}

export function readLong(bytes, i, bigendian) {
  if( bigendian)
    return 0x1000000 * bytes[i] + 0x10000 * bytes[i + 1] + 0x100 * bytes[i + 2] + bytes[i + 3]
  else
    return bytes[i] + 0x100 * bytes[i + 1] + 0x10000 * bytes[i + 2] + 0x1000000 * bytes[i + 3]
}

export function readZString(bytes, i, maxLen) {
  let str = ""
  const end = maxLen === undefined ? bytes.length : i + maxLen
  for (let j = i; j < end && bytes[j] > 0; j++) str += String.fromCharCode(bytes[j])
  return str
}

export function makeReadBuffer(bytes, bigendian) {
  let i = 0
  return {
    readByte() {
      const val = readByte(bytes, i)
      i+=1
      return val
    },
    readInt() {
      const val = readInt(bytes, i, bigendian)
      i+=2
      return val
    },
    readLong() {
      const val = readLong(bytes, i, bigendian)
      i+=4
      return val
    },
    readZString(maxLen) {
      const val = readZString(bytes, i, maxLen)
      i+=maxLen
      return val
    },
    skip(n) {
      i+=n
    },
    remaining() {
      return bytes.length - i
    }
  }
}

async function fetchArrayBuffer(url) {
  const response = await fetch(url, {method: "GET"})
  const buffer = await response.arrayBuffer()
  return new Uint8Array(buffer)
}

export async function loadZipFile(url) {
  const bytes = await fetchArrayBuffer(url)
  const zip = await JSZip.loadAsync(bytes)
  const files = []
  zip.forEach((relativePath, file) => {
    files.push(file)
  })
  return files
}

export function mapToJson(map) {
  return JSON.stringify([...map])
}

export function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr))
}