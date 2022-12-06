import React, {useEffect} from 'react'
import * as THREE from 'three'

import guild from '../assets/sound/bt1amiga_adventurers-guild.mp3'
import badhr_kilnfest from '../assets/sound/bt1amiga_badhr_kilnfest.mp3'
import falkentynes_fury from '../assets/sound/bt1amiga_falkentynes_fury.mp3'
import lucklaran from '../assets/sound/bt1amiga_lucklaran.mp3'
import seekers_ballad from '../assets/sound/bt1amiga_seekers_ballad.mp3'
import the_travellers_tune from '../assets/sound/bt1amiga_the_travellers_tune.mp3'
import waylands_watch from '../assets/sound/bt1amiga_waylands_watch.mp3'

export const songMap = {
  0: guild, guild,
  1: badhr_kilnfest, badhr_kilnfest,
  2: falkentynes_fury, falkentynes_fury,
  3: lucklaran, lucklaran,
  4: seekers_ballad, seekers_ballad,
  5: the_travellers_tune, the_travellers_tune,
  6: waylands_watch, waylands_watch,
}

let globalAudioListener = null
export function getAudioListener() {
  if( !globalAudioListener ) globalAudioListener = new THREE.AudioListener()
  globalAudioListener.up.set(0, 0, 1)
  return globalAudioListener
}

export default function Audio({
                                url,
                                song = "",
                                ambient = false,
                                loop = true,
                                volume = 0.2,
                                x = 0,
                                y = 0,
                                dist = 1,
                                rolloffFactor = 1,
                                maxDistance = 10,
                                distanceModel = "linear",
                                cone = undefined
                              }) {
  const audioListener = getAudioListener()
  if (!url) url = songMap[song]
  const audio = ambient ? new THREE.Audio(audioListener) : new THREE.PositionalAudio(audioListener);

  audio.translateX(x)
  audio.translateY(y)
  if (cone) {
    const pi2 = Math.PI / 2
    audio.setRotationFromEuler(new THREE.Euler(pi2, (2 + cone[0]) * pi2, 0), "XYZ")
  }
  audio.up = new THREE.Vector3(0, 0, 1)

  useEffect(() => {
    const loader = new THREE.AudioLoader();
    let isLoaded = false
    let isStopped = false
    loader.load(url,
      function (audioBuffer) {
        if (isStopped) return
        isLoaded = true
        audio.setBuffer(audioBuffer);

        // https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Web_audio_spatialization_basics
        // https://medium.com/@kfarr/understanding-web-audio-api-positional-audio-distance-models-for-webxr-e77998afcdff
        // https://www.desmos.com/calculator/lzxfqvwoqq?lang=de

        audio.setLoop(loop)
        audio.setVolume(volume)
        if (!ambient) {
          audio.setRolloffFactor(rolloffFactor)
          audio.setMaxDistance(maxDistance)
          audio.setDistanceModel(distanceModel)
          audio.setRefDistance(dist);
          if (cone) {
            audio.setDirectionalCone(...cone.slice(1))
          }
        }
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
  })

  return <primitive object={audio}/>
}
