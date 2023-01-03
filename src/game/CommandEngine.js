import {gameState, setGameText, setLocation, setOverlayImage} from "./GameLogic"
import {dumpConfig} from './ConfigLoader'

const ticInterval = 20

class CommandEngine {
  stack = []
  programRunning = false

  started = false
  paused = false

  programDefs = {}
  commandDefs = {}
  functions = {}

  init(functions, commandDefs, programDefs) {
    this.functions = functions
    this.commandDefs = commandDefs
    this.programDefs = programDefs
    console.log("Init called", this)
  }

  start() {
    if( !this.started ) {
      console.log("Starting engine...")
      setInterval(() => this.#tic(), ticInterval)
      this.started = true
    }
  }
  pause(paused) {
    this.paused = paused
    console.log(paused ? "Pausing engine" : "Resuming engine")
  }

  #pushProg(prog, replace) {
    if (replace)
      this.stack = [prog]
    else
      this.stack.unshift(prog)
    console.log("Pushed prog: ", replace, dumpConfig(this.stack))
  }
  #getTop() {
    while( this.stack.length>0) {
      if( this.stack[0].commands.length > 0) {
        return this.stack[0]
      }
      else {
        console.log("Popping program stack...")
        this.stack.shift()
      }
    }
  }
  #tic() {
    if (this.programRunning && !this.paused) {
      const program = this.#getTop()
      if (program) {
        const command = program.commands.shift()
        console.log("Executing: ", command);
        execCommand(command)
      } else {
        setLocation(gameState.map.name)
        setOverlayImage(null)
        setGameText()
        this.programRunning = false
      }
    }
  }

  run(name, replace, ...args) {
    console.log("Executing program: ", name, " with args: ", ...args)

    const commands = this.programDefs[name]
    if (!commands) {
      console.warn("Unknown program: ", name, commands)
      console.log(this.programDefs)
      return
    }

    const newProg = {name: name, commands: [...commands], args: args}
    console.log('Program:', dumpConfig(newProg))
    this.#pushProg( newProg, replace)

    this.programRunning = true
  }

  execCommand(command, invoker) {
    // If command of the form "string" then funcname="string" and args=[]
    // otherwise if its of the form ["foo", arg1, arg2] then funcname="foo" and args=[arg1, arg2]
    const [funcname, ...xargs] = (typeof command === 'string') ? [command, []] : command

    // Massage args
    const regex1 = RegExp(':arg[0-9]*:')
    const args = xargs.map(arg =>
      regex1.test(arg) ? this.stack[0].args[parseInt(arg.substring(4))-1] : arg
    )
    console.log("Executing: ", funcname, [...args]);

    // Look it up in the command map (from the game_config)
    // A command is a one line definition with a name that is replaced
    // by some other command or basic function name and some arguments
    // E.g. "turnLeft" -> ["turn", 1]
    const repl = this.commandDefs && this.commandDefs[command]
    if (repl) {
      this.execCommand(repl, `${invoker}/${repl}`)
      return
    }

    // If it wasn't in the command map, look it up in the
    // map of basic functions from the GameLogic
    const func = this.functions[funcname]
    if( func ) {
      func.apply(gameState, args)
      return
    }

    // Neither command nor function, bail out with error message (to the console)
    if (!func) {
      console.error(
        `Unknown function '${funcname}' (with args: ${JSON.stringify(
          args
        )}) for '${invoker}'`
      )
      return
    }
  }

  execCommands(commands) {
    const newProg = {name: "unnamed", commands: [...commands], args: []}
    this.#pushProg( newProg, false)
  }

}

export const engine = new CommandEngine()

export const execCommand = (command, invoker) => engine.execCommand(command, invoker)


