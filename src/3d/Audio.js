import React, { useEffect } from 'react'
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

export const audioListener = new THREE.AudioListener();

export default function Audio({ url, song = "", ambient = false, loop = true, volume = 0.2, x = 0, y = 0, dist = 1 }) {
    if (!url) url = songMap[song]
    const audio = ambient ? new THREE.Audio(audioListener) : new THREE.PositionalAudio(audioListener);

    audio.translateX(x)
    audio.translateY(y)
    useEffect(() => {
        const loader = new THREE.AudioLoader();
        loader.load(url,
            function (audioBuffer) {
                audio.setBuffer(audioBuffer);
                audio.setLoop(loop)
                audio.setVolume(volume)
                if (!ambient) {
                    audio.setRefDistance(dist);
                }
                audio.play();
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (err) {
                console.log('An error happened');
            }
        );
        return () => {
            audio.stop()
        }
    })

    return <primitive object={audio} />
}