import JSZip from 'jszip'


function readByte(view, i) {
  return view.getUint8(i)
}

function readInt(view, i, bigEndian) {
  const val = view.getInt16(i, !bigEndian)
  return val
}

function readLong(view, i, bigEndian) {
  return view.getInt32(i, !bigEndian)
}

function readZString(view, i, maxLen) {
  const bytes = new Uint8Array(view.buffer, i, maxLen)
  let str = ""
  for (let j = 0; j < maxLen && bytes[j] > 0; j++) str += String.fromCharCode(bytes[j])
  return str
}

export function makeReadBuffer(view, bigEndian) {
  let i = 0
  return {
    readByte() {
      const val = readByte(view, i)
      i+=1
      return val
    },
    readInt() {
      const val = readInt(view, i, bigEndian)
      i+=2
      return val
    },
    readLong() {
      const val = readLong(view, i, bigEndian)
      i+=4
      return val
    },
    readZString(maxLen) {
      const val = readZString(view, i, maxLen)
      i+=maxLen
      return val
    },
    skip(n) {
      i+=n
    },
    remaining() {
      return view.byteLength - i
    }
  }
}

async function fetchArrayBuffer(url) {
  const response = await fetch(url, {method: "GET"})
  const buffer = await response.arrayBuffer()
  return buffer
}

export async function loadZipFile(url) {
  const buffer = await fetchArrayBuffer(url)
  const bytes = new Uint8Array(buffer)
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