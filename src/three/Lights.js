import React, {useRef} from 'react'
import * as THREE from 'three'
import {DirectionalLightHelper, SpotLightHelper} from 'three'
import {useFrame, useThree} from '@react-three/fiber'
import {useHelper} from '@react-three/drei'

import PlayerPos from './PlayerPos'
import {gameState} from '../game/GameLogic'
import {radians} from "../util/math"
import {makeVector3} from './util'

const sunDistance = 20
const maxShadowUpdateDelay = 0.2
const minShadowUpdateDelay = 0.1
const minShadowUpdateSunDist = sunDistance * 0.01

function computeLightParams() {
  const targetPos = makeVector3([gameState.position.x, gameState.position.y, 0])
  const theta = gameState.sun.elevation()
  const sunPos = makeVector3(gameState.sun.position())

  const sin = Math.sin(theta)
  const intensity1 = Math.min(0.9, Math.max(2 * sin, 0.1))
  const intensity2 = Math.min(0.9, Math.max(2 * (sin - 0.0001), 0.0))

  const ambientIntensity = 0.5 * intensity1
  const sunIntensity = 0.7 * intensity2

  const newSunPos = sunPos.multiplyScalar(sunDistance).add(targetPos)
  return {ambientIntensity, sunIntensity, newSunPos}
}

function LightsHelper({sunRef, slightRef}) {
  useHelper(sunRef, DirectionalLightHelper, 'cyan')
  useHelper(slightRef, SpotLightHelper, 'blue')
}

export default function Lights({shadows, shadowMapSize}) {

  const ambientRef = useRef()
  const sunRef = useRef()
  const playerRef = useRef()
  const slightRef = useRef()

  // Putting this here, even without using it, seems to make a difference
  // Otherwise shadows and directional lights don't work as expected
  const u3 = useThree() // eslint-disable-line

  const clock = useRef(new THREE.Clock(true)).current
  useFrame(() => {
    const {ambientIntensity, sunIntensity, newSunPos} = computeLightParams()

    if (ambientRef.current) {
      ambientRef.current.intensity = ambientIntensity
    }

    slightRef.current?.position.copy(newSunPos)

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

  const {ambientIntensity, sunIntensity, newSunPos} = computeLightParams()
  const color = 0xffffff
  const shadowCamWidth = 20
  const debug = false

  return (
    <>
      <ambientLight args={[color, ambientIntensity]} ref={ambientRef}/>

      <PlayerPos ref={playerRef} />

      <directionalLight
        angle={radians(10)}
        intensity={sunIntensity}
        position={newSunPos}
        target={playerRef.current}
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
        shadow-normalBias={0.1}
        ref={sunRef}
      />

      {debug && <spotLight
        angle={radians(3.0)}
        intensity={sunIntensity}
        position={newSunPos}
        target={playerRef.current}
        ref={slightRef}
        distance={30}
        penumbra={0.0}
      />}

      {debug && <LightsHelper slightRef={slightRef} sunRef={sunRef}/>}
    </>
  )
}
