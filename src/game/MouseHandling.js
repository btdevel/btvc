import { gameState } from './GameLogic'
import { radians } from './Sun'

let isPressed = false
let xStart = 0
let yStart = 0
const maxPhi = radians(135)
const maxTheta = radians(45)
const clamp = (x, a, b) => Math.max(Math.min(x, b), a)

function setAngles (x, y) {
  gameState.dPhi = clamp(-(x - xStart) / 100, -maxPhi, maxPhi)
  gameState.dTheta = clamp(-(y - yStart) / 100, -maxTheta, maxTheta)
}

export function handleMouseDown (event) {
  xStart = event.screenX
  yStart = event.screenY
  isPressed = true
  setAngles(xStart, yStart)
  event.preventDefault()
}

export function handleMouseMove (event) {
  if (isPressed) {
    const x = event.screenX
    const y = event.screenY
    setAngles(x, y)
    event.preventDefault()
  }
}

export function handleMouseUp (event) {
  if (isPressed) {
    isPressed = false
    setAngles(xStart, yStart)
    event.preventDefault()
  }
}
