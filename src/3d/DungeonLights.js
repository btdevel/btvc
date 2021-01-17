import React, { useRef } from 'react'

import { useFrame } from 'react-three-fiber'
import { useSpring, animated } from 'react-spring'

import { gameState } from '../game/GameLogic'
export const springConfigSlide = { mass: 2, tension: 1400, friction: 150 }
export const springConfigSlow = { mass: 2, tension: 1000, friction: 300.0 }
// const AnimatedLight = animated(PointLight)

function PointLight({ color = 0xffffff, position }) {
  return <group>
    <pointLight args={[color, 2, 3, 2]} position={position} />
    {/* <pointLight args={[color, 2, 10, 6]} position={position}/> */}
  </group>
}

const AnimatedPointLight = animated(PointLight)

export default function DungeonLights({ map }) {
  const ambientRef = useRef()

  const startPos = gameState.position
  const [{ position }, setPos] = useSpring(() => ({
    position: [startPos.x, startPos.y, 2],
    // config: springConfigSlide
    config: springConfigSlow
  }))

  useFrame(() => {
    const pos = gameState.position
    setPos({ position: [pos.x, pos.y, 0.4] })
  })



  const color = 0xffffff
  const intensity = 0.09
  return (
    <>
      <ambientLight args={[color, intensity]} ref={ambientRef} />
      {map.level === 0 && <PointLight color='lightyellow' position={[1, 5, 1.2]} />}
      {map.level === 0 && <PointLight color='lightyellow' position={[18, 10, 1.2]} />}
      <AnimatedPointLight position={position} />
    </>
  )
}
