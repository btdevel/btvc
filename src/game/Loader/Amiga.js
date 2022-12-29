import {makeReadBuffer} from './util'

// Match any filename of the form "path/to/file/TPW.FOOBAR.C", where \ instead of / is also accepted
// or of the form "path/to/file/TPW.FOOBAR.P" for partys
const charRegex = /^(.*[/\\])*TPW\.(?<name>[ A-Za-z0-9]*)\.C$/
const partyRegex = /^(.*[/\\])*TPW\.(?<name>[ A-Za-z0-9]*)\.P$/

export function readCharacter(view, filename) {
  const buffer = makeReadBuffer(view, true)

  const match = filename.match(charRegex)

  const char = {}
  char.name = match.groups.name
  char.isParty = false
  char.status = buffer.readInt() /*00*/
  char.race = buffer.readInt() /*02*/
  char.charClass = buffer.readInt()  /*04*/
  char.currStrength = buffer.readInt() /*06*/
  char.currIQ = buffer.readInt() /*08*/
  char.currDexterity = buffer.readInt() /*10*/
  char.currConstitution = buffer.readInt() /*12*/
  char.currLuck = buffer.readInt() /*14*/
  char.maxStrength = buffer.readInt() /*16*/
  char.maxIQ = buffer.readInt() /*18*/
  char.maxDexterity = buffer.readInt() /*20*/
  char.maxConstitution = buffer.readInt() /*22*/
  char.maxLuck = buffer.readInt() /*24*/
  char.armour = buffer.readInt() /*26*/
  char.maxHP = buffer.readInt() /*28*/
  char.currHP = buffer.readInt() /*30*/
  char.maxSP = buffer.readInt() /*32*/
  char.currSP = buffer.readInt() /*34*/
  buffer.skip(16) /*36 array of len 8 of char item (code), char status (equipped=0x80) */
  char.experience = buffer.readLong() /*52*/
  char.gold = buffer.readLong() /*56*/
  char.currLevel = buffer.readInt() /*60*/
  char.maxLevel = buffer.readInt() /*62*/
  char.sorcererLevel = buffer.readInt() /*64*/
  char.conjurerLevel = buffer.readInt() /*66*/
  char.magicianLevel = buffer.readInt() /*68*/
  char.wizardLevel = buffer.readInt() /*70*/
  // Next 3 are from the msdos version, may the same here?
  char.hideChance = buffer.readInt() /*72 0-255 rogue chance to hide*/
  buffer.skip(4) /*74*/
  char.criticalHitChance = buffer.readInt() /*78 0-255 hunter odds of crit*/
  char.bardSongs = buffer.readInt() /*80*/
  // Next 5 are from the msdos version, may the same here?
  buffer.skip(6) /*82*/
  char.attacks = buffer.readInt() /*88*/
  buffer.skip(2) /*90*/
  char.battles = buffer.readInt() /* battles survived */ /*92*/
  buffer.skip(2) /*94*/

  if (buffer.remaining() > 0) {
    console.warn(`Amiga character file ${filename} (${char.name}) has some left over bytes... (${buffer.remaining()})`)
  }
  return char
}


function readParty(view, filename) {
  const buffer = makeReadBuffer(view, true)
  const match = filename.match(partyRegex)
  const partyName = match.groups.name
  const isParty = true
  const charNames = []
  for (let i = 0; i < 6; i++) {
    const name = buffer.readZString(16)
    if (name.length) charNames.push(name)
  }
  if (buffer.remaining() > 0) {
    console.warn(`Amiga party file ${filename} (${partyName}) has some left over bytes... (${buffer.remaining()})`)
  }

  return {
    name: partyName,
    isParty: isParty,
    characterNames: charNames,
  }
}

function isParty(view, filename) {
  return partyRegex.test(filename)
}

export function readAttributes(view, filename) {
  if (isParty(view, filename))
    return readParty(view, filename)
  else
    return readCharacter(view, filename)
}

export function recognize(view, filename) {
  if (view.byteLength == 96 && charRegex.test(filename)) return "Amiga BT1 Character File"
  if (view.byteLength == 96 && partyRegex.test(filename)) return "Amiga BT1 Party File"
  return false
}
