import React, {useEffect, useState} from 'react';
import {PopupBox, Button, Entries, Entry} from "./DialogElements";
import Form from 'react-bootstrap/Form'
import styled from 'styled-components';

import {gameState} from '../game/GameLogic'

Form.Control=styled(Form.Control)`
  border: 2px solid var(--amiga-wb-color-black);
  border-radius: 0px;
`
Form.Text=styled(Form.Text)`
  margin-left: 1rem;
`
Form.Check=styled(Form.Check)`
  input {
    border: 2px solid var(--amiga-wb-color-black);
    border-radius: 0px;
  }
`

function SettingsDialog({save}) {
  // todo: read from yaml
  let [videoEnabled, setVideoEnabled] = useState(gameState.config.video.enabled)
  let [appId, setAppId] = useState(gameState.config.video.appId)
  let [channel, setChannel] = useState(gameState.config.video.channel)
  let [token, setToken] = useState(gameState.config.video.token)
  let wrap = func => (event=>func(event.target.value))
  let wrapc = func => (event=>func(event.target.checked))

  useEffect(() => {
    if( save ) {
      gameState.config.video.enabled = videoEnabled
      gameState.config.video.appId = appId
      gameState.config.video.channel = channel
      gameState.config.video.token = token
      // gameState.saveConfig()
    }
  })

  return (
    <>
      <Entries alwaysOpen={false} defaultActiveKey={2}>
        <Entry number={1} header="Game">
          Game config
        </Entry>
        <Entry number={2} header="Video">
          <Form>
            <Form.Group className="mb-3" controlId="formEnableVideo">
              <Form.Check type="checkbox" label="Enable Video Chat" checked={videoEnabled} onChange={wrapc(setVideoEnabled)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formVideoAppId">
              <Form.Label>Video AppId</Form.Label>
              <Form.Control type="text" placeholder="Enter AppId" value={appId} onChange={wrap(setAppId)}/>
              {/*<Form.Text className="text-muted">Attain from agora.io.</Form.Text>*/}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formVideoAppId">
              <Form.Label>Video Channel</Form.Label>
              <Form.Control type="text" placeholder="Enter channel name" value={channel} onChange={wrap(setChannel)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formVideoAppId">
              <Form.Label>Video Token</Form.Label>
              <Form.Control type="text" placeholder="Enter Token" value={token} onChange={wrap(setToken)}/>
            </Form.Group>
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
