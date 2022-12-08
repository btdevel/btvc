import create from 'zustand'
import produce from 'immer'

import {dumpConfig, loadConfig, loadYAML} from './ConfigLoader'
import {execCommand} from "./ExecCommand";
import {CityMap} from './CityMap'
import DungeonMap from './DungeonMap'
import {moveDir, normalizeDir} from './Direction'
import {declination, elevation, hour_angle, sunPosition} from './Sun'
import imageMap from './Images'
import TimeStepper from '../util/TimeStepper'
import {clamp, radians} from '../util/math'

import configFile from '../assets/config/game_config.yaml'
import programFile from '../assets/config/programs.yaml'

const useStore = create((set, get) => {
  const modify = fn => set(produce(fn))

  return {
    modify: modify,

    overlayText: '',
    overlayImage: '',
    gameText: '',
    fullscreen: false,
    level: 'city',
    map: null,
    location: '',
    config: {}
  }
})

function modifyState(func) {
  useStore.getState().modify(func)
}

export const setOverlayText = (text) => modifyState(state => {
  state.overlayText = text
})
export const setOverlayImage = (url) => modifyState(state => {
  state.overlayImage = url
})
export const setLocation = (text) => modifyState(state => {
  state.location = text
})
export const setGameText = (text) => modifyState(state => {
  state.gameText = text
})

export const setConfig = (config) => modifyState(state => {
  state.config = config
})
export const setVideoConfig = (videoConfig) => modifyState(state => {
  state.config.video = videoConfig
})
export const setGraphicsConfig = (graphicsConfig) => modifyState(state => {
  state.config.graphics = graphicsConfig
})

export const useOverlayText = () => useStore(state => state.overlayText)
export const useOverlayImage = () => useStore(state => state.overlayImage)
export const useLocation = () => useStore(state => state.location)
export const useGameText = () => useStore(state => state.gameText)
export const useFullscreen = () => useStore(state => state.fullscreen)
export const useLevel = () => useStore(state => state.level)
export const useMap = () => useStore(state => state.map)

const identity = (x) => x
export const useConfig = (func = identity) => useStore(state => func(state.config))
export const useVideoConfig = (func = identity) => useStore(state => func(state.config?.video))
export const useGraphicsConfig = (func = identity) => useStore(state => func(state.config?.graphics))

class GameState {
  stepper = new TimeStepper()
  position = {x: 0, y: 0}
  dir = 0
  flyMode = false
  dPhi = 0
  dTheta = 0
  keyMap = {}
  commands = {}
  program = []
  programRunning = false

  canGrabKeyboard = true

  get level() {
    return useStore.getState().level
  }

  get map() {
    return useStore.getState().map
  }



  export = {
    forward: () => this.move(true),
    backward: () => this.move(false),
    turn: this.turn,
    jump: this.jump,
    teleport: this.teleport,
    returnToCity: this.returnToCity,
    stairsDown: () => this.takeStairs(true),
    stairsUp: () => this.takeStairs(false),
    showInfo: this.showInfo,
    showMap: this.showMap,
    showMessage: this.showMessage,
    overlayImage: (name) => setOverlayImage(imageMap[name]),
    location: setLocation,
    exec: this.exec,
    program: this.execProgram,
    toggleFullscreen: this.toggleFullscreen,
    togglePause: this.togglePause,
    loadLevel: this.loadLevel,
    nextLevel: () => {
      this.loadLevel(this.level + 1)
    },
    prevLevel: () => {
      this.loadLevel(this.level - 1)
    },
    toggleFly: () => {
      this.flyMode = !this.flyMode
    },
    doDebugStuff: () => {/* currently nothing*/}
  }

  async init() {
    const config = await loadConfig(configFile)

    // this.config = config
    this.position.x = config.position.x
    this.position.y = config.position.y
    this.dir = config.dir
    this.keyMap = config.keyMap
    this.commands = config.commands

    const programs = await loadYAML(programFile)
    // console.log("Programs: ", dumpConfig(programs))
    this.programs = programs.programs

    await this.loadLevel(config.level)

    const stepper = this.stepper
    stepper.pause()
    stepper.setSimSpeed(
      TimeStepper.DAY / TimeStepper.MINUTE / config.dayLengthInMinutes
    )
    stepper.setSimTime(config.hour * TimeStepper.HOUR)
    stepper.resume()

    for (const command of config.initCommands) {
      console.log(command);
      execCommand(command, "init()")
    }

    setInterval(() => this.tic(), 200)
    setConfig(config)
  }

