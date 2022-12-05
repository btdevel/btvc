import {gameState} from '../game/GameLogic'
import {execCommand} from "../game/ExecCommand";


export function handleKeyDown(event) {
  // todo: must implement ability to disable this...
  // for dialogs that also need keyboard input
  // const {code, key} = event
  if( !gameState.canGrabKeyboard ) return

  // console.log(event.target.nodeName)
  const {key} = event

  if (!key) return

  const command = gameState.keyMap[key]
  // console.log('command: ', command);
  if (!command) return

  execCommand(command, `keypress: ${key}`)

  event.preventDefault()
}
