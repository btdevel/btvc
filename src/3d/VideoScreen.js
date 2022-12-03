import React from 'react'
import * as THREE from 'three'

import {makeShapeGeometry} from './util'
import {Direction} from '../game/Movement'
import {useTrackInfo} from '../game/Video'

const w = 0.0, b = 0.0, t = 0.0
const screenGeom = makeShapeGeometry([[w, b], [w, 1 - t], [1 - w, 1 - t], [1 - w, b]])
screenGeom.scale(0.9, 0.6, 1).translate(0, 0.046, 0)

const sphereGeom = new THREE.SphereGeometry(0.4, 20, 20)
sphereGeom.translate(0, 0.2, 0)

// const screenGeom = wallGeom
const defaultScreenMat = new THREE.MeshBasicMaterial({
  color: new THREE.Color(0x555555),
  side: THREE.DoubleSide,
  transparent: true
})

function createVideoTexture(source, isSphere) {
  const videoTexture = new THREE.VideoTexture(source)
  videoTexture.minFilter = THREE.LinearFilter
  videoTexture.magFilter = THREE.LinearFilter
  videoTexture.format = THREE.RGBFormat

  if (isSphere) {
    videoTexture.wrapS = THREE.RepeatWrapping
    videoTexture.wrapT = THREE.RepeatWrapping
    videoTexture.repeat.set(6, 3)
  }
  return videoTexture
}

export default function VideoScreen({x, y, dir, trackNo, type}) {
  const dist = 0.35
  x += dist * Direction.dx[dir];
  y += dist * Direction.dy[dir];
  const rot = dir * Math.PI / 2

  const info = useTrackInfo(trackNo)
  // console.log("TrackNo: ", trackNo, x, y)
  // console.log("TrackInfo: ", info)

  let screenMat = defaultScreenMat
  let isSphere = (type === "sphere")
  let geom = isSphere ? sphereGeom : screenGeom
  let haveVideoStream = info && info[1]

  if (haveVideoStream) {
    const [trackContainer] = info
    // const [, , audioTrack] = info => <Audio track={microTrack}/>
    console.log("TrackInfo: ", info)

    const videoTexture = createVideoTexture(trackContainer, isSphere)

    screenMat = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.DoubleSide
    })
  }
  else {
    const noiseVideoContainer = document.getElementById('video')
    const videoTexture = createVideoTexture(noiseVideoContainer, isSphere)

    screenMat = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.DoubleSide
    })
  }

  return (
      <mesh position={[x, y, 0]} rotation-order='ZXY' rotation={[Math.PI / 2, 0, rot]}
                  material={screenMat} geometry={geom}/>
    )
}
