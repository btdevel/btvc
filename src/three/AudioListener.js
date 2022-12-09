import React, {useEffect} from "react"
import * as THREE from "three"
import {invokeOnGesture} from "../util/event"
import {useAudioConfig} from "../game/GameLogic";

export function getAudioListener() {
  let audioListener = getAudioListener.audioListener
  if (!audioListener) {
    audioListener = new THREE.AudioListener()
    audioListener.up.set(0, 0, 1) // bug in AudioListener, up is not rotated according to camera coord system
    getAudioListener.audioListener = audioListener
  }
  return audioListener
}

function resumeListener() {
  const audioListener = getAudioListener()
  const context = audioListener.context
  if (context.state === 'suspended') {
    console.log("Resuming audio context...")
    context.resume()
  }
}

export default function AudioListener() {
  const audioListener = getAudioListener()
  const audioVolume = useAudioConfig((audioConfig) => audioConfig.volume)

  useEffect(() => {
    getAudioListener().setMasterVolume(audioVolume)
  }, [audioVolume])

  useEffect(() => {
    // We do this here (not in Audio, since here is where we have/need our listener
    // Note, that only mouse and touch events seem to indicate to the typical browsers
    // that the user has interacted with the page, but no keyboard events (sigh)
    return invokeOnGesture(resumeListener)
  }, [])
  return (<primitive object={audioListener}/>)
}