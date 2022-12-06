import DAT from "dat.gui"
// import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui'

import {modifyStatInternal_, useStoreInternal_} from "./GameLogic"

// TODO: to reenable change the way to access the store

function bindToStore(gui, name) {
  const gameState = useStoreInternal_.getState()

  const options = {}
  // console.log("GameState :", gameState)
  options[name] = gameState[name]


  const controller = gui.add(options, name)
  controller.onChange(
    (newValue) => {
      modifyStatInternal_(
        draft => {
          draft[name] = newValue
        }
      )

    }
  )
  useStoreInternal_.subscribe((value) => {
    controller.setValue(value)
  }, state => state["value"])

}

export function startGUI(gameState) {
  if (false) {
    const gui = new DAT.GUI()
    gui.closed = true
    bindToStore(gui, 'fullscreen')
    bindToStore(gui, 'orbitcontrols')
  }
}

// export default function ExpGUI() {
//     return (
//         <DatGui>
//         </DatGui>
//     )
// }