import React from 'react'
import {useFrame} from '@react-three/fiber'
import {PerspectiveCamera} from '@react-three/drei'
import {animated, useSpring} from '@react-spring/three'
import {gameState} from '../game/GameLogic'
import AudioListener from "./AudioListener"


export const springConfigMove = {mass: 3, tension: 400, friction: 12.0, clamp: true}
export const springConfigSlide = {mass: 2, tension: 1400, friction: 150}
export const springConfigWobble = {mass: 3, tension: 400, friction: 12.0}

const AnimatedCamera = animated(PerspectiveCamera)

export default function Camera() {
  const startPos = gameState.position
  const startAngle = gameState.angle()

  const [{position}, posApi] = useSpring(() => ({
    position: [startPos.x, startPos.y, 0],
    config: springConfigSlide
  }))
  const [{rotationZ, rotationX}, rotApi] = useSpring(() => ({
    rotationZ: startAngle,
    rotationX: Math.PI / 2,
    config: springConfigSlide
  }))

  useFrame(() => {
    const pos = gameState.position
    const angle = gameState.angle()
    const dPhi = gameState.dPhi
    const dTheta = gameState.dTheta
    const z = gameState.flyMode ? 1 : 0

    const immediate = gameState.jumped
    posApi.start({position: [pos.x, pos.y, z], immediate: immediate})
    rotApi.start({rotationZ: angle + dPhi, rotationX: Math.PI / 2 + dTheta, immediate: immediate})
    gameState.jumped = false
  })

  return (<AnimatedCamera
      makeDefault
      position={position.to(Array)}
      rotation-x={rotationX}
      rotation-z={rotationZ}
      rotation-order='YZX'
      // fov={120}
      fov={90}
      near={0.01}
      far={550}
      on
    >
      <AudioListener/>
    </AnimatedCamera>

  )
}
