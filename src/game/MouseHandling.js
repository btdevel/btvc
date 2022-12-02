import { gameState } from './GameLogic'
import { radians } from './Sun'

const maxPhi = radians(135)
const maxTheta = radians(45)
const clamp = (t, a, b) => Math.max(Math.min(t, b), a)

export function setViewAngles (diffX, diffY) {
  gameState.dPhi = clamp(-diffX / 100, -maxPhi, maxPhi)
  gameState.dTheta = clamp(-diffY / 100, -maxTheta, maxTheta)
}

export function addMouseHandlers(el, useCapture) {
  let isPressed = false
  let xStart = 0
  let yStart = 0
  let useRightMouse = true;

  function setAngles (x, y) {
    setViewAngles(x-xStart, y-yStart)
  }

  function handleMouseDown (event) {
    if( (event.buttons & 1)!==0 && useRightMouse ) return
    if( (event.buttons & 2)!==0 && !useRightMouse ) return
    xStart = event.screenX
    yStart = event.screenY
    isPressed = true
    setAngles(xStart, yStart)
    event.preventDefault()
    return false
  }

  function handleMouseMove (event) {
    if (isPressed) {
      const x = event.screenX
      const y = event.screenY
      setAngles(x, y)
      event.preventDefault()
      return false
    }
  }

  function handleMouseUp (event) {
    if (isPressed) {
      isPressed = false
      setAngles(xStart, yStart)
      event.preventDefault()
      return false
    }
  }

  el.addEventListener('mousedown', handleMouseDown, useCapture)
  el.addEventListener('mousemove', handleMouseMove, useCapture)
  el.addEventListener('mouseup', handleMouseUp, useCapture)
  el.addEventListener('mouseleave', handleMouseUp, useCapture)
  if( useRightMouse ) {
    el.addEventListener('contextmenu', handleMouseDown, useCapture);
  }
  console.log("Added mouse event listener to: ", el)

  return () => {
    console.log("Removing mouse event listener from: ", el)
    el.removeEventListener('mousedown', handleMouseDown, useCapture)
    el.removeEventListener('mousemove', handleMouseMove, useCapture)
    el.removeEventListener('mouseup', handleMouseUp, useCapture)
    el.removeEventListener('mouseleave', handleMouseUp, useCapture)
    el.removeEventListener('contextmenu', handleMouseDown, useCapture)
  }
}
