import { setGameText } from './GameLogic'
import Map, { create2dArray } from './Map'
import { Direction } from './Movement'
import { mod } from '../util/math'

export default class DungeonMap extends Map {
  width
  height
  loaded = false
  name = null
  level = null
  squares = null

  constructor(level) {
    super()
    if (level === undefined) {
      throw Error("Level is undefined")
    }
    this.level = level
  }

  isCity() {
    return false
  }

  canMove(old_x, old_y, dir, new_x, new_y) {
    // console.log("DungeonMap: ", this)
    const wall = this.squares[old_x][old_y]
    const dirs = [wall.north, wall.west, wall.south, wall.east]
    // setOverlayText(`${dirs}`)
    const type = dirs[dir]
    if (type === 1) return [false, "Ouch!"]
    return [true, undefined]
  }

  showMap(pos, dir) {
    setGameText("Sorry pal! Auto mapping was disabled on purpose...")
  }

  getLocationInfo() {
    return `You are in ${this.fullName}`
  }

  async loadRawMap(level) {
    return await loadMap(level)
  }

  transformMapBaseData() {
    const map = this
    const [width, height] = map.dim;
    map.width = width
    map.height = height
    map.dim = undefined
    map.name = map.shortName

    map.cityExitPos = map.cityExitPosition
    map.cityExitPosition = undefined

    map.minLevel = map.levelTeleport[0][0]
    // map.phaseDoor = map.phaseDoor // currently ignored
    // map.wallStyle = map.wallStyle // currently ignored
  }

  transformSquares() {
    const map = this
    const rows = map.height
    const columns = map.width

    map.squares = create2dArray(map.width, map.height, {})

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const square = {}

        const horzChars = ' -DS'
        const vertChars = ' |DS'
        const col = i * 3 + 1
        const row = j * 3 + 1
        square.north = horzChars.indexOf(map.map[row - 1][col])
        square.south = horzChars.indexOf(map.map[row + 1][col])
        square.east = vertChars.indexOf(map.map[row][col + 1])
        square.west = vertChars.indexOf(map.map[row][col - 1])

        const x = i, y = rows - 1 - j
        map.squares[x][y] = square
      }
    }
    map.map = undefined
  }

}


export async function loadMap(level) {
  const levelNumPadded = level.toString().padStart(2, '0')

  const map = {}
  try {
    const levelImport = import(`../assets/levels/level_${levelNumPadded}.json`)
    const levelBase = (await levelImport).default
    Object.assign(map, levelBase)

    const levelAmendImport = import(`../assets/levels/level_${levelNumPadded}_amend.json`)
    const levelExtra = (await levelAmendImport).default
    Object.assign(map, levelExtra)
  }
  catch {
    console.warn(`Could not load level ${level}`)
  }
  return map;
}




