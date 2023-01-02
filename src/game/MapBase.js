import {setGameText, useGameStore} from "./GameLogic"
import {execCommand} from "./CommandEngine"
import {startConference, stopConference} from './Video'
import {mod} from '../util/math'
import {getDirName} from "./Direction"
import {create2dArray} from "../util/arrays"

export const createMap = create2dArray

export default class MapBase {
  width
  height
  loaded
  level
  name
  squares
  startX
  startY

  showInfo(time_hours, pos, dir) {
    const time = mod(time_hours, 24)

    function pad(num, size) {
      return ('00' + num).substr(-size);
    }

    const hours = pad(Math.floor(time), 2)
    const minutes = pad(Math.floor((time - hours) * 60), 2)
    const direction = getDirName(dir)
    const timeOfDay = ['after midnite', 'early morning', 'mid morning',
      'noon', 'afternoon', 'dusk', 'evening', 'midnite']
    const timeStr = timeOfDay[Math.floor(mod(time - 1.5, 24) / 3)]

    // https://bardstale.brotherhood.de/talefiles/forum/viewtopic.php?t=1604
    // "present time of day: after midnite 0 - 3, midnite 4 - 7, evening 8 - b, dusk c - f, afternoon 10 - 13, noon 14 - 17, mid morning 18 - 1b, early morning 1c - 1f"  Seems to be set to 1f; i.e. early morning


    let locationText = this.getLocationInfo()
    const gameText = `${locationText} facing ${direction}.

        It's now ${timeStr}.`
    setGameText(gameText)
  }

  enter(pos, how = "move") {
    const {x, y} = pos

    // if !video field leave channel
    // const videoConfig = useVideoConfig.getState()
    const videoConfig = useGameStore.getState().config.video
    const videoConf = this.squares[x][y].videoConf
    if (videoConfig.enabled && videoConf) {
      startConference()
    }

    if (how !== "stairs") {
      // todo: check whether we are on stairs and ask
      // if we take them exit before taking any other actions
      // same with portals
    }

    // if video field join channel
    // maybe the video stuff should go into configurable pre/post actions...
    if (!videoConf) {
      stopConference()
    }

    const actions = this.squares[x][y].actions
    if (actions) {
      for (let action of actions) {
        execCommand(action)
      }
    }
  }

  async load() {
    const map = await this.loadRawMap(this.level)
    for (let prop in map) {
      this[prop] = map[prop]
    }
    this.transformMapBaseData()
    this.transformSquares()
    this.addActions()

    this.loaded = true
  }

  loadRawMap(level) {
    throw new Error("loadRawMap Must be implemented in derived class")
  }

  transformMapBaseData() {
    // Can be overwritte in derived class
  }

  transformSquares() {
    // Can be overwritte in derived class
  }

  addActions() {
    function addAction(square, action) {
      if (square.actions === undefined) square.actions = []
      // console.log("Actions: ", actions)
      square.actions.push(action)
    }

    function values(obj) {
      return obj ? obj : []
    }

    const map = this

    if (map.goesDown) {
      map.stairsDown = map.stairsNext
      map.stairsUp = map.stairsPrevious
    } else {
      map.stairsUp = map.stairsNext
      map.stairsDown = map.stairsPrevious
    }

    const squares = map.squares

    for (let stairsDown of values(map.stairsDown)) {
      const [x, y] = stairsDown
      // addAction(map[x][y], ["showMessage", "There are stairs going down here. Do you want to take them?"])
      addAction(squares[x][y], "stairsDown")
    }

    for (let stairsUp of values(map.stairsUp)) {
      const [x, y] = stairsUp
      // addAction(map[x][y], ["showMessage", "There are stairs up down here. Do you want to take them?"])
      addAction(squares[x][y], "stairsUp")
    }

    for (let videoConf of values(map.videoFields)) {
      const [x, y] = videoConf // Needs string possibly
      squares[x][y].videoConf = "test"
    }

    for (let actionStruct of values(map.actions)) {
      const [[x, y], action] = actionStruct
      addAction(squares[x][y], action)
    }

    for (let message of values(map.messages)) {
      const [[x, y], msg] = message
      addAction(squares[x][y], ["showMessage", msg])
    }

    for (let specialProg of values(map.specialProgramsInfo)) {
      // const [[x, y], msg, ...rest] = msg_struct
      const [[x, y], msg] = specialProg
      addAction(squares[x][y], ["showMessage", msg])
    }

    for (let teleport of values(map.teleports)) {
      const [from, to] = teleport;
      const [x1, y1] = from
      const [x2, y2] = to
      addAction(squares[x1][y1], ["jump", x2, y2])
    }
  }
}

