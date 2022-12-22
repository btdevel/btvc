import {dumpConfig} from './ConfigLoader'
import {mergeObject} from '../util/merging'
import JSZip from 'jszip'
import * as MSDOSLoader from './Loader/MSDOS'
// import * as AmigaLoader from './Loader/Amiga'


const races = [
  "Human",
  "Elf",
  "Dwarf",
  "Hobbit",
  "Half-Elf",
  "Half-Orc",
  "Gnome",
]
const classes = [
  "Warrior",
  "Paladin",
  "Rogue",
  "Bard",
  "Hunter",
  "Monk",
  "Conjurer",
  "Magician",
  "Sorceror",
  "Wizard",
]

class Character {
  constructor(attributes) {
    mergeObject(this, attributes)
  }

  className() {
    return classes[this.klass]
  }

  ac() {
    return 10
  }

  acName() {
    const ac = this.ac()
    return ac > -10 ? ac.toString() : "LO"
  }
}

class Party {
  constructor(attributes) {
    mergeObject(this, attributes)
  }

}

function read(bytes, loader) {
  const attribs = loader.read(bytes)
  if( !attribs ) return
  return attribs.isParty ? new Party(attribs) : new Character(attribs)
}

async function fetchArrayBuffer(url) {
  const response = await fetch(url, {method: "GET"})
  const buffer = await response.arrayBuffer()
  return new Uint8Array(buffer)
}

export async function loadCharacter(characterUrl, loader = MSDOSLoader) {
  const bytes = await fetchArrayBuffer(characterUrl)
  const char = read(bytes, loader)
  console.log(dumpConfig(char))
  return char
}

export async function loadZip(url, loader = MSDOSLoader) {
  const bytes = await fetchArrayBuffer(url)
  const zip = await JSZip.loadAsync(bytes)
  const files = []
  zip.forEach((relativPath, file) => {
    files.push(file)
  })
  const charMap = new Map()
  const chars = []
  let party = null
  for (const file of files) {
    const charBytes = await file.async('uint8array')
    console.log(file.name, charBytes)
    const char = read(charBytes, loader)
    console.log(char)
    if (!char) continue
    if (!loader.hasNames()) {
      char.name = file.name // do something with it
    }
    if( char.isParty) {
      party = char
    }
    else {
      charMap.set(char.name, char)
      chars.push(char)
    }
  }
  console.log(charMap)
  if( !party) return chars
  return party.characterNames.map((name) => charMap.get(name))
}
