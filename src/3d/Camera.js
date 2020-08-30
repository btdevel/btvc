import React, { useRef, useEffect } from 'react'
import { useFrame } from 'react-three-fiber'
import { PerspectiveCamera } from 'drei'
import { gameState } from '../game/GameLogic'
import { useSpring, animated, config as springConfigs } from 'react-spring'
import { Euler } from 'three'

// const springConfig = { mass: 5, tension: 400, friction: 50, precision: 0.0001 }
const springConfigMove = { mass: 3, tension: 400, friction: 12.0, clamp: true}
const springConfigSlide = { mass: 2, tension: 1400, friction: 150}
const springConfigWobble = { mass: 3, tension: 400, friction: 12.0}

const AnimatedCamera = animated(PerspectiveCamera)

export default function Camera () {
  const startPos = gameState.position
  const startAngle = gameState.angle()

  const [{position}, setPos] = useSpring(() => ({
    position: [startPos.x, 0, startPos.y],
    config: springConfigSlide
  }))
  const [{rotation_y}, setRot] = useSpring(() => ({
    rotation_y: startAngle,
    config: springConfigMove
  }))

  useFrame(() => {
    const pos = gameState.position
    const angle = gameState.angle()
    setPos({position: [pos.x, 0, pos.y]})
    setRot({rotation_y: angle})
  })

  return (
    <AnimatedCamera
      makeDefault
      position={position}
      rotation-y={rotation_y}
      fov={120}
      on
    />
  )
}
