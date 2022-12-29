import {makeReadBuffer} from './util'

export function readCharacter(bytes, filename) {
  const buffer = makeReadBuffer(bytes, false)

  const char = {}
  char.name = buffer.readZString(16)
  char.isParty = buffer.readByte() && false
  char.status = buffer.readInt() /*00*/
  char.race = buffer.readInt()   /* 02 (enum RACE) races in order:
            human, elf, dwarf, hobbit, half-elf,
            half-orc, gnome */
  char.charClass = buffer.readInt()  /* 04 (enum CLASS) classes in order: (class is a reserved word)
            warrior, paladin, rogue, bard,
            hunter, monk, conjurer, magician,
            sorceror, wizard */
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
  char.armour = buffer.readInt() /*26 (it's like that in the Amiga version, maybe here too?*/
  char.maxHP = buffer.readInt() /*28*/
  char.currHP = buffer.readInt() /*30*/
  char.maxSP = buffer.readInt() /*32*/
  char.currSP = buffer.readInt() /*34*/
  buffer.skip(16) /*36 array of len 8 of char item (code), char status (equipped=0x80) */
  char.experience = buffer.readLong() /*52*/
  char.gold = buffer.readLong() /*56*/
  char.currLevel = buffer.readInt() /*60*/
  char.maxLevel = buffer.readInt() /*62*/
  char.sorcererLevel = buffer.readByte() /*64*/
  char.conjurerLevel = buffer.readByte() /*65*/
  char.magicianLevel = buffer.readByte() /*66*/
  char.wizardLevel = buffer.readByte() /*67*/
  char.hideChance = buffer.readByte() /*68 0-255 rogue chance to hide*/
  buffer.skip(5) /*69*/
  char.criticalHitChance = buffer.readInt() /*74 0-255 hunter odds of crit*/
  char.bardSongs = buffer.readInt() /*76*/
  buffer.skip(6) /*78*/
  char.attacks = buffer.readInt() /*84*/
  buffer.skip(2) /*86*/
  char.battles = buffer.readInt() /* battles survived */ /*88*/
  buffer.skip(2) /*90*/

  if (buffer.remaining() > 0) {
    console.warn(`MSDOS character file ${filename} (${char.name}) has some left over bytes... (${buffer.remaining()})`)
  }
  return char
}


function readParty(bytes, filename) {
  const buffer = makeReadBuffer(bytes, false)
  const partyName = buffer.readZString(16)
  const isParty = buffer.readByte() || true
  const charNames = []
  for (let i = 0; i < 6; i++) {
    const name = buffer.readZString(16)
    if (name.length) charNames.push(name)
  }
  if (buffer.remaining() > 0) {
    console.warn(`MSDOS party file ${filename} (${partyName}) has some left over bytes... (${buffer.remaining()})`)
  }

  return {
    name: partyName,
    isParty: isParty,
    characterNames: charNames,
  }
}

function isParty(bytes) {
  return bytes.length > 16 && bytes[16] === 2
}

export function readAttributes(bytes, filename) {
  if (isParty(bytes))
    return readParty(bytes, filename)
  else
    return readCharacter(bytes, filename)
}

export function recognize(bytes, filename) {
  // Match any filename of the form "path/to/file/123.TPW", where \ instead of / is also accepted
  const regex = /^(.*[/\\])*[0-9]*\.TPW$/
  if (bytes.length == 109 && regex.test(filename)) return "MSDOS BT1 Character File"
  if (bytes.length == 113 && regex.test(filename)) return "MSDOS BT1 Party File"
  return false
}
