import React, {useEffect, useState} from 'react';
import {PopupBox, Button, Entries, Entry} from "./DialogElements";
import Form from 'react-bootstrap/Form'
import styled from 'styled-components';

import {gameState, useVideoConfig, setVideoConfig} from '../game/GameLogic'

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
  const videoConfig = useVideoConfig()
  const [videoEnabled, setVideoEnabled] = useState(videoConfig.enabled)
  const [appId, setAppId] = useState(videoConfig.appId)
  const [channel, setChannel] = useState(videoConfig.channel)
  const [token, setToken] = useState(videoConfig.token)
  let wrap = func => (event=>func(event.target.value))
  let wrapc = func => (event=>func(event.target.checked))

  useEffect(() => {
    if( save ) {
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
