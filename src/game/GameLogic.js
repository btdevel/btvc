import React from 'react'

import create from 'zustand'
import produce from 'immer'
import TimeStepper from './TimeStepper'
import { CityMap } from './CityMap'
import { radians, hour_angle, declination, elevation, sunPosition } from './Sun'

import cityMapImg from '../assets/images/city/bt1-skara-brae.jpg'
import { execCommand } from './KeyMap'
import { mapTo } from '../util/math'
import { startGUI } from './ExpGUI'

const cityMap = new CityMap()

// export const [useStore, api] = create((set, get) => {
export const useStore = create((set, get) => {
  const modify = fn => set(produce(fn))

  return {
    modify: modify,

    overlayText: '',
    gameText: 'Welcome to Skara Brae!',
    fullscreen: false,
    orbitcontrols: false,
    level: 'city'
  }
})

export function modifyState(func) {
  useStore.getState().modify(func)
}

export const gameState = {
  stepper: new TimeStepper(),

  position: { x: 0, y: 0 },
  dir: 0,
  dPhi: 0,
  dTheta: 0,
  keyMap: {},

  init(config) {
    this.position.x = config.position.x
    this.position.y = config.position.y
    this.dir = config.dir
    this.keyMap = config.keyMap

    this.setOrbitcontrols(config.orbitcontrols)
    this.setLevel(config.level)

    const hour = config.hour
    const dayLengthInMinutes = config.dayLengthInMinutes
    const commands = config.initCommands

    const stepper = this.stepper
    stepper.pause()
    stepper.setSimSpeed(
      TimeStepper.DAY / TimeStepper.MINUTE / dayLengthInMinutes
    )
    stepper.setSimTime(hour * TimeStepper.HOUR)
    stepper.resume()
    // console.log('Init: ', this);

    for (const command of commands) {
      console.log(command);
      execCommand(command)
    }
  },

  angle() {
    return radians(this.dir * 90)
  },

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
      if (draft.level === 'city') {
        draft.gameText = `You are on ?? Street facing ${directions[this.dir]}.

        It's now ${timeStr}.

        [T: ${hours}:${minutes} X: ${this.position.x} Y: ${this.position.y}]`
      } else {
        draft.gameText = `You are in some dungeon ...

        It's now ${timeStr}.

        [T: ${hours}:${minutes} L: ${draft.level} X: ${this.position.x} Y: ${this.position.y}]`
      }
      console.log(draft.gameText)
    })
  },

  showMap() {
    modifyState(draft => {
      // const x = this.position.x * 10
      // const y = this.position.y * 10

      // Guild at 25,14
      // const x = 200
      // const y = 86
      // Mangar at 2, 24
      // const x = 42
      // const y = 138
      const x = mapTo(this.position.x, 2, 25, 42, 200)
      // const y = mapTo(this.position.y, 14, 24, 86, 138)
      const y = mapTo(this.position.y, 14, 24, 90, 140)
      const arrows = ['\u2191', '\u2190', '\u2193', '\u2192']
      const dir = ((this.dir % 4) + 4) % 4
      console.log(this.dir, dir);

      draft.gameText = (
        <div style={{ width: '100%', height: '100%' }}>
          <img height='100%' width='100%' src={cityMapImg} alt="Map of Skara Brae" />
          <div style={{ fontSize: 12, fontWeight: 'bold', fontFamily: 'sans', color: 'red', position: 'absolute', left: x, top: y }}>{arrows[dir]}</div>
        </div>
      )
    })
  },

  clearInfo() {
    modifyState(draft => {
      draft.gameText = ''
    })
  },

  toggleFullscreen() {
    modifyState(draft => {
      draft.fullscreen = !draft.fullscreen
    })
  },

  setOrbitcontrols(onoff) {
    modifyState(draft => {
      draft.orbitcontrols = onoff
    })
  },

  sun: {
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
  },


  pause() {
    this.stepper.pause()
  },

  resume() {
    this.stepper.resume()
  },

  togglePause() {
    this.stepper.setPaused(!this.stepper.isPaused())
  },

  time() {
    return this.stepper.getSimTime()
  },

  time_hours() {
    return this.time() / TimeStepper.HOUR
  },

  move(i) {
    const dir = this.dir
    const dx = i * Math.round(Math.sin(0.5 * dir * Math.PI))
    const dy = i * Math.round(Math.cos(0.5 * dir * Math.PI))
    const x = this.position.x + dx
    const y = this.position.y + dy

    const level = useStore.getState().level;
    if (level != 'city' || cityMap.type[x][y] === 0) {
      this.position.x += dx
      this.position.y += dy
    }
    this.clearInfo()
  },

  turn(i) {
    this.dir += i
    this.clearInfo()
  },

  strafe(i) {
    this.turn(1)
    this.move(i)
    this.turn(-1)
  },

  setLevel(level) {
    modifyState(draft => { draft.level = level })
  },

  doDebugStuff() {
    startGUI()
  }
}
// Object.freeze(gameState)
