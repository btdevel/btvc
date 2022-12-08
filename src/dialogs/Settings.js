import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';

import {Button, Entries, Entry, PopupBox} from "./DialogElements";

import {gameState, setVideoConfig, useVideoConfig} from '../game/GameLogic'
import {Checkbox, Form, RangeInput, TextInput} from "./FormElements";

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
  console.log("Showing settings...")
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
