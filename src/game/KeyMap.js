import { gameState } from '../game/GameLogic'



export function execCommand(command, key) {
  const [funcname, ...args] = (typeof command === 'string') ? [command, []] : command

  const commands = gameState?.commands
  const repl = commands && commands[command]
  if (repl) {
    execCommand(repl, `${key}/${repl}`)
    return
  }

  // const func = functionMap[funcname]
  const functions = gameState?.export
  const func = functions[funcname]
  // console.log('func: ', func);
  if (!func) {
    console.error(
      `Unknown function '${funcname}' (with args: ${JSON.stringify(
        args
      )}) for '${key}'`
    )
    return
  }

  func.apply(gameState, args)
}

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
