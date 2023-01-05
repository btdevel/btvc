import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react'

import {Button, Entries, Entry, PopupBox} from "./DialogElements"
import {Checkbox, Form, RangeInput, TextInput} from "./FormElements"
import {
  gameState,
  setAudioConfig, setGameText,
  setGraphicsConfig,
  setVideoConfig,
  useAudioConfig,
  useGraphicsConfig,
  useVideoConfig,
} from '../game/GameLogic'
import produce from "immer"
import {urlFromObject} from '../util/urls'

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
      save(perm = false) {
        const newGraphicsConfig = produce(graphicsConfig, (config) => {
          config.stars.enabled = starsEnabled
          config.stars.count = starsCount
          config.sky.enabled = skyEnabled
          config.sky.useShader = skyUseShader
          config.shadows.enabled = shadowsEnabled
          config.shadows.shadowMapSize = shadowMapSize
        })
        console.log(`Graphics config ${newGraphicsConfig!==graphicsConfig ? "changed" : "did not change"} `)
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

const AudioForm = forwardRef(function AudioForm(props, ref) {
  const audioConfig = useAudioConfig()
  const [audioEnabled, setAudioEnabled] = useState(audioConfig.enabled)
  const [audioVolume, setAudioVolume] = useState(audioConfig.volume)

  useImperativeHandle(ref, () => {
    return {
      save(perm = false) {
        const newAudioConfig = produce(audioConfig, (config) => {
          config.enabled = audioEnabled
          config.volume = audioVolume
        })
        console.log(`Audio config ${newAudioConfig!==audioConfig ? "changed" : "did not change"} `)
        console.log(`Saving audio config ${perm ? "permanently" : "for session"}: `, newAudioConfig)
        setAudioConfig(newAudioConfig, perm)
      },
      reset() {
        setAudioEnabled(audioConfig.enabled)
        setAudioVolume(audioConfig.volume)
      }
    }
  }, [audioEnabled, audioVolume, audioConfig])

  return (<Form>
    <Checkbox label="Enable Audio" value={audioEnabled} onChange={setAudioEnabled}/>
    <RangeInput label="Master volume" placeholder="Enter master volume" value={audioVolume} min={0} max={10}
                step={0.1} onChange={setAudioVolume} disabled={!audioEnabled}/>
  </Form>)
})

const VideoForm = forwardRef(function VideoForm(props, ref) {
  const videoConfig = useVideoConfig()
  const [videoEnabled, setVideoEnabled] = useState(videoConfig.enabled)
  const [appId, setAppId] = useState(videoConfig.appId)
  const [channel, setChannel] = useState(videoConfig.channel)
  const [token, setToken] = useState(videoConfig.token)

  const createConfig = useCallback(() => produce(videoConfig, (config) => {
    config.enabled = videoEnabled
    config.appId = appId
    config.channel = channel
    config.token = token
  }), [videoEnabled, appId, channel, token, videoConfig])
  const chatURL = useMemo(() => {
    return urlFromObject({'video': createConfig()})
  }, [createConfig])
  const emailLink = useMemo(() => {
    const subject = "Chat invitation"
    const body = `Hi!
    
    You're invited to join a video chat in the Bard's Tale Video Chat Client using the
    following link:
    
    ${chatURL}
    
    After opening the link (or pasting it into your browsers address line), you can go to 
    the Settings dialog and save the new video chat settings permanently, or always use
    this link for joining with this connection information.
    
    Have fun.\n  
    `
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }, [chatURL])
  const alertText = useMemo(() => {
    return `Please copy the following URL and send to your friends:\n\n${chatURL}`
  }, [chatURL])

  useImperativeHandle(ref, () => {
    return {
      save(perm = false) {
        const newVideoConfig = produce(videoConfig, (config) => {
          config.enabled = videoEnabled
          config.appId = appId
          config.channel = channel
          config.token = token
        })
        console.log(`Video config ${newVideoConfig!==videoConfig ? "changed" : "did not change"} `)
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
    <Button onClick={() => alert(alertText)}>Create link</Button>
    <Button href={emailLink}>Email invite</Button>
    <Button href="https://console.agora.io/projects" target="_blank">Get new token</Button>
  </Form>)
})

function callOnRefs(refs, func) {
  for (let ref of refs) {
    func(ref.current)
  }
}

const SettingsDialog = forwardRef(function SettingsDialog({close, defaultKey = 1, ...props}, ref) {
  const graphicsFormRef = useRef()
  const audioFormRef = useRef()
  const videoFormRef = useRef()

  const allRefs = [graphicsFormRef, audioFormRef, videoFormRef]
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
        <Entry number={2} header="Audio">
          <AudioForm ref={audioFormRef}/>
        </Entry>
        <Entry number={3} header="Video">
          <VideoForm ref={videoFormRef}/>
        </Entry>
        {/*<Entry number={4} header="Game">Difficulty etc.</Entry>*/}
      </Entries>
      <Button variant="secondary" onClick={() => {
        setGameText("Settings saved for this setting only.")
        saveForms(false);
        close()
      }}>OK</Button>
      <Button variant="secondary" onClick={() => {
        setGameText("Settings saved permanently to localStorage.")
        saveForms(true);
        close()
      }}>Save</Button>
      <Button variant="secondary" onClick={() => {
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
    gameState.enableKeyMap = !show
  }, [show])

  return (<>
      <Button onClick={open} variant="info" id='settings-button'>Settings</Button>
      <PopupBox header="BTVCC Settings" show={show} close={() => {
        ref.current?.save(false);
        close()
      }}>
        <SettingsDialog ref={ref} close={close}/>
      </PopupBox>
    </>
  )
}
