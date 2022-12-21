import {gameState} from '../game/GameLogic'
import {execCommand} from "../game/CommandEngine";


export function handleKeyDown(event) {
  // for dialogs that also need keyboard input
  if( !gameState.canGrabKeyboard ) return

  const {key} = event
  if (!key) return

  const command = gameState.keyMap[key] || gameState.keyMap[key.toLowerCase()]
  if (!command) return

  execCommand(command, `keypress: ${key}`)

  event.preventDefault()
}
