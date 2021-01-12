import React, { useRef } from 'react'

import { useFrame } from 'react-three-fiber'
import { useSpring, animated } from 'react-spring'

import { gameState } from '../game/GameLogic'
export const springConfigSlide = { mass: 2, tension: 1400, friction: 150 }
export const springConfigSlow = { mass: 2, tension: 1000, friction: 300.0 }
// const AnimatedLight = animated(PointLight)

function PointLight({ color=0xffffff, position }) {
  return <group>
      <pointLight args={[color, 2, 3, 2]} position={position}/>
      {/* <pointLight args={[color, 2, 10, 6]} position={position}/> */}
  </group>
}

const AnimatedPointLight = animated(PointLight)

export default function DungeonLights () {
  const ambientRef = useRef()

  const startPos = gameState.position
  const [{ position }, setPos] = useSpring(() => ({
    position: [startPos.x, 10, startPos.y],
    // config: springConfigSlide
    config: springConfigSlow
  }))

  useFrame(() => {
    const pos = gameState.position
    setPos({ position: [pos.x, 0.4, pos.y] })
  })



  const color = 0xffffff
  const intensity = 0.09
  return (
    <>
      <ambientLight args={[color, intensity]} ref={ambientRef} />
      <PointLight color='lightred' position={[5,1.2,1]}/>
      <PointLight color='lightred' position={[10,1.2,18]}/>
      <AnimatedPointLight position={position}/>
    </>
  )
}
