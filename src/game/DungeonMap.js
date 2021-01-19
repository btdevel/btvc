import { setGameText } from './GameLogic'
import Map from './Map'
import { Direction } from './Movement'
import { mod } from '../util/math'

export default class DungeonMap extends Map {
  rows
  columns
  loaded = false
  name = null
  level = null
  map = null

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

  async load() {
    const map = await loadLevel(this.level)
    for (let prop in map) {
      this[prop] = map[prop]
    }

    this.rows = this.height
    this.columns = this.width
    this.name = map.shortName
    // console.log("Loaded map: ", this)
    this.loaded = true
  }

  canMove(old_x, old_y, dir) {
    // console.log("DungeonMap: ", this)
    const wall = this.map[old_x][old_y]
    const dirs = [wall.north, wall.west, wall.south, wall.east]
    // setOverlayText(`${dirs}`)
    const type = dirs[dir]
    if (type === 1) return [false, "Ouch!", old_x, old_y]
    const new_x = mod(old_x + Direction.dx[dir], this.columns)
    const new_y = mod(old_y + Direction.dy[dir], this.rows)
    return [true, undefined, new_x, new_y]
  }

  showMap(pos, dir) {
    setGameText("Sorry pal! Auto mapping was disabled on purpose...")
  }

  getLocationInfo() {
    return `You are in ${this.fullName}`
  }
}


export async function loadLevel(level) {
  const levelNum = level.toString().padStart(2, '0')

  const levelRaw = {}
  try {
    const levelImport = import(`../assets/levels/level_${levelNum}.json`)
    const levelBase = (await levelImport).default
    Object.assign(levelRaw, levelBase)

    const levelAmendImport = import(`../assets/levels/level_${levelNum}_amend.json`)
    const levelExtra = (await levelAmendImport).default
    Object.assign(levelRaw, levelExtra)
  }
  catch {
    console.warn(`Could not load level ${level}`)
  }
  // console.log(levelRaw)
  const map = transform_level(levelRaw, level)
  return map;
}

function transform_level(levelRaw, level) {
  const map = {}

  const [width, height] = levelRaw.dim;
  map.width = width
  map.height = height
  map.fullName = levelRaw.fullName
  map.shortName = levelRaw.shortName
  map.cityExitPos = levelRaw.cityExitPosition
  map.goesDown = levelRaw.goesDown
  map.levelTeleports = levelRaw.levelTeleport
  map.level = level
  map.minLevel = levelRaw.levelTeleport[0][0]
  map.phaseDoor = levelRaw.phaseDoor // currently ignored
  map.wallStyle = levelRaw.wallStyle // currently ignored

  map.lights = levelRaw.lights
  map.videoScreens = levelRaw.videoScreens
  map.videoFields = levelRaw.videoFields

  map.map = transform_map(levelRaw, width, height);
  // console.log("Raw: ", levelRaw)
  // console.log("Map: ", map)
  return map;
}

function addAction(object, action) {
  if (object.actions === undefined) object.actions = []
  // console.log("Actions: ", actions)
  object.actions.push(action)
}

