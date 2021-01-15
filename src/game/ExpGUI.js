import DAT from "dat.gui"
import { useStoreInternal_, modifyStatInternal_ } from "./GameLogic"

// TODO: to reenable change the way to access the store

function bindToStore(gui, name) {
    const gameState = useStoreInternal_.getState()

    const options = {}
    console.log("GameState :", gameState)
    options[name] = gameState[name]


    const controller = gui.add(options, name)
    controller.onChange(
        (newValue) => {
            modifyStatInternal_(
                draft => { draft[name] = newValue }
            )
            return
        }
    )
    useStoreInternal_.subscribe((value) => {
        controller.setValue(value)
    }, state => state["value"])

}

export function startGUI(gameState) {
    const gui = new DAT.GUI()
    bindToStore(gui, 'fullscreen')
    bindToStore(gui, 'orbitcontrols')
}
