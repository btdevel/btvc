import React from 'react'
import create from 'zustand'
import produce from 'immer'

import {loadConfig, loadYAML} from './ConfigLoader'
import {importChars} from './Loader/Loader'
import {loadParty} from './Party'
import {engine} from "./CommandEngine"
import {CityMap} from './CityMap'
import DungeonMap from './DungeonMap'
import {getDirName, moveDir, normalizeDir} from './Direction'
import {declination, elevation, hour_angle, sunPosition} from './Sun'
import {saveAudioConfig, saveGameConfig, saveGraphicsConfig, saveVideoConfig} from "./Storage"
import imageMap from './Images'
import TimeStepper from '../util/TimeStepper'
import {clamp, mod, radians} from '../util/math'
import {addEventListeners} from '../util/event'
import {wordWrap} from '../util/strings'

import configFile from '../assets/config/game_config.yaml'
import programFile from '../assets/config/programs.yaml'
import zipUrlAmiga from '../assets/data/amiga.zip'


const useStore = create((set, get) => {
  const modify = fn => set(produce(fn))

  return {
    modify: modify,

    overlayText: '',
    overlayImage: '',
    gameText: [],
    fullscreen: false,
    level: 'city',
    map: null,
    location: '',
    config: {},
    characters: [],
    pos: {x: 0, y: 0},
    dir: 0
  }
})

export const useGameStore = useStore

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
export const setGameText = (text, lineNum, options) => modifyState(state => {
  if (typeof text == "string") {
    let newGameText = [...state.gameText]
    if (lineNum === undefined) {
      newGameText = []
      lineNum = 0
    } else if (lineNum == "append") {
      lineNum = newGameText.length
    }
    for (let l = newGameText.length; l < lineNum; l++) newGameText[l] = ""
    text = wordWrap(text, 22, '|')
    const lines = text.split(/\||\n/)
    for( let l=0; l<lines.length; l++ ) {
      let line = lines[l]
      if( options?.center ) line = <p style={{textAlign: "center"}}>{line}</p>
      if( options?.callback ) line = <span onClick={() => options.callback()}>{line}</span>
      newGameText[lineNum + l] = line
    }
    state.gameText = newGameText
  } else if (Array.isArray(text)) {
    state.gameText = text
  } else if (text === undefined) {
    state.gameText = []
  } else {
    console.warn("Unknown text type for setGameText: ", text)
  }
})
export const setCharacters = (characters) => modifyState(state => {
  state.characters = characters
})

export const setConfig = (config) => modifyState(state => {
  state.config = config
})
export const setGameConfig = (gameConfig, save = false) => {
  modifyState(state => {
    state.config.audio = gameConfig
  })
  if (save) saveGameConfig(gameConfig)
}
export const setAudioConfig = (audioConfig, save = false) => {
  modifyState(state => {
    state.config.audio = audioConfig
  })
  if (save) saveAudioConfig(audioConfig)
}
export const setVideoConfig = (videoConfig, save = false) => {
  modifyState(state => {
    state.config.video = videoConfig
  })
  if (save) saveVideoConfig(videoConfig)
}
export const setGraphicsConfig = (graphicsConfig, save = false) => {
  modifyState(state => {
    state.config.graphics = graphicsConfig
  })
  if (save) saveGraphicsConfig(graphicsConfig)
}

export const useOverlayText = () => useStore(state => state.overlayText)
export const useOverlayImage = () => useStore(state => state.overlayImage)
export const useLocation = () => useStore(state => state.location)
export const useGameText = () => useStore(state => state.gameText)
export const useFullscreen = () => useStore(state => state.fullscreen)
export const useLevel = () => useStore(state => state.level)
export const useMap = () => useStore(state => state.map)
export const useCharacters = () => useStore(state => state.characters)

const identity = (x) => x
export const useConfig = (func = identity) => useStore(state => func(state.config))
export const useGameConfig = (func = identity) => useStore(state => func(state.config?.game))
export const useAudioConfig = (func = identity) => useStore(state => func(state.config?.audio))
export const useVideoConfig = (func = identity) => useStore(state => func(state.config?.video))
export const useGraphicsConfig = (func = identity) => useStore(state => func(state.config?.graphics))

class GameState {
  stepper = new TimeStepper()
  // pos = {x: 0, y: 0}
  debug = false
  flyMode = false
  dPhi = 0
  dTheta = 0
  canGrabKeyboard = true
  keyMap = {}

  get direction() {
    return useGameStore.getState().dir
  }
  set direction(d) {
    modifyState((state) => {
      state.dir = d
    })
    this.showDebugInfo()
  }
  get position() {
    return useGameStore.getState().pos
  }
  set position(p) {
    modifyState((state) => {
      state.pos = p
    })
    this.showDebugInfo()
  }