const transform_map = (level, width, height) => {
  const map = Array(height);

  for (let i = 0; i < height; i++) {
    map[i] = Array(width);
    for (let j = 0; j < width; j++) {
      const space = {}

      const horzChars = ' -DS'
      const vertChars = ' |DS'
      const cx = i * 3 + 1
      const cy = (height - j - 1) * 3 + 1
      space.north = horzChars.indexOf(level.map[cy - 1][cx])
      space.south = horzChars.indexOf(level.map[cy + 1][cx])
      space.east = vertChars.indexOf(level.map[cy][cx + 1])
      space.west = vertChars.indexOf(level.map[cy][cx - 1])



      // const event = level.eventMap[i + j * width]
      // space.stairsPrev = (event & 0b00000001) !== 0;
      // space.stairsNext = (event & 0b00000010) !== 0;
      // space.special = (event & 0b00000100) !== 0; // No clue what kind of special this could be...
      // space.darkness = (event & 0b00001000) !== 0;
      // space.trap = (event & 0b00010000) !== 0;
      // space.portalDown = (event & 0b00100000) !== 0;
      // space.portalUp = (event & 0b01000000) !== 0;
      // space.encounter = (event & 0b10000000) !== 0; // We have a special encounter field for that so why???

      // space.stairsDown = level.goesDown ? space.stairsNext : space.stairsPrev;
      // space.stairsUp = level.goesDown ? space.stairsPrev : space.stairsNext;

      // if (space.stairsDown) {
      //   addAction(space, ["showMessage", "There are stairs going down here. Do you want to take them?"])
      //   addAction(space, "stairsDown")
      // }
      // if (space.stairsUp) {
      //   addAction(space, ["showMessage", "There are stairs going up here. Do you want to take them?"])
      //   addAction(space, "stairsUp")
      // }


      map[i][j] = space
    }
  }

  if (level.goesDown) {
    level.stairsDown = level.stairsNext
    level.stairsUp = level.stairsPrevious
  }
  else {
    level.stairsUp = level.stairsNext
    level.stairsDown = level.stairsPrevious
  }

  for (let stairsDown of level.stairsDown) {
    const [x, y] = stairsDown
    addAction(map[x][y], ["showMessage", "There are stairs going down here. Do you want to take them?"])
    addAction(map[x][y], "stairsDown")
    // console.log("Stairs down: " , x, y);
  }

  for (let stairsUp of level.stairsUp) {
    const [x, y] = stairsUp
    addAction(map[x][y], ["showMessage", "There are stairs up down here. Do you want to take them?"])
    addAction(map[x][y], "stairsUp")
    // console.log("Stairs up: " , x, y);
  }

  if (level.videoFields) {
    for (let videoConf of level.videoFields) {
      const [x, y] = videoConf // Needs string possibly
      map[x][y].videoConf = "test"
      // console.log("Video screen: ", x, y);
    }
  }

  for (let msg_struct of level.messages) {
    const [[x, y], msg] = msg_struct
    addAction(map[x][y], ["showMessage", msg])
  }

  for (let msg_struct of level.specialProgramsInfo) {
    const [[x, y], msg, ...rest] = msg_struct
    addAction(map[x][y], ["showMessage", msg])
  }

  for (let teleport of level.teleports) {
    const [from, to] = teleport;
    const [x1, y1] = from
    const [x2, y2] = to
    addAction(map[x1][y1], ["jump", x2, y2])
  }

  return map;
}


export async function loadLevels() {
  const levels = []
  for (let i = 0; i < 16; i++) {
    levels.push(loadLevel(i))
  }
  return levels;
}



// http://bardstale.brotherhood.de/talefiles/forum/viewtopic.php?f=17&t=910&p=3443#p3443
//
// 000 - 001	Load Address of file
// 002 - 201	Wall Map, one byte per cell (see below),
//             lines are encoded south to north, west to east
// 202 - 401	Event Map, one byte per cell (see below),
//             lines are encoded south to north, west to east
// 402 - 409	Level flags, relate to NMAx file (8 levels)
// 40a - 411	Lock flags, teleport protected level FF, free level 00
// 412		   monster level for random encounters
// 413		   PHDO lock, 01 = PHDO locked, disabled
// 414		   wall set style: 0 = sewer, 1 = Cellar, 2 = catacomb, 3 = Mangar
// 415 - 416	point of return into Skara Brae map
// 417		   dungeon direction, 00 = cellars, 03 = towers
// 418 - 421   dungeon name (9 chars and dc)
// 422 - 431	coordinates for up to 8 special events
// 		      loaded from files (8 coors)
// 432 - 441	indices into file load table to evaluate file
// 		      number to be loaded from there (see below)
// 442 - 461	anti magic (16 coors)
// 462 - 471	teleport FROM coors (8 coors)
// 472 - 481	teleport TO coors (8 coors)
// 482 - 491	Spinners (8 coors)
// 492 - 4a1	Smoke (8 coors)
// 4a2 - 4c1	HP damage zone (16 coors)
// 4c2 - 4d1	SP regeneration zone (8 coors)
// 4d2 - 4e1	Stasis chambers (8 coors)
// 4e2 - 4f1	cells with messages, same sequence as following texts (8 coors)
// 4f2 - 501	forced encounters, inavoidable fights (8 coors)
// 502 - 511	type and number of opps from 4f2
// 512 - 521	text offset, low/high byte, in file text starts actually
// 		      when you substract -FD20 (8 pairs)
// 522 - eof	texts
// _______________________________________________________

// 002 - 201 Wall Map, one byte per cell (see below)

// each byte represent 1 cell. The bits 0 and 1 for the north side,
// bits 2 and 3 for the south side, bits 4 and 5 east and bits
// 6 and 7 west.

// 00 = no walls
// 01 = wall
// 10 = door
// 11 = secret door
// _______________________________________________________

// 202 - 401 Event flags

// bit 0 	set if there are stairs to previous level, depending on 417 up or down
// bit 1 	set if there are stairs to next level, depending on 417 up or down
// bit 2 	set if there is a special
// bit 3 	set if there's darkness
// bit 4 	set if there's a trap.
// bit 5 	set if there's a portal down
// bit 6 	set if there's a portal up
// bit 7 	set if there's a random encounter scheduled for this tile.
