import React from 'react'

import create from 'zustand'
import produce from 'immer'
import TimeStepper from './TimeStepper'
import { CityMap } from './CityMap'
import { radians, hour_angle, declination, elevation, sunPosition } from './Sun'

import { execCommand } from './KeyMap'
import { startGUI } from './ExpGUI'
import DungeonMap from './DungeonMap'
import { Direction, mod } from './Movement'

const useStore = create((set, get) => {
  const modify = fn => set(produce(fn))

  return {
    modify: modify,

    overlayText: '',
    gameText: '',
    fullscreen: false,
    orbitcontrols: false,
    level: 'city',
    map: null
  }
})

function modifyState(func) {
  useStore.getState().modify(func)
}

export const modifyStatInternal_ = modifyState
export const useStoreInternal_ = useStore

export const setOverlayText = (text) => modifyState(state => { state.overlayText = text })
export const setGameText = (text) => modifyState(state => { state.gameText = text })

export const useGameText = () => useStore(state => state.gameText)
export const useOverlayText = () => useStore(state => state.overlayText)
export const useFullscreen = () => useStore(state => state.fullscreen)
export const useOrbitcontrols = () => useStore(state => state.orbitcontrols)
export const useLevel = () => useStore(state => state.level)
export const useMap = () => useStore(state => state.map)



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
    const time = this.time_hours() % 24

    function pad(num, size) { return ('00' + num).substr(-size); }
    const hours = pad(Math.floor(time), 2)
    const minutes = pad(Math.floor((time - hours) * 60), 2)
    const directions = ['north', 'west', 'south', 'east'];
    const timeOfDay = ['after midnite', 'early morning', 'mid morning',
      'noon', 'afternoon', 'dusk', 'evening', 'midnite']
    const timeStr = timeOfDay[Math.floor(((time - 1.5 + 24) % 24) / 3)]

    // https://bardstale.brotherhood.de/talefiles/forum/viewtopic.php?t=1604
    // "present time of day: after midnite 0 - 3, midnite 4 - 7, evening 8 - b, dusk c - f, afternoon 10 - 13, noon 14 - 17, mid morning 18 - 1b, early morning 1c - 1f"  Seems to be set to 1f; i.e. early morning

    modifyState(draft => {
      const dir = ((this.dir % 4) + 4) % 4
      if (draft.level === 'city') {
        draft.gameText = `You are on ?? Street facing ${directions[dir]}.

        It's now ${timeStr}.

        [T: ${hours}:${minutes} X: ${this.position.x} Y: ${this.position.y}]`
      } else {
        draft.gameText = `You are in some dungeon ... facing ${directions[dir]}

        It's now ${timeStr}.

        [T: ${hours}:${minutes} L: ${draft.level} X: ${this.position.x} Y: ${this.position.y}]`
      }
      console.log(draft.gameText)
    })
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
    if (allowed) {
      this.position.x = new_x
      this.position.y = new_y
    }

    this.showMessage(msg)
  }

  turn(i) {
    this.dir += i
    this.showMessage()
  }

  exec(...commands) {
    for (let command of commands) {
      execCommand(command, "exec()")
    }
  }

}

export const gameState = new GameState()

