import React, {useState} from 'react'
import {Button, PopupBox} from "./DialogElements"
import {gameState} from '../game/GameLogic'
import Form from 'react-bootstrap/Form'


function Action({title, func}) {
  return (<Button variant="secondary" onClick={() => {func()}}>{title}</Button>)
}

function ImportAction({title, func, label, placeholder, value, ...props}) {
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control type="file" placeholder={placeholder} value={value} {...props} onChange={
        (ev) => {
          const file = ev.target.files[0]
          const fileUrl = URL.createObjectURL(file)
          func(fileUrl)
        }
      }/>
    </Form.Group>
  )

  // return (<Button variant="secondary" type="file" onClick={() => {func()}}>{title}</Button>)
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
      <ImportAction title="Import Party" func={closeAfter((url) => gameState.loadParty(url, true))}/>
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
