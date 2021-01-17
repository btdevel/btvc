import create from 'zustand'
import produce from 'immer'
import TimeStepper from './TimeStepper'
import { CityMap } from './CityMap'
import { radians, hour_angle, declination, elevation, sunPosition } from './Sun'

import { execCommand } from './KeyMap'
import { startGUI } from './ExpGUI'
import DungeonMap from './DungeonMap'
import { mod } from '../util/math'

const useStore = create((set, get) => {
  const modify = fn => set(produce(fn))

  return {
    modify: modify,

    overlayText: '',
    gameText: '',
    fullscreen: false,
    orbitcontrols: false,
    level: 'city',
    map: null,
    tracks: []
  }
})

function modifyState(func) {
  useStore.getState().modify(func)
}

export const modifyStatInternal_ = modifyState
export const useStoreInternal_ = useStore

export const setOverlayText = (text) => modifyState(state => { state.overlayText = text })
export const setGameText = (text) => modifyState(state => { state.gameText = text })
export const addTrack = (track) => modifyState(state => { state.tracks = [...state.tracks, track] })

export const useGameText = () => useStore(state => state.gameText)
export const useOverlayText = () => useStore(state => state.overlayText)
export const useFullscreen = () => useStore(state => state.fullscreen)
export const useOrbitcontrols = () => useStore(state => state.orbitcontrols)
export const useLevel = () => useStore(state => state.level)
export const useMap = () => useStore(state => state.map)

export const useTracks = () => useStore(state => state.tracks)

class GameState {
  stepper = new TimeStepper()
  position = { x: 0, y: 0 }
  dir = 0
  dPhi = 0
  dTheta = 0
  keyMap = {}
  commands = {}

  get level() { return useStore.getState().level }
  get map() { return useStore.getState().map }

  export = {
    forward: () => this.move(true),
    backward: () => this.move(false),
    turn: this.turn,
    jump: this.jump,
    teleport: this.teleport,
    stairsDown: () => this.takeStairs(true),
    stairsUp: () => this.takeStairs(false),
    showInfo: this.showInfo,
    showMap: this.showMap,
    showMessage: this.showMessage,
    exec: this.exec,
    toggleFullscreen: this.toggleFullscreen,
    togglePause: this.togglePause,
    loadLevel: this.loadLevel,
    doDebugStuff: startGUI
  }

  async init(config) {
    this.position.x = config.position.x
    this.position.y = config.position.y
    this.dir = config.dir
    this.keyMap = config.keyMap
    this.commands = config.commands

    this.setOrbitcontrols(config.orbitcontrols)
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

  setOrbitcontrols(onoff) {
    modifyState(draft => {
      draft.orbitcontrols = onoff
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
    this.stepper.setPaused(!this.stepper.isPaused())
  }

  time() {
    return this.stepper.getSimTime()
  }

  time_hours() {
    return this.time() / TimeStepper.HOUR
  }


  move(forward) {

    const map = this.map
    const dir = mod(this.dir + (forward ? 0 : 2), 4)

    const [allowed, msg, new_x, new_y] = map.canMove(this.position.x, this.position.y, dir)
    this.showMessage(msg)
    if (!allowed) return

    this.position.x = new_x
    this.position.y = new_y
    this.map.enter(this.position)
  }

  turn(i) {
    this.dir += i
    this.showMessage()
  }

  jump(x, y) {
    this.position.x = x
    this.position.y = y
    this.showMessage()
  }

  teleport(level, x, y) {
    this.loadLevel(level)
    this.position.x = x
    this.position.y = y
  }

  takeStairs(down) {
    const map = this.map
    if (!map || map.isCity()) return

    const levelDir = (down === map.goesDown) ? +1 : -1
    const newLevel = this.level + levelDir
    const minLevel = map.minLevel
    if (newLevel < minLevel) {
      const { x, y } = map.cityExitPos
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

}

export const gameState = new GameState()

