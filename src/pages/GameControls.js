import React, { useEffect, useState } from 'react'
import { handleKeyDown } from '../game/KeyMap'
import { addMouseHandlers } from '../game/MouseHandling'
import Hammer from 'hammerjs'
import { gameState } from '../game/GameLogic'

export default function GameControls() {
  const [doc] = useState(document)

  const enableMouseHandling = true
  const mouseElementId = 'party-view'
  const mouseElementId2 = 'game-screen'
  const mouseUseCapture = false

  const enableGestures = true
  const gesturesElementId = 'party-view'
  const enableMouseSwipes = true

  // Handle keyboard events
  useEffect(() => {
    doc.addEventListener('keydown', handleKeyDown, false)

    return () => {
      doc.removeEventListener('keydown', handleKeyDown)
    }
  }, [doc])


  // Handle mouse events directly
  // todo: could also be done by HammerJS pan events
  useEffect(() => {
    if (enableMouseHandling && doc) {
      const startElem = doc.getElementById(mouseElementId)
      const stopElem = doc.getElementById(mouseElementId2)
      return addMouseHandlers(startElem, stopElem, mouseUseCapture)
    }
  }, [enableMouseHandling, mouseUseCapture, doc])

  // Handle mouse gestures by HammerJS
  useEffect(() => {
    if (enableGestures && doc) {
      const element = doc.getElementById(gesturesElementId)
      const gestures = new Hammer(element);

      gestures.get('swipe').set({ direction: Hammer.DIRECTION_ALL, threshold: 1, velocity: 0.05 });
      const enableSwipe = (ev) => (enableMouseSwipes || ev.pointerType !== "mouse")
      gestures.on('swipeleft', (ev) => enableSwipe(ev) && gameState.turn(1))
      gestures.on('swiperight', (ev) => enableSwipe(ev) && gameState.turn(-1))
      gestures.on('swipeup', (ev) => enableSwipe(ev) && gameState.move(true))
      gestures.on('swipedown', (ev) => enableSwipe(ev) && gameState.move(false))

      return () => {
        gestures.stop()
        gestures.destroy()
      }
    }
  }, [enableGestures, enableMouseSwipes, doc])

  return <></>
}
