import React, {useRef} from 'react'
import * as THREE from 'three'
import {useFrame} from '@react-three/fiber'

import {gameState} from '../game/GameLogic'
import {radians} from "../util/math";

const makeVector3 = ([x, y, z]) => new THREE.Vector3(x, y, z)

const maxShadowUpdateDelay = 2
const minShadowUpdateDelay = 0.2
const minShadowUpdateSunDist = 0.05

function computeLightParams(targetPos) {
  const theta = gameState.sun.elevation()
  const sunPos = makeVector3(gameState.sun.position())

  // todo: rethink those formulas...
  const sin = Math.sin(theta)
  const intensity1 = Math.min(0.9, Math.max(2 * sin, 0.1))
  const intensity2 = Math.min(0.9, Math.max(2 * (sin - 0.0001), 0.0))

  const ambientIntensity = 0.5 * intensity1

  const n = 20
  const sunIntensity = 0.7 * intensity2

  const newSunPos = sunPos.multiplyScalar(n).add(targetPos)
  return {ambientIntensity, sunIntensity, newSunPos}
}

export default function Lights({shadows, shadowMapSize}) {

  const ambientRef = useRef()
  const sunRef = useRef()
  const targetPos = makeVector3([15, 15, 0.0]);
  const targetRef = useRef()
  const clock = useRef(new THREE.Clock(true)).current


  useFrame(() => {
    const {ambientIntensity, sunIntensity, newSunPos} = computeLightParams(targetPos)

    if (ambientRef.current) {
      ambientRef.current.intensity = ambientIntensity
    }
    if (sunRef.current) {
      sunRef.current.intensity = sunIntensity

      const sunDist = newSunPos.distanceTo(sunRef.current.position)
      const elapsed = clock.getElapsedTime()
      if (elapsed > minShadowUpdateDelay && (sunDist > minShadowUpdateSunDist || clock.getElapsedTime() > maxShadowUpdateDelay)) {
        sunRef.current.position.copy(newSunPos)
        // console.log(clock.getElapsedTime(), newSunPos);
        clock.start()
      }
    }
  })

  const {ambientIntensity, sunIntensity, newSunPos} = computeLightParams(targetPos)
  const color = 0xffffff
  const shadowCamWidth = 20
  // const shadowMapSize = 8 * 512
  const debug = false
  return (
    <>
      <ambientLight args={[color, ambientIntensity]} ref={ambientRef}/>

      <object3D position={targetPos} ref={targetRef}>
        {debug && <axesHelper/>}
      </object3D>

      <directionalLight
        angle={radians(10)}
        intensity={sunIntensity}
        position={newSunPos}
        target={targetRef.current}
        castShadow={shadows}
        shadow-camera-left={-shadowCamWidth}
        shadow-camera-right={shadowCamWidth}
        shadow-camera-bottom={-shadowCamWidth}
        shadow-camera-top={shadowCamWidth}
        shadow-camera-near={0}
        shadow-camera-far={40}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-bias={-0.001}
        ref={sunRef}
      >
        {debug && <axesHelper args={[5]}/>}
      </directionalLight>

      {debug && sunRef.current &&
        <cameraHelper args={[sunRef.current.shadow.camera]}>
          <axesHelper args={[5]}/>
        </cameraHelper>
      }
    </>
  )
}
