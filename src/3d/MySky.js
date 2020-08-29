import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import { Sky } from 'drei'
import { getState } from '../game/GameLogic'

const stepper = getState().stepper

export default function MySky() {
  const sunRef = useRef()

  useFrame(() => {
    const time = stepper.getSimTime()
    const phi = time / (60 * 60 * 24) * 2 * Math.PI
    const z = Math.cos(phi)
    // if (z > 0.999) {
    //   console.log(sunRef.current)
    // }
    sunRef.current.material.uniforms.sunPosition.value.z = -1
    sunRef.current.material.uniforms.sunPosition.value.y = z
    sunRef.current.material.uniforms.rayleigh.value = z + 1
    sunRef.current.material.uniformsNeedUpdate = true
  })

  const n = 1
  const [x, y, z] = [0.0, n * 0.1, n * 2]

  return <Sky ref={sunRef} sunPosition={[x, y, z]} />
}
