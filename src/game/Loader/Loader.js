import * as MSDOSLoader from './MSDOS'
import * as AmigaLoader from './Amiga'
import {jsonToMap, loadZipFile, mapToJson} from './util'


function readAttribs(bytes, filename) {
  const loaders = [MSDOSLoader, AmigaLoader]
  for (const loader of loaders) {
    const type = loader.recognize(bytes, filename)
    if (type) {
      console.log(`File ${filename} recognized as "${type}"`)
      const attribs = loader.readAttributes(bytes, filename)
      return attribs
    }
  }
  console.log(`File ${filename} not recognized by any loader`)

}


export async function loadZip(url) {
  const files = await loadZipFile(url)
  const chars = []
  const partys = []
  for (const file of files) {
    const charBytes = await file.async('uint8array')
    console.log(file.name, charBytes)
    const char = readAttribs(charBytes, file.name)
    if (char) {
      console.log(char)
      if (char.isParty)
        partys.push(char)
      else
        chars.push(char)
    }
  }
  return [chars, partys]
}

export async function importChars(url, overwrite = false) {
  const [chars, partys] = await loadZip(url)
  toLocalStorage(chars, partys, overwrite)
  return [chars, partys]
}

export function getCharMap() {
  const string = localStorage.getItem("saved.characters")
  return string ? new Map(jsonToMap(string)) : new Map()
}

function setCharMap(charMap) {
  localStorage.setItem("saved.characters", mapToJson(charMap))
}

export function getPartyMap() {
  const string = localStorage.getItem("saved.partys")
  return string ? new Map(jsonToMap(string)) : new Map()
}

function setPartyMap(partyMap) {
  localStorage.setItem("saved.partys", mapToJson(partyMap))
}


function toLocalStorage(chars, partys, overwrite = !false) {
  const charMap = getCharMap()
  const partyMap = getPartyMap()
  for (const char of chars) {
    if (overwrite || !charMap.has(char.name))
      charMap.set(char.name, char)
  }
  for (const party of partys) {
    if (overwrite || !partyMap.has(party.name))
      partyMap.set(party.name, party)
  }
  setCharMap(charMap)
  setPartyMap(partyMap)
}

function fromLocalStorage(charName, partyName) {
  if (charName) {
    const charMap = getCharMap()
    return charMap.get(charName)
  }

  const partyMap = getPartyMap()
  const party = partyMap.get(partyName)
  const chars = party.characterNames.map((charName) => fromLocalStorage(charName))
  return chars
}