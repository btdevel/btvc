import React, {useRef, useState} from 'react'
import {Button, PopupBox} from "./DialogElements"
import {gameState} from '../game/GameLogic'
import Form from 'react-bootstrap/Form'


function Action({title, func}) {
  return (<Button variant="secondary" onClick={() => {func()}}>{title}</Button>)
}

function FileAction({title, func}) {
  const inputRef = useRef()
  return (
    <>
      <Form.Control type="file" className={"d-none"} ref={inputRef} onChange={
        (ev) => {
          func(URL.createObjectURL(ev.target.files[0]))
        }
      }/>
      <Button variant="secondary" onClick={() => {
        inputRef.current?.click()
      }}>{title}</Button>
    </>
  )
}


function ActionsDialog({close}) {
  const closeAfter = (func) => {
    return (...args) => {
      close()
      func(...args)
    }
  }
  return (
    <>
      <Action title="Fullscreen" func={closeAfter(() => gameState.toggleFullscreen())}/>
      <Action title="Map" func={closeAfter(() => gameState.showMap())}/>
      <Action title="Location" func={closeAfter(() => gameState.showInfo())}/>
      <Action title="Pause" func={closeAfter(() => gameState.togglePause())}/>
      <FileAction title="Import Party from Zipfile" func={closeAfter((url) => gameState.loadParty(url, true))}/>
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
