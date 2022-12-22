import {readInt, readLong, readZString} from './util'

export function readCharacter(bytes) {
  if( bytes.length != 109 ) return null

  const char = {
    name: readZString(bytes, 0),
    isParty: false,
    status: bytes[17],
    race: bytes[19],
    klass: bytes[21],
    current: {
      strength: bytes[23],
      iq: bytes[25],
      dexterity: bytes[27],
      constitution: bytes[29],
      luck: bytes[31],
      hp: readInt(bytes, 47),
      sp: readInt(bytes, 51),
    },
    maximum: {
      strength: bytes[33],
      iq: bytes[35],
      dexterity: bytes[37],
      constitution: bytes[39],
      luck: bytes[41],
      hp: readInt(bytes, 45),
      sp: readInt(bytes, 49),
    },
    equipment: [], // bytes 53..68
    experience: readLong(bytes, 69),
    gold: readLong(bytes, 73),
    level: readInt(bytes, 77),
    conjLevel: bytes[81],
    magiLevel: bytes[82],
    sorcLevel: bytes[83],
    wizdLevel: bytes[84],
    songs: bytes[93],
  }
  return char
}

export function readParty(bytes) {
  if( bytes.length != 113 ) return null

  const partyName = readZString(bytes, 0, 16)
  const charNames = []
  for (let i = 0; i < 6; ++i) {
    const name = readZString(bytes, i * 16 + 17, 15)
    if (name.length) charNames.push(name)
  }
  return {
    name: partyName,
    isParty: true,
    characterNames: charNames,
  }
}

export function isParty(bytes) {
  return bytes.length>16 && bytes[16]==2
}

export function read(bytes) {
  if( isParty(bytes))
    return readParty(bytes)
  else
    return readCharacter(bytes)
}

export function hasNames() {
  return true // Names are included in MSDOS files
}