import React, {useEffect, useState} from 'react'
import Hammer from 'hammerjs'

import {handleKeyDown} from './KeyHandling'
import {addMouseHandlers} from './MouseHandling'
import {gameState} from '../game/GameLogic'

export default function GameControls({partyViewRef, screenRef}) {
  const [doc] = useState(document)

  const enableMouseHandling = true
  const mouseStartRef = partyViewRef
  const mouseMoveRef = screenRef
  const mouseUseCapture = false

  const enableGestures = true
  const gesturesElementRef = partyViewRef
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
    if (enableMouseHandling && mouseStartRef.current && mouseMoveRef.current) {
      const startElem = mouseStartRef.current
      const stopElem = mouseMoveRef.current
      return addMouseHandlers(startElem, stopElem, mouseUseCapture)
    }
  }, [enableMouseHandling, mouseUseCapture, mouseStartRef, mouseMoveRef])

  // Handle mouse gestures by HammerJS
  useEffect(() => {
    if (enableGestures && gesturesElementRef.current) {
      const element = gesturesElementRef.current
      const gestures = new Hammer(element);

      gestures.get('swipe').set({direction: Hammer.DIRECTION_ALL, threshold: 1, velocity: 0.05})
      gestures.get('pinch').set({ enable: true })
      const enableSwipe = (ev) => (enableMouseSwipes || ev.pointerType !== "mouse")
      gestures.on('swipeleft', (ev) => enableSwipe(ev) && gameState.turn(1))
      gestures.on('swiperight', (ev) => enableSwipe(ev) && gameState.turn(-1))
      gestures.on('swipeup', (ev) => enableSwipe(ev) && gameState.move(true))
      gestures.on('swipedown', (ev) => enableSwipe(ev) && gameState.move(false))

      gestures.on('pinchin', () => gameState.setFullscreen(false))
      gestures.on('pinchout', () =>  gameState.setFullscreen(true))

      return () => {
        gestures.stop()
        gestures.destroy()
      }
    }
  }, [enableGestures, enableMouseSwipes, gesturesElementRef])

  return <></>
}
