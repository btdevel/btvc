import {gameState} from '../game/GameLogic'
import {engine} from "../game/CommandEngine"


export function handleKeyDown(event) {
  // for dialogs that also need keyboard input
  if( !gameState.enableKeyMap ) return

  const {key} = event
  if (!key) return

  const command = gameState.keyMap[key] || gameState.keyMap[key.toLowerCase()]
  if (!command) return

  engine.execImmediate([command], `keypress: ${key}`)

  event.preventDefault()
}
