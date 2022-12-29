import {mergeObject} from '../util/merging'
import {getCharMap, getPartyMap} from './Loader/Loader'
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

  static loadCharacter(name) {
    const charMap = getCharMap()
    const attribs = charMap.get(name)
    return attribs ? new Character(attribs) : null
  }

  className() {
    if (this.charClass >= 0 && this.charClass < classes.length)
      return classes[this.charClass]
    return "??"
  }

  acName() {
    const ac = this.ac()
    return ac > -10 ? ac.toString() : "LO"
  }

  ac() {
    return this.armour
  }
}

class Party {
  constructor(attributes) {
    mergeObject(this, attributes)
  }

  static loadParty(name) {
    const partyMap = getPartyMap()
    const attribs = partyMap.get(name)
    return new Party(attribs)
  }

  loadCharacters() {
    const chars = []
    for (const charName of this.characterNames) {
      const char = Character.loadCharacter(charName)
      if (char) chars.push(char)
    }
    return chars
  }
}


export function loadCurrentParty() {
  // const name = "ATEAM"
  const name = "OLD BEARDS"
  const party = Party.loadParty(name)
  console.log("Loaded party: ", name, party)
  const chars = party.loadCharacters()
  console.log("Loaded characters: ", chars)
  return chars
}
