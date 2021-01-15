import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import { Sky } from 'drei'
import { gameState } from '../game/GameLogic'

export default function MySky() {
  const sunRef = useRef()

  useFrame(() => {

    if (sunRef.current) {
      const [x, y, z] = gameState.sun.position()
      const uniforms = sunRef.current.material.uniforms
      uniforms.sunPosition.value.x = x
      uniforms.sunPosition.value.y = y
      uniforms.sunPosition.value.z = z
      uniforms.up.value.x = 0
      uniforms.up.value.y = 0
      uniforms.up.value.z = 1

      uniforms['turbidity'].value = 10
      uniforms['rayleigh'].value = 0.5
      uniforms['mieCoefficient'].value = 0.00001
      uniforms['mieDirectionalG'].value = 0.007

      sunRef.current.material.uniformsNeedUpdate = true
    }
    // todo: does not need to be done very frame, but only when sun position changed significantly
    // same as with Lights.js
  })

  const [x, y, z] = gameState.sun.position()

  return <Sky ref={sunRef} distance={1000} sunPosition={[x, y, z]} />

  // todo: "up" should be set initially, but does not work that way (otherwise we can have initial flickering)
  // const upVec = THREE.Vector3(0, 0, 1)
  // uniforms={{up: upVec}} />
  // uniforms-up-x={0} uniforms-up-y={0} uniforms-up-z={1}/>
}
