import {gameState, setGameText, setLocation, setOverlayImage} from "./GameLogic"
import {dumpConfig} from './ConfigLoader'


class CommandEngine {
  program = []
  programRunning = false

  started = false
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
      setInterval(() => this.#tic(), 20)
      this.started = true
    }
  }
  pause() {
    console.log("pausing")
  }

  #tic() {
    if (this.programRunning) {
      if (this.program.length) {
        const command = this.program.shift()
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

  run(prog) {
    const program = this.programDefs[prog]
    if (!program) {
      console.warn("Unknown program: ", prog, program)
      console.log(this.programDefs)
      return
    }
    const dump = {};
    dump[prog] = program
    console.log("Program: ", dumpConfig(dump))
    this.program = [...program]
    this.programRunning = true
  }

  execCommand(command, invoker) {
    // If command of the form "string" then funcname="string" and args=[]
    // otherwise if its of the form ["foo", arg1, arg2] then funcname="foo" and args=[arg1, arg2]
    const [funcname, ...args] = (typeof command === 'string') ? [command, []] : command

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
    // console.log('func: ', func);
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



}

export const engine = new CommandEngine()

export const execCommand = (command, invoker) => engine.execCommand(command, invoker)



