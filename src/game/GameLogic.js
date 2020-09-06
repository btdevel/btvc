import React from 'react'

import create from 'zustand'
import produce from 'immer'
import TimeStepper from './TimeStepper'
import { CityMap } from './CityMap'
import { radians, hour_angle, declination, elevation, sunPosition } from './Sun'

import cityMapImg from '../assets/images/city/bt1-skara-brae.jpg'

const cityMap = new CityMap()

function randomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function mapTo(x, a, b, c, d) {
  return ((x - a) / (b - a)) * (d - c) + c
}

export const [useStore, api] = create((set, get) => {
  const modify = fn => set(produce(fn))

  return {
    modify: modify,

    overlayText: '',
    gameText: 'Welcome to Skara Brae!',
    fullscreen: false
  }
})

export const gameState = {
  stepper: new TimeStepper(),

  dir: 0,
  position: { x: 0, y: 0 },
  dPhi: 0,
  dTheta: 0,

  angle () {
    return radians(this.dir * 90)
  },

  showInfo () {
    const time = this.time_hours() % 24
    const hours = Math.floor(time)
    const minutes = Math.floor((time - hours) * 60)
    api.getState().modify(draft => {
      draft.gameText = `You are in Skara Brae. It is ${hours}:${minutes} o'clock and you are at X: ${this.position.x} Y: ${this.position.y}`
    })
  },

  showMap () {
    api.getState().modify(draft => {
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
          <img height='100%' width='100%' src={cityMapImg} />
          <div style={{ fontSize: 12, fontWeight: 'bold',  fontFamily: 'sans', color: 'red', position: 'absolute', left: x, top: y}}>{arrows[dir]}</div>
        </div>
      )
    })
  },

  clearInfo () {
    api.getState().modify(draft => {
      draft.gameText = ''
    })
  },

  toggleFullscreen () {
    api.getState().modify(draft => {
      draft.fullscreen = !draft.fullscreen
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

  init (startHour, startX, startY, startDir) {
    this.position.x = startX
    this.position.y = startY
    this.dir = startDir

    const dayLengthInMinutes = 50
    const stepper = this.stepper
    stepper.pause()
    stepper.setSimSpeed(
      TimeStepper.DAY / TimeStepper.MINUTE / dayLengthInMinutes
    ) // One minute is 24 hours
    stepper.setSimTime(startHour * TimeStepper.HOUR)
    stepper.resume()
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
    if (cityMap.type[x][y] == 0) {
      this.position.x += dx
      this.position.y += dy
    }
    this.clearInfo()
  },

  turn (i) {
    this.dir += i
    this.clearInfo()
  }
}
// Object.freeze(gameState)
