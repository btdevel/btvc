import React from 'react'
import { useFrame } from 'react-three-fiber'
import { PerspectiveCamera } from 'drei'
import { gameState } from '../game/GameLogic'
import { useSpring, animated } from 'react-spring'
import { audioListener } from './Audio'

export const springConfigMove = { mass: 3, tension: 400, friction: 12.0, clamp: true }
export const springConfigSlide = { mass: 2, tension: 1400, friction: 150 }
export const springConfigWobble = { mass: 3, tension: 400, friction: 12.0 }

const AnimatedCamera = animated(PerspectiveCamera)

export default function Camera() {
  const startPos = gameState.position
  const startAngle = gameState.angle()

  const [{ position }, setPos] = useSpring(() => ({
    position: [startPos.x, startPos.y, 0],
    config: springConfigSlide
  }))
  const [{ rotationZ, rotationX }, setRot] = useSpring(() => ({
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
    setPos({ position: [pos.x, pos.y, z], immediate: immediate })
    setRot({ rotationZ: angle + dPhi, rotationX: Math.PI / 2 + dTheta, immediate: immediate })
    gameState.jumped = false
  })

  function interp(...args) {
    // console.log(args);
    const [x, y, z] = args
    // console.log(x)
    return [x, y, z]
  }
  return (<AnimatedCamera
    makeDefault
    position={position.interpolate(interp)}
    rotation-x={rotationX}
    rotation-z={rotationZ}
    rotation-order='YZX'
    // fov={120}
    fov={90}
    near={0.01}
    far={550}
    on
  >
    <primitive object={audioListener} />
  </AnimatedCamera>

  )
}
