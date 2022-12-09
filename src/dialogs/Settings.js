import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';

import {Button, Entries, Entry, PopupBox} from "./DialogElements";
import {Checkbox, Form, RangeInput, TextInput} from "./FormElements";
import {gameState, setGraphicsConfig, setVideoConfig, useGraphicsConfig, useVideoConfig} from '../game/GameLogic'

const GraphicsForm = forwardRef(function GraphicsForm(props, ref) {
  const graphicsConfig = useGraphicsConfig()
  const [starsEnabled, setStarsEnabled] = useState(graphicsConfig.stars.enabled)
  const [starsCount, setStarsCount] = useState(graphicsConfig.stars.count)
  const [skyEnabled, setSkyEnabled] = useState(graphicsConfig.sky.enabled)
  const [skyUseShader, setSkyUseShader] = useState(graphicsConfig.sky.useShader)
  const [shadowsEnabled, setShadowsEnabled] = useState(graphicsConfig.shadows.enabled)
  const [shadowMapSize, setShadowMapSize] = useState(graphicsConfig.shadows.shadowMapSize)

  useImperativeHandle(ref, () => {
    return {
      newConfig() {
        return {
          stars: {enabled: starsEnabled, count: starsCount},
          sky: {enabled: skyEnabled, useShader: skyUseShader},
          shadows: {enabled: shadowsEnabled, shadowMapSize: shadowMapSize}
        }
      },
      save(perm = false) {
        const newGraphicsConfig = this.newConfig()
        console.log(`Saving graphics config ${perm ? "permanently" : "for session"}: `, newGraphicsConfig)
        setGraphicsConfig(newGraphicsConfig, perm)
      },
      reset() {
        setStarsEnabled(graphicsConfig.stars.enabled)
        setStarsCount(graphicsConfig.stars.count)
        setSkyEnabled(graphicsConfig.sky.enabled)
        setSkyUseShader(graphicsConfig.sky.useShader)
        setShadowsEnabled(graphicsConfig.shadows.enabled)
        setShadowMapSize(graphicsConfig.shadows.shadowMapSize)
      }
    }
  }, [starsEnabled, starsCount, skyEnabled, skyUseShader, shadowsEnabled, shadowMapSize, graphicsConfig])

  return (<Form>
    <Checkbox label="Enable Stars" value={starsEnabled} onChange={setStarsEnabled}/>
    <RangeInput label="Number of stars" placeholder="Enter number of stars" value={starsCount} min={0} max={3000}
                onChange={setStarsCount} disabled={!starsEnabled}/>
    <Checkbox label="Enable Sky" value={skyEnabled} onChange={setSkyEnabled}/>
    <Checkbox label="Use Sky Shader" disabled={!skyEnabled} value={skyUseShader} onChange={setSkyUseShader}/>
    <Checkbox label="Enable Shadows" value={shadowsEnabled} onChange={setShadowsEnabled}/>
    <RangeInput label="Shadow Map Size" value={shadowMapSize} min={128} max={4096} step={128}
                onChange={setShadowMapSize} disabled={!shadowsEnabled}/>
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
      newConfig() {
        return {enabled: videoEnabled, appId: appId, channel: channel, token: token}
      },
      save(perm = false) {
        const newVideoConfig = this.newConfig()
        console.log(`Saving video config ${perm ? "permanently" : "for session"}: `, newVideoConfig)
        setVideoConfig(newVideoConfig, perm)
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

function callOnRefs(refs, func) {
  for (let ref of refs) {
    func(ref.current)
  }
}

const SettingsDialog = forwardRef(function SettingsDialog({close, defaultKey = 1, ...props}, ref) {
  const graphicsFormRef = useRef()
  const videoFormRef = useRef()

  const allRefs = [graphicsFormRef, videoFormRef]
  const saveForms = (perm) => callOnRefs(allRefs, ref => ref.save(perm))
  const resetForms = () => callOnRefs(allRefs, ref => ref.reset())
  useImperativeHandle(ref, () => ({
    save: saveForms, reset: resetForms
  }))

  return (<>
      <Entries alwaysOpen={false} defaultActiveKey={defaultKey}>
        <Entry number={1} header="Graphics">
          <GraphicsForm ref={graphicsFormRef}/>
        </Entry>
        <Entry number={2} header="Video">
          <VideoForm ref={videoFormRef}/>
        </Entry>
        {/*<Entry number={3} header="Sound">On off, overall music, ...</Entry>*/}
        {/*<Entry number={4} header="Game">Difficulty etc.</Entry>*/}
      </Entries>
      <Button onClick={() => {
        saveForms(false);
        close()
      }}>OK</Button>
      <Button onClick={() => {
        saveForms(true);
        close()
      }}>Save</Button>
      <Button onClick={() => {
        resetForms();
        close()
      }}>Cancel</Button>
    </>
  )
})


export default function Settings({initialShow = false}) {
  console.log("Showing settings...")
  const [show, setShow] = useState(initialShow);
  const ref = useRef()
  const close = () => setShow(false)
  const open = () => setShow(true)

  useEffect(() => {
    gameState.canGrabKeyboard = !show
  }, [show])

  return (<>
      <Button onClick={open} id='settings-button'>Settings</Button>
      <PopupBox header="BTVCC Settings" show={show} close={() => {
        ref.current?.save(false);
        close()
      }}>
        <SettingsDialog ref={ref} close={close}/>
      </PopupBox>
    </>
  )
}
