import { gameState } from '../game/GameLogic'

const keyMap = {
  'ArrowUp': ['move', -1],
  'ArrowDown': ['move', +1],
  'ArrowLeft': ['turn', 1],
  'ArrowRight': ['turn', -1],

  'w': ['move', -1],
  's': ['move', +1],
  'a': ['turn', 1],
  'd': ['turn', -1],
  'q': ['strafe', -1],
  'e': ['strafe', 1],

  '?': ['showInfo'],
  'm': ['showMap'],
  'f': ['toggleFullscreen'],
  'p': ['togglePause'],
}


export function handleKeyDown (event) {
  console.log(event);
  // const {code, key} = event
  const {key} = event

  // console.log('key: ', key);
  if (!key) return

  const command = keyMap[key]
  // console.log('command: ', command);
  if (!command) return 

  const [funcname, ...args] = command
  // console.log('func: ', funcname, args);
  
  // const func = functionMap[funcname]
  const func = gameState[funcname]
  // console.log('func: ', func);
  if (!func) {
    console.log(`Unknown function '${funcname}' (with args: ${JSON.stringify(args)}) for key binding '${key}'`);
    return
  }

  // func.apply(null, args)
  func.apply(gameState, args)

  event.preventDefault()
}
