import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import { getState } from '../game/GameLogic'

const stepper = getState().stepper

export default function Lights() {
  const ambientRef = useRef()
  useFrame(() => {
    const time = stepper.getSimTime()
    const phi = time / (60 * 60 * 24) * 2 * Math.PI
    // console.log('SimTime: ', time, phi)///60/24);
    //   const z = Math.cos(phi)
    //   const sunPos = sunRef.current.position
    //   // console.log(time, sunPos,sunRef.current)
    // }) 
    ambientRef.current.intensity = Math.min(0.9, Math.max(0, Math.cos(phi) + 0.2) + 0.15) // 0.5 * (1 + Math.cos(phi) + 0.4)
  })


  const color = 0xFFFFFF
  const intensity = 0.5
  return (
    <>
      <ambientLight args={[color, intensity]} ref={ambientRef} />
    </>
  )
}
