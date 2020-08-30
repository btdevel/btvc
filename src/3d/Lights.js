import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import { gameState } from '../game/GameLogic'


export default function Lights() {
  const ambientRef = useRef()
  useFrame(() => {
    const theta = gameState.sun.elevation()

    ambientRef.current.intensity = Math.min(0.9, Math.max(theta, 0.1))
    //Math.min(0.9, Math.max(0, theta + 0.2) + 0.15) // 0.5 * (1 + Math.cos(phi) + 0.4)
  })

  const color = 0xFFFFFF
  const intensity = 0.5
  return (
    <>
      <ambientLight args={[color, intensity]} ref={ambientRef} />
    </>
  )
}
