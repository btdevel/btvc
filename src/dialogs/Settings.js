import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';

import {Button, Entries, Entry, PopupBox} from "./DialogElements";
import {Checkbox, Form, RangeInput, TextInput} from "./FormElements";
import {gameState, setVideoConfig, useVideoConfig, useGraphicsConfig, setGraphicsConfig} from '../game/GameLogic'

const GraphicsForm = forwardRef(function GraphicsForm(props, ref) {
  const graphicsConfig = useGraphicsConfig()
  const [starsEnabled, setStarsEnabled] = useState(graphicsConfig.stars.enabled)
  const [starsCount, setStarsCount] = useState(graphicsConfig.stars.count)

  useImperativeHandle(ref, () => {
    return {
      saveTemp() {
        const newGraphicsConfig = {stars: { enabled: starsEnabled, count: starsCount}}
        console.log("Saving graphics config: ", newGraphicsConfig)
        setGraphicsConfig(newGraphicsConfig)
      },
      savePerm() {
        console.log("Saving graphics config permanently (just kidding)")
      },
      reset() {
        setStarsEnabled(graphicsConfig.stars.enabled)
        setStarsCount(graphicsConfig.stars.count)
      }
    }
  }, [starsEnabled, starsCount, graphicsConfig])

  return (<Form>
    <Checkbox label="Enable Stars" value={starsEnabled} onChange={setStarsEnabled}/>
    <RangeInput label="Number of stars" placeholder="Enter number of stars" value={starsCount} min={0} max={3000} onChange={setStarsCount}
    disabled={!starsEnabled}/>
  </Form>)
})

const VideoForm = forwardRef(function VideoForm(props, ref) {
  const videoConfig = useVideoConfig()
  const [videoEnabled, setVideoEnabled] = useState(videoConfig.enabled)
  const [appId, setAppId] = useState(videoConfig.appId)
  const [channel, setChannel] = useState(videoConfig.channel)
  const [token, setToken] = useState(videoConfig.token)

  useImperativeHandle(ref, () => {
    return {
      saveTemp() {
        const newVideoConfig = {enabled: videoEnabled, appId: appId, channel: channel, token: token}
        console.log("Saving video config: ", newVideoConfig)
        setVideoConfig(newVideoConfig)
      },
      savePerm() {
        console.log("Saving video config permanently (just kidding)")
        // gameState.saveConfig()
      },
      reset() {
        setVideoEnabled(videoConfig.enabled)
        setAppId(videoConfig.appId)
        setChannel(videoConfig.channel)
        setToken(videoConfig.token)
      }
    }
  }, [appId, channel, token, videoEnabled, videoConfig])

  return (<Form>
      <Checkbox label="Enable Video Chat" value={videoEnabled} onChange={setVideoEnabled}/>
      <TextInput label="Video AppId" placeholder="Enter AppId" value={appId} onChange={setAppId}/>
      <TextInput label="Video Channel" placeholder="Enter channel name" value={channel} onChange={setChannel}/>
      <TextInput label="Video Token" placeholder="Enter Token" value={token} onChange={setToken}/>
    </Form>)
})

const SettingsDialog = forwardRef(function SettingsDialog(props, ref) {
  const graphicsFormRef = useRef()
  const videoFormRef = useRef()

  const allRefs = [graphicsFormRef, videoFormRef]
  const callOnRefs = (refs, func) => (() => {for(let ref of refs) {func(ref.current)}})
  const resetForms = callOnRefs(allRefs, ref => ref.reset())
  const saveFormsPerm = callOnRefs(allRefs, ref => ref.savePerm())
  const saveFormsTemp = callOnRefs(allRefs, ref => ref.saveTemp())
  useImperativeHandle(ref, () => ({
      saveTemp: saveFormsTemp,
      savePerm: saveFormsPerm,
      reset: resetForms
    }), [resetForms, saveFormsPerm, saveFormsTemp])

  return (
    <>
      <Entries alwaysOpen={false} defaultActiveKey={2}>
        <Entry number={1} header="Graphics">
          <GraphicsForm ref={graphicsFormRef}/>
        </Entry>
        <Entry number={2} header="Video">
          <VideoForm ref={videoFormRef}/>
        </Entry>
        <Entry number={3} header="Sound">
          On off, overall music, ...
        </Entry>
      </Entries>
      <Button onClick={resetForms}>Reset</Button>
      <Button onClick={saveFormsPerm}>Save permanent</Button>
      <Button onClick={saveFormsTemp}>Save for session</Button>
    </>
  )
})


export default function Settings({initialShow = false}) {
  console.log("Showing settings...")
  const [show, setShow] = useState(initialShow);
  const ref = useRef()
  const close = () => {
    ref.current.saveTemp()
    setShow(false)
  }
  
  const open = () => setShow(true)

  useEffect(() => {
    gameState.canGrabKeyboard = !show
  }, [show])

  return (
    <>
      <Button onClick={open} id='settings-button'>Settings</Button>
      <PopupBox header="BTVCC Settings" show={show} close={close}>
        <SettingsDialog ref={ref}/>
      </PopupBox>
    </>
  )
}
