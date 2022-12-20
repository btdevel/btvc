import React, {useEffect, useMemo} from 'react'
import * as THREE from 'three'

import {getAudioListener} from "./AudioListener"
import {songMap} from "../game/Songs"

// Some hints on choosing the values for Audio
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Web_audio_spatialization_basics
// https://medium.com/@kfarr/understanding-web-audio-api-positional-audio-distance-models-for-webxr-e77998afcdff
// https://www.desmos.com/calculator/lzxfqvwoqq?lang=de

export default function Audio({
                                url,
                                song = "",
                                ambient = false,
                                loop = true,
                                x = 0,
                                y = 0,
                                volume = 0.5,
                                distanceModel = "exponential",
                                refDistance = 0.5,
                                rolloffFactor = 4,
                                maxDistance = 5,
                                cone = undefined
                              }) {
  // Note: much of the AudioListener stuff is controlled in Camera.js because
  // that's where the listener sits (ears right next to your eyes...)

  if (song && url) {
    console.warn("Should not pass `url` and `song` to Audio.")
  }
  if (!url) {
    url = songMap[song]
    if (!url) {
      console.warn(`Could not find song "${song}".`)
    }
  }

  const audioListener = getAudioListener()
  const audio = useMemo(() => {
    const audio = ambient ? new THREE.Audio(audioListener) : new THREE.PositionalAudio(audioListener)
    audio.translateX(x)
    audio.translateY(y)
    if (cone) {
      const pi2 = Math.PI / 2
      audio.setRotationFromEuler(new THREE.Euler(pi2, (2 + cone[0]) * pi2, 0), "XYZ")
    }
    audio.up = new THREE.Vector3(0, 0, 1)
    return audio
  }, [ambient, x, y, cone, audioListener])


  useEffect(() => {
    const loader = new THREE.AudioLoader();
    let isLoaded = false
    let isStopped = false
    loader.load(url,
      function (audioBuffer) {
        if (isStopped) return
        isLoaded = true
        audio.setBuffer(audioBuffer);
        audio.setLoop(loop)
        audio.setVolume(volume)
        if (!ambient) {
          audio.setDistanceModel(distanceModel)
          audio.setRefDistance(refDistance)
          audio.setRolloffFactor(rolloffFactor)
          audio.setMaxDistance(maxDistance)
          if (cone) {
            audio.setDirectionalCone(...cone.slice(1))
          }
        }
        console.log("Starting audio: ", url)
        audio.play();
      },
      function (xhr) {
        // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      function (err) {
        console.warn('Error loading audio: ' + url);
      }
    );
    return () => {
      if (isLoaded) {
        audio.stop()
      } else {
        isStopped = true
      }
    }
  }, [ambient, audio, cone, distanceModel, loop, maxDistance, refDistance, rolloffFactor, url, volume])

  return <primitive object={audio}/>
}
