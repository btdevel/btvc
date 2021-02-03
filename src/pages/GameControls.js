import React, { useEffect, useState } from 'react'
import { handleKeyDown } from '../game/KeyMap'
import { handleMouseDown, handleMouseMove, handleMouseUp } from '../game/MouseHandling'
import Hammer from 'hammerjs'
import { gameState } from '../game/GameLogic'


export default function GameControls() {
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const [element] = useState(document)
  // useEffect(() => {
  //   const el = document.getElementById('3dview')
  //   console.log('3DView: ', el)
  //   setElement(el)
  // }, [])

  useEffect(() => {
    console.log("Adding event listener: ", element)
    if (element) {
      const useCapture = false

      const el = document.getElementById('gamescreen')
      const gestures = new Hammer(el);
      gestures.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
      gestures.on("swipe", function (ev) {
        console.log("swipe event: ", ev);
      });
      const nm = (ev) => (ev.pointerType !== "mouse")
      gestures.on('swipeleft', (ev) => nm(ev) && gameState.turn(1))
      gestures.on('swiperight', (ev) => nm(ev) && gameState.turn(-1))
      gestures.on('swipeup', (ev) => nm(ev) && gameState.move(true))
      gestures.on('swipedown', (ev) => nm(ev) && gameState.move(false))


      element.addEventListener('mousedown', handleMouseDown, useCapture)
      element.addEventListener('mousemove', handleMouseMove, useCapture)
      element.addEventListener('mouseup', handleMouseUp, useCapture)
      element.addEventListener('mouseleave', handleMouseUp, useCapture)
      console.log("Added event listener: ", element)

      return () => {
        element.removeEventListener('mousedown', handleMouseDown)
        element.removeEventListener('mousemove', handleMouseMove)
        element.removeEventListener('mouseup', handleMouseUp)
        element.removeEventListener('mouseleave', handleMouseUp)
        gestures.stop()
        gestures.destroy()
      }
    }
  }, [element])
  return <></>
}