  functions = {
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
    exec: (commands) => engine.execCommands(commands),
    program: (name, ...args) => this.execProgram(name, true, ...args),
    subprogram: (name, ...args) => this.execProgram(name, false, ...args),
    toggleFullscreen: this.toggleFullscreen,
    setFullscreen: this.setFullscreen,
    togglePause: this.togglePause,
    loadLevel: this.loadLevel,
    pause: this.pause,
    resume: this.resume,
    nextLevel: () => {
      this.loadLevel(this.level + 1)
    },
    prevLevel: () => {
      this.loadLevel(this.level - 1)
    },
    toggleFly: () => {
      this.flyMode = !this.flyMode
    },
    doDebugStuff: () => {/* currently nothing*/
      this.debug = true
    },
    delay: this.delay,
    waitForKeyPress: this.waitForKeyPress,
    riddle: this.riddle,
    selection: this.selection,
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
    },
  }

  get level() {
    return useStore.getState().level
  }

  get map() {
    return useStore.getState().map
  }


  async loadParty(zipUrl, overwrite = false) {
    const [_, partys] = await importChars(zipUrl, overwrite)
    const chars = loadParty(partys[0].name)
    setCharacters(chars)
  }

  async init() {

    const config = await loadConfig(configFile)

    // this.config = config
    // this.position.x = config.position.x
    // this.position.y = config.position.y
    this.position = config.position
    this.direction = config.dir
    this.keyMap = config.keyMap


    await this.loadLevel(config.level)

    const stepper = this.stepper
    stepper.pause()
    stepper.setSimSpeed(
      TimeStepper.DAY / TimeStepper.MINUTE / config.dayLengthInMinutes,
    )
    stepper.setSimTime(config.hour * TimeStepper.HOUR)
    stepper.resume()

    const programsConfig = await loadYAML(programFile)
    engine.init(this.functions, config.commands, programsConfig.programs)
    engine.start()

    for (const command of config.initCommands) {
      console.log('Init command:', command)
      engine.execCommand(command, "init()")
    }

    setConfig(config)

    await this.loadParty(zipUrlAmiga)
  }

  setViewAngles(diffX, diffY) {
    const maxPhi = radians(135)
    const maxTheta = radians(45)
    this.dPhi = clamp(-diffX / 100, -maxPhi, maxPhi)
    this.dTheta = clamp(-diffY / 100, -maxTheta, maxTheta)
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
    return radians(this.direction * 90)
  }

  showInfo() {
    this.map.showInfo(this.time_hours(), this.position, this.direction)
  }

  showMap() {
    this.map.showMap(this.position, this.direction)
  }

  showMessage(msg = "") {
    setGameText(msg)
  }

  toggleFullscreen() {
    modifyState(draft => {
      draft.fullscreen = !draft.fullscreen
    })
  }

  setFullscreen(onOff) {
    modifyState(draft => {
      draft.fullscreen = onOff
    })
  }

  pause() {
    console.log("Pausing game")
    this.stepper.pause()
  }

  delay(time_in_secs) {
    engine.pause(true)
    setTimeout(() => engine.pause(false), time_in_secs * 1000)
  }

  #stopEngine() {
    engine.pause(true)
    const oldState = this.canGrabKeyboard
    this.canGrabKeyboard = false
    const resume = () => {
      this.canGrabKeyboard = oldState
      engine.pause(false)
      setGameText("")
    }
    return resume

  }
  waitForKeyPress(text) {
    const resume = this.#stopEngine()
    if (text) setGameText(text, 11, {center: true})
    addEventListeners(document, ['click', 'contextmenu', 'touchend', 'keyup'], resume, {once: true})
  }

  riddle(text, correctAnswer, successCmd, failCmd) {
    const resume = this.#stopEngine()
    setGameText(text)
    setGameText(correctAnswer, "append")
    addEventListeners(document, ['click', 'contextmenu', 'touchend', 'keyup'], resume, {once: true})
  }

  selection(text, ...choices) {
    const resume = this.#stopEngine()
    setGameText(text + "|")
    for( let choice of choices ) {
      const [text, key, command, lineDef] = choice
      const lineNum = lineDef ? mod(lineDef, 12) : "append"
      setGameText(text, lineNum, {center: !!lineDef, callback: () => {engine.execCommand(command); resume()}})
    }
  }

  resume() {
    console.log("Resuming game")
    this.stepper.resume()
  }

  togglePause() {
    // setLocation("this.map.name")
    setOverlayImage(null)
    // setGameText()
    this.stepper.isPaused() ? this.resume() : this.pause()
  }

  time() {
    return this.stepper.getSimTime()
  }

  time_hours() {
    return this.time() / TimeStepper.HOUR
  }

  savePosition() {
    this.saved = {
      position: this.position,
      dir: this.direction,
    }
  }

  restorePosition() {
    this.position = this.saved.position
    this.direction = this.saved.dir
  }

  move(forward) {
    const map = this.map
    const dir = normalizeDir(this.direction, forward)
    const new_x = moveDir(this.position.x, dir, true, map.width)
    const new_y = moveDir(this.position.y, dir, false, map.height)
    if (!this.flyMode) {
      const [allowed, msg] = map.canMove(this.position.x, this.position.y, dir, new_x, new_y)
      this.showMessage(msg)
      if (!allowed) return
    }

    if (map.isCity()) this.savePosition()
    this.position = {x: new_x, y: new_y}
    if (!this.flyMode) {
      this.map.enter(this.position)
    }
  }

  turn(i) {
    // we don't wrap around here (mod 4) because that would cause problems with the smooth 3d rotation
    // rather we always use mod 4 in map computations
    this.direction += i
    this.showMessage()
  }

  jump(x, y) {
    this.position = {x: x, y: y}
    this.jumped = true
    this.showMessage()
  }

  teleport(level, x, y) {
    this.loadLevel(level)
    this.position = {x: x, y:y }
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

  execProgram(prog, replace, ...args) {
    engine.run(prog, replace, ...args)
  }

  showDebugInfo() {
    if (this.debug) {
      const time = mod(this.time_hours(), 24)

      function pad(num, size) {
        return ('00' + num).substr(-size)
      }

      const hours = pad(Math.floor(time), 2)
      const minutes = pad(Math.floor((time - hours) * 60), 2)
      const direction = getDirName(this.direction)
      const pos = this.position
      setOverlayText(`[T: ${hours}:${minutes} L: ${this.level} X: ${pos.x} Y: ${pos.y} D: ${direction}]`)
    }
  }

}

export const gameState = new GameState()
export const gameInit = () => gameState.init()
