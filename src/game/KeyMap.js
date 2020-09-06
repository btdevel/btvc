import { gameState } from '../game/GameLogic'

export function execCommand (command, key) {
  const [funcname, ...args] = (typeof command === 'string') ? [command, []] : command

  // const func = functionMap[funcname]
  const func = gameState[funcname]
  // console.log('func: ', func);
  if (!func) {
    console.log(
      `Unknown function '${funcname}' (with args: ${JSON.stringify(
        args
      )}) for key binding '${key}'`
    )
    return
  }

  func.apply(gameState, args)
}

export function handleKeyDown (event) {
  // const {code, key} = event
  const { key } = event

  // console.log('key: ', key);
  if (!key) return

  const command = gameState.keyMap[key]
  // console.log('command: ', command);
  if (!command) return

  execCommand(command)

  event.preventDefault()
}
