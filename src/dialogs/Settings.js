import React, {useEffect, useId, useState} from 'react';
import {Button, Entries, Entry, PopupBox} from "./DialogElements";
import Form from 'react-bootstrap/Form'
import styled from 'styled-components';

import {gameState, setVideoConfig, useVideoConfig} from '../game/GameLogic'

Form.Control = styled(Form.Control)`
  border: 2px solid var(--amiga-wb-color-black);
  border-radius: 0px;
  &:focus{
    border: 2px solid var(--amiga-wb-color-black);
    box-shadow: none;
  }
`
Form.Text = styled(Form.Text)`
  margin-left: 1rem;
`
Form.Check = styled(Form.Check)`
  input {
    border: 2px solid var(--amiga-wb-color-black);
    border-radius: 0px;
    &:focus {
      border: 2px solid var(--amiga-wb-color-black);
      box-shadow: none;
    }
    &:checked: {
      color: var(--amiga-wb-color-black);
      background-color: var(--amiga-wb-color-white);
      border-color: var(--amiga-wb-color-black);
    }
  }
`

function Group({children}) {
  const id = useId()
  return (
    <Form.Group className="mb-3" controlId={id}>
      {children}
    </Form.Group>
  )
}

function Checkbox({label, value, onChange}) {
  return (
    <Group>
      <Form.Check type="checkbox" label={label} checked={value} onChange={ev => onChange(ev.target.checked)}/>
    </Group>
  )
}

function TextInput({label, placeholder, value, onChange, comment}) {
  return (
    <Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control type="text" placeholder={placeholder} value={value} onChange={ev => onChange(ev.target.value)}/>
      {comment && <Form.Text className="text-muted">{comment}</Form.Text>}
    </Group>
  )

}


function SettingsDialog({save}) {
  // todo: read from yaml
  const videoConfig = useVideoConfig()
  const [videoEnabled, setVideoEnabled] = useState(videoConfig.enabled)
  const [appId, setAppId] = useState(videoConfig.appId)
  const [channel, setChannel] = useState(videoConfig.channel)
  const [token, setToken] = useState(videoConfig.token)
  let wrap = func => (event => func(event.target.value))

  useEffect(() => {
    if (save) {
      const newVideoConfig = {enabled: videoEnabled, appId: appId, channel: channel, token: token}
      console.log("Saving video config: ", newVideoConfig)
      setVideoConfig(newVideoConfig)
      // gameState.saveConfig()
    }
  }, [save])

  return (
    <>
      <Entries alwaysOpen={false} defaultActiveKey={2}>
        <Entry number={1} header="Game">
          Game config
        </Entry>
        <Entry number={2} header="Video">
          <Form>
            <Checkbox label="Enable Video Chat" value={videoEnabled} onChange={setVideoEnabled}/>
            <TextInput label="Video AppId" placeholder="Enter AppId" value={appId} onChange={setAppId}/>
            <TextInput label="Video Channel" placeholder="Enter channel name" value={channel} onChange={setChannel}/>
            <TextInput label="Video Token" placeholder="Enter Token" value={token} onChange={wrap(setToken)}/>
          </Form>
        </Entry>
        <Entry number={3} header="Sound">
          On off, overall music, ...
        </Entry>
      </Entries>
    </>
  )
}


export default function Settings({initialShow = false}) {
  const [show, setShow] = useState(initialShow);
  const close = () => setShow(false);
  const open = () => setShow(true);

  useEffect(() => {
    gameState.canGrabKeyboard = !show
  }, [show])

  return (
    <>
      <Button onClick={open} id='settings-button'>Settings</Button>
      <PopupBox header="BTVCC Settings" show={show} close={close}>
        <SettingsDialog save={!show}/>
      </PopupBox>
    </>
  )
}
