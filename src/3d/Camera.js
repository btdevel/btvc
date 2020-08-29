import React, { useRef, useEffect } from 'react'
import { useFrame } from 'react-three-fiber'
import { PerspectiveCamera } from 'drei'
import { getState } from '../game/GameLogic'
import { useSpring, animated, config as springConfigs } from 'react-spring'
import { Euler } from 'three'

// const springConfig = { mass: 5, tension: 400, friction: 50, precision: 0.0001 }
const springConfigMove = { mass: 3, tension: 400, friction: 12.0, clamp: true}
const springConfigSlide = { mass: 2, tension: 1400, friction: 150}
const springConfigWobble = { mass: 3, tension: 400, friction: 12.0}

let startY = 15
let startX = 25 // Guild
let startAngle = 0

getState().position.x = startX
getState().position.y = startY
getState().angle = startAngle

const AnimCamera = animated(PerspectiveCamera)

const radians = (degree) => (degree / 180.0 * Math.PI)

export default function Camera () {

  const [{position}, setPos] = useSpring(() => ({
    position: [startX, 0, startY],
    config: springConfigSlide
  }))
  const [{rotation_y}, setRot] = useSpring(() => ({
    rotation_y: radians(startAngle),
    config: springConfigMove
  }))
  // console.log(props)

  useFrame(() => {
    const angle = getState().angle
    const pos = getState().position
    setPos({position: [pos.x, 0, pos.y]})
    setRot({rotation_y: radians(angle)})

    //camera.rotation.set(0, (angle / 180) * Math.PI, 0, 'XYZ')
    // console.log(angle);
  })

  return (
    <AnimCamera
      makeDefault
      position={position}
      rotation-y={rotation_y}
      fov={120}
      on
    />
  )
}
