import DAT from "dat.gui"
import { useStore, modifyState } from "./GameLogic"

// https://codepen.io/waibei/pen/wvBabmq

function bindToStore(gui, name) {
    const gameState = useStore.getState()

    const options = {}
    console.log("GameState :", gameState)
    options[name] = gameState[name]


    const controller = gui.add(options, name)
    controller.onChange(
        (newValue) => {
            modifyState(
                draft => { draft[name] = newValue }
            )
            return
        }
    )
    useStore.subscribe((value) => {
        controller.setValue(value)
    }, state => state["value"])

}

export function startGUI(gameState) {
    const gui = new DAT.GUI()
    // bindToStore(gui, 'fullscreen')
    bindToStore(gui, 'orbitcontrols')
}
