import React from 'react'
import * as THREE from 'three'
import { makeShapeGeometry } from './util'
import { Direction } from '../game/Movement'

import { useTracks } from '../game/Video'

const w = 0.0, b = 0.0, t = 0.0
const screenGeom = makeShapeGeometry([[w, b], [w, 1 - t], [1 - w, 1 - t], [1 - w, b]])
screenGeom.scale(0.9, 0.6, 1).translate(0, 0.1, 0)

const sphereGeom = new THREE.SphereBufferGeometry(0.4, 20, 20)
sphereGeom.translate(0, 0.2, 0)

// const screenGeom = wallGeom
const defaultScreenMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x555555), side: THREE.DoubleSide, transparent: true })

export default function VideoScreen({ x, y, dir, trackNo, type }) {
    const dist = 0.499
    x += dist * Direction.dx[dir];
    y += dist * Direction.dy[dir];
    const rot = dir * Math.PI / 2

    const tracks = useTracks()
    console.log(tracks)

    let screenMat = defaultScreenMat
    let isSphere = (type === "sphere")
    let geom = isSphere ? sphereGeom : screenGeom

    const info = tracks[trackNo]
    if (info) {
        const [trackContainer, videoTrack, microTrack] = info
        console.log("TrackInfo: ", info)

        const videoTexture = new THREE.VideoTexture(trackContainer)
        videoTexture.minFilter = THREE.LinearFilter
        videoTexture.magFilter = THREE.LinearFilter
        videoTexture.format = THREE.RGBFormat

        if (isSphere) {
            videoTexture.wrapS = THREE.RepeatWrapping
            videoTexture.wrapT = THREE.RepeatWrapping
            videoTexture.repeat.set(6, 3)
        }

        screenMat = new THREE.MeshBasicMaterial({
            map: videoTexture,
            side: THREE.DoubleSide
        })

    }


    return (<mesh position={[x, y, 0]} rotation-order='ZXY' rotation={[Math.PI / 2, 0, rot]}
        material={screenMat} geometry={geom} />)

}
