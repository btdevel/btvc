import {gameState} from '../game/GameLogic'

export function addMouseHandlers(startElem, stopMoveElem, useCapture) {
  let isPressed = false
  let xStart = 0
  let yStart = 0
  let useRightMouse = true;

  function setAngles(x, y) {
    gameState.setViewAngles(x - xStart, y - yStart)
  }

  function handleMouseDown(event) {
    const canHandle = gameState.enableMouseControls && //
      !((event.buttons & 1) !== 0 && useRightMouse) && //
      !((event.buttons & 2) !== 0 && !useRightMouse)
    if (canHandle) {
      xStart = event.screenX
      yStart = event.screenY
      isPressed = true
      setAngles(xStart, yStart)
    }
    event.preventDefault()
    return false
  }

  function handleMouseMove(event) {
    if (!gameState.enableMouseControls) {
      // Weird case then the player moves while holding the right button down...
      isPressed = false
      setAngles(xStart, yStart)
    }
    if (isPressed) {
      const x = event.screenX
      const y = event.screenY
      setAngles(x, y)
    }
    event.preventDefault()
    return false
  }

  function handleMouseUp(event) {
    isPressed = false
    setAngles(xStart, yStart)
    event.preventDefault()
    return false
  }

  startElem.addEventListener('mousedown', handleMouseDown, useCapture)
  stopMoveElem.addEventListener('mousemove', handleMouseMove, useCapture)
  stopMoveElem.addEventListener('mouseup', handleMouseUp, useCapture)
  stopMoveElem.addEventListener('mouseleave', handleMouseUp, useCapture)
  if (useRightMouse) {
    startElem.addEventListener('contextmenu', handleMouseDown, useCapture);
  }
  console.log("Added mouse event listener to: ", startElem)

  return () => {
    console.log("Removing mouse event listener from: ", startElem)
    startElem.removeEventListener('mousedown', handleMouseDown, useCapture)
    stopMoveElem.removeEventListener('mousemove', handleMouseMove, useCapture)
    stopMoveElem.removeEventListener('mouseup', handleMouseUp, useCapture)
    stopMoveElem.removeEventListener('mouseleave', handleMouseUp, useCapture)
    startElem.removeEventListener('contextmenu', handleMouseDown, useCapture)
  }
}
