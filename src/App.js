import React from 'react'
import GameScreen from './pages/GameScreen'
import { gameState } from './game/GameLogic'

let startHour = 12
// let startX = 25 // Guild
// let startY = 15
// let startDir = 0

// let startX = 2 // City gate
// let startY = 14
// let startDir = 1

let startX = 3
let startY = 14
let startDir = 0
 
gameState.init(startHour, startX, startY, startDir)
gameState.pause()

export default function App () {
  return (
    <GameScreen />
  )
}