  setViewAngles(diffX, diffY) {
    const maxPhi = radians(135)
    const maxTheta = radians(45)
    this.dPhi = clamp(-diffX / 100, -maxPhi, maxPhi)
    this.dTheta = clamp(-diffY / 100, -maxTheta, maxTheta)
  }


  tic() {
    // console.log("Tic...");
    if (this.programRunning) {
      if (this.program.length) {
        const command = this.program.shift()
        console.log("Executing: ", command);
        execCommand(command)
      } else {
        setLocation(this.map.name)
        setOverlayImage(null)
        setGameText()
        this.programRunning = false
      }
    }
  }

  async loadLevel(level) {
    if (level === undefined) return null
    let map
    if (level === "city")
      map = new CityMap()
    else
      map = new DungeonMap(level)
    await map.load()

    modifyState(draft => {
      draft.level = level
      draft.map = map
      draft.location = map.name
    })
  }

  angle() {
    return radians(this.dir * 90)
  }

  showInfo() {
    this.map.showInfo(this.time_hours(), this.position, this.dir)
  }

  showMap() {
    this.map.showMap(this.position, this.dir);
  }

  showMessage(msg = "") {
    modifyState(draft => {
      draft.gameText = msg
    })
  }

  toggleFullscreen() {
    modifyState(draft => {
      draft.fullscreen = !draft.fullscreen
    })
  }

  sun = {
    latitude: radians(51),
    day: 180,
    hour_angle() {
      return hour_angle(gameState.time_hours())
    },
    elevation() {
      // return radians(30)
      return elevation(this.latitude, declination(this.day), this.hour_angle())
    },
    position() {
      // const phi = gameState.sun.azimuth()
      const phi = gameState.sun.hour_angle()
      const theta = gameState.sun.elevation()
      return sunPosition(phi, theta)
    }
  }

  pause() {
    this.stepper.pause()
  }

  resume() {
    this.stepper.resume()
  }

  togglePause() {
    console.log("pausing")
    // setLocation("this.map.name")
    setOverlayImage(null)
    // setGameText()

    this.stepper.setPaused(!this.stepper.isPaused())
  }

  time() {
    return this.stepper.getSimTime()
  }

  time_hours() {
    return this.time() / TimeStepper.HOUR
  }

  savePosition() {
    this.saved = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      dir: this.dir
    }
  }

  restorePosition() {
    this.position.x = this.saved.position.x
    this.position.y = this.saved.position.y
    this.dir = this.saved.dir
  }

  move(forward) {
    const map = this.map
    const dir = normalizeDir(this.dir, forward)
    const new_x = moveDir(this.position.x, dir, true, map.width)
    const new_y = moveDir(this.position.y, dir, false, map.height)
    if (!this.flyMode) {
      const [allowed, msg] = map.canMove(this.position.x, this.position.y, dir, new_x, new_y)
      this.showMessage(msg)
      if (!allowed) return
    }

    if (map.isCity()) this.savePosition()
    this.position.x = new_x
    this.position.y = new_y
    if (!this.flyMode) {
      this.map.enter(this.position)
    }
  }

  turn(i) {
    // we don't wrap around here (mod 4) because that would cause problems with the smooth 3d rotation
    // rather we always use mod 4 in map computations
    this.dir += i
    this.showMessage()
  }

  jump(x, y) {
    this.position.x = x
    this.position.y = y
    this.jumped = true
    this.showMessage()
  }

  teleport(level, x, y) {
    this.loadLevel(level)
    this.position.x = x
    this.position.y = y
    this.jumped = true
  }

  returnToCity() {
    this.restorePosition()
  }

  takeStairs(down) {
    const map = this.map
    if (!map || map.isCity()) return

    const levelDir = (down === map.goesDown) ? +1 : -1
    const newLevel = this.level + levelDir
    const minLevel = map.minLevel
    if (newLevel < minLevel) {
      const [x, y] = map.cityExitPos
      this.teleport("city", x, y)
    } else {
      this.loadLevel(newLevel)
    }
  }

  exec(...commands) {
    for (let command of commands) {
      execCommand(command, "exec()")
    }
  }

  execProgram(prog, ...args) {
    console.log("Executing program: ", prog, " with args: ", ...args);
    const program = this.programs[prog]
    if (!program) {
      console.warn("Unknown program: ", prog);
      return
    }
    const dump = {};
    dump[prog] = program
    console.log("Program: ", dumpConfig(dump));
    this.program = [...program]
    this.programRunning = true
  }

}

export const gameState = new GameState()
export const gameInit = () => gameState.init()
