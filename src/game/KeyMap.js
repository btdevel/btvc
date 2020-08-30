import { gameState } from '../game/GameLogic'
import { LogLuvEncoding } from 'three'

const functionMap = {
  'move': args => gameState.move(args),
  'turn': args => gameState.turn(args),
  'showInfo': args => gameState.showInfo()
}

const keyMap = {
  'ArrowUp': ['move', -1],
  'ArrowDown': ['move', +1],
  'ArrowLeft': ['turn', 1],
  'ArrowRight': ['turn', -1],
  '?': ['showInfo']
}


export function onKeyEvent (event) {
  console.log(event);
  const {code, key} = event

  console.log('key: ', key);
  if (!key) return

  const command = keyMap[key]
  console.log('command: ', command);
  if (!command) return 

  const [funcname, ...args] = command
  console.log('func: ', funcname, args);
  
  const func = functionMap[funcname]
  console.log('func: ', func);
  if (!func) return

  func.apply(null, args)

  event.preventDefault()
}