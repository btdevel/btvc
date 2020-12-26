import React from 'react'

import create from 'zustand'
import produce from 'immer'
import TimeStepper from './TimeStepper'
import { CityMap } from './CityMap'
import { radians, hour_angle, declination, elevation, sunPosition } from './Sun'

import cityMapImg from '../assets/images/city/bt1-skara-brae.jpg'
import { execCommand } from './KeyMap'
import { mapTo } from '../util/math'

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

function modifyState (func) {
  // api.getState().modify(func)
  useStore.getState().modify(func)
}

export const gameState = {
  stepper: new TimeStepper(),

  position: { x: 0, y: 0 },
  dir: 0,
  dPhi: 0,
  dTheta: 0,
  keyMap: {},
  
  init (config) {
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
    console.log('Init: ', this);
  
    for(const command of commands) {
      console.log(command);
      execCommand(command)
    }
  },

  angle () {
    return radians(this.dir * 90)
  },
  
  showInfo () {
    const time = this.time_hours() % 24
    const hours = Math.floor(time)
    const minutes = Math.floor((time - hours) * 60)
    modifyState(draft => {
      draft.gameText = `You are in Skara Brae. It is ${hours}:${minutes} o'clock and you are at X: ${this.position.x} Y: ${this.position.y}`
    })
  },
  
  showMap () {
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
        <div style={{width: '100%', height: '100%'}}>
          <img height='100%' width='100%' src={cityMapImg} alt="Map of Skara Brae"/>
          <div style={{ fontSize: 12, fontWeight: 'bold',  fontFamily: 'sans', color: 'red', position: 'absolute', left: x, top: y}}>{arrows[dir]}</div>
        </div>
      )
    })
  },

  clearInfo () {
    modifyState(draft => {
      draft.gameText = ''
    })
  },

  toggleFullscreen () {
    modifyState(draft => {
      draft.fullscreen = !draft.fullscreen
    })
  },

  setOrbitcontrols (onoff) {
    modifyState(draft => {
      draft.orbitcontrols = onoff
    })
  },

  sun: {
    latitude: radians(51),
    day: 180,
    hour_angle () {
      return hour_angle(gameState.time_hours())
    },
    elevation () {
      // return radians(30)
      return elevation(this.latitude, declination(this.day), this.hour_angle())
    },
    position () {
      // const phi = gameState.sun.azimuth()
      const phi = gameState.sun.hour_angle()
      const theta = gameState.sun.elevation()
      return sunPosition(phi, theta)
    }
  },


  pause () {
    this.stepper.pause()
  },

  resume () {
    this.stepper.resume()
  },

  togglePause () {
    this.stepper.setPaused(!this.stepper.isPaused())
  },

  time () {
    return this.stepper.getSimTime()
  },

  time_hours () {
    return this.time() / TimeStepper.HOUR
  },

  move (i) {
    const dir = this.dir
    const dx = i * Math.round(Math.sin(0.5 * dir * Math.PI))
    const dy = i * Math.round(Math.cos(0.5 * dir * Math.PI))
    const x = this.position.x + dx
    const y = this.position.y + dy
    if (cityMap.type[x][y] === 0) {
      this.position.x += dx
      this.position.y += dy
    }
    this.clearInfo()
  },

  turn (i) {
    this.dir += i
    this.clearInfo()
  },

  strafe (i) {
    this.turn(1)
    this.move(i)
    this.turn(-1)
  },

  setLevel (level) {
    modifyState(draft => {draft.level = level})
  }
}
// Object.freeze(gameState)
