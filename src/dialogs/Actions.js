import React, {useState} from 'react'
import {Button, PopupBox} from "./DialogElements"
import {gameState} from '../game/GameLogic'


function Action({title, func}) {
  return (<Button variant="secondary" onClick={() => {func()}}>{title}</Button>)

}

function ActionsDialog({close}) {
  const closeAfter = (func) => {
    return () => {
      close()
      func()
    }
  }
  return (
    <>
      <Action title="Fullscreen" func={closeAfter(() => gameState.toggleFullscreen())}/>
      <Action title="Map" func={closeAfter(() => gameState.showMap())}/>
      <Action title="Location" func={closeAfter(() => gameState.showInfo())}/>
      <Action title="Pause" func={closeAfter(() => gameState.togglePause())}/>
    </>
  )
}


export default function Actions({initialShow = true}) {
  const [show, setShow] = useState(initialShow)
  const close = () => setShow(false)
  const open = () => setShow(true)

  return (
    <>
      <Button onClick={open} variant="info" id="action-button">Actions</Button>
      <PopupBox header="Actions" show={show} close={close}>
        <ActionsDialog close={close}/>
      </PopupBox>
    </>
  )
}
