import React from 'react'
import * as THREE from 'three'
import { makeShapeGeometry } from './util'
import { Direction } from '../game/Movement'

import { useTracks } from '../game/GameLogic'

// const w = 0.05, b = 0.5, t = 0.1
// const w = 0.15, b = 0.5, t = 0.1
const w = 0.0, b = 0.0, t = 0.0
const screenGeom = makeShapeGeometry([[w, b], [w, 1 - t], [1 - w, 1 - t], [1 - w, b]])
screenGeom.scale(0.9, 0.6, 1).translate(0, 0.1, 0)
// const screenGeom = wallGeom
const defaultScreenMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("red"), side: THREE.DoubleSide })

export default function VideoScreen({ x, y, dir, trackNo }) {
    const dist = 0.499
    x += dist * Direction.dx[dir];
    y += dist * Direction.dy[dir];
    const rot = dir * Math.PI / 2

    const tracks = useTracks()
    console.log(tracks)

    let screenMat = defaultScreenMat

    const info = tracks[trackNo]
    if (info) {
        const [trackContainer, videoTrack, microTrack] = info
        console.log("TrackInfo: ", info)

        const videoTexture = new THREE.VideoTexture(trackContainer)
        videoTexture.minFilter = THREE.LinearFilter
        videoTexture.magFilter = THREE.LinearFilter
        videoTexture.format = THREE.RGBFormat

        screenMat = new THREE.MeshBasicMaterial({
          map: videoTexture,
          side: THREE.DoubleSide
        })

    }


    return (<mesh position={[x, y, 0]} rotation-order='ZXY' rotation={[Math.PI / 2, 0, rot]}
        material={screenMat} geometry={screenGeom} />)

}
