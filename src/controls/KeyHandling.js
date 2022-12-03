import {gameState} from '../game/GameLogic'
import {execCommand} from "../game/ExecCommand";


export function handleKeyDown (event) {
  // const {code, key} = event
  const { key } = event

  if (!key) return

  const command = gameState.keyMap[key]
  // console.log('command: ', command);
  if (!command) return

  execCommand(command, `keypress: ${key}`)

  event.preventDefault()
}
