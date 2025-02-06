import {useEffect, useState} from 'react'
import Hammer from 'hammerjs'

import {handleKeyDown} from './KeyHandling'
import {addMouseHandlers} from './MouseHandling'
import {gameState, useGameConfig} from '../game/GameLogic'

export default function GameControls({partyViewRef, screenRef}) {
  const [doc] = useState(document)
  const gameConfig = useGameConfig()

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
      const invertX = gameConfig.invertX
      const invertY = gameConfig.invertY

      gestures.get('swipe').set({direction: Hammer.DIRECTION_ALL, threshold: 1, velocity: 0.05})
      gestures.get('pinch').set({ enable: true })
      const enableSwipe = (ev) => (gameState.enableMouseControls && (enableMouseSwipes || ev.pointerType !== "mouse"))
      gestures.on('swipeleft', (ev) => enableSwipe(ev) && gameState.turn(invertX ? -1 : 1))
      gestures.on('swiperight', (ev) => enableSwipe(ev) && gameState.turn(invertX ? 1 : -1))
      gestures.on('swipeup', (ev) => enableSwipe(ev) && gameState.move(!invertY))
      gestures.on('swipedown', (ev) => enableSwipe(ev) && gameState.move(invertY))

      gestures.on('pinchin', () => gameState.setFullscreen(false))
      gestures.on('pinchout', () =>  gameState.setFullscreen(true))

      return () => {
        gestures.stop()
        gestures.destroy()
      }
    }
  }, [enableGestures, enableMouseSwipes, gesturesElementRef, gameConfig])

  return <></>
}
