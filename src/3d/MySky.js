import React, {useRef} from 'react'
import {useFrame} from '@react-three/fiber'
import {Sky} from '@react-three/drei'
import {gameState} from '../game/GameLogic'

export default function MySky() {
  const sunRef = useRef()
  let sunInitialized = false

  useFrame(() => {

    if (sunRef.current) {
      const [x, y, z] = gameState.sun.position()
      const uniforms = sunRef.current.material.uniforms
      if (!sunInitialized) {
        uniforms.up.value.x = 0
        uniforms.up.value.y = 0
        uniforms.up.value.z = 1

        uniforms['turbidity'].value = 10
        uniforms['rayleigh'].value = 0.5
        uniforms['mieCoefficient'].value = 0.00001
        uniforms['mieDirectionalG'].value = 0.007
        sunInitialized = true
      }
      uniforms.sunPosition.value.x = x
      uniforms.sunPosition.value.y = y
      uniforms.sunPosition.value.z = z

      sunRef.current.material.uniformsNeedUpdate = true
    } else {
      sunInitialized = false
    }
    // todo: does not need to be done very frame, but only when sun position changed significantly
    // same as with Lights.js
  })

  const [x, y, z] = gameState.sun.position()

  return <Sky ref={sunRef} distance={1000} sunPosition={[x, y, z]}/>
}
