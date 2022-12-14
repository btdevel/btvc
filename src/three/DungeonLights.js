import React, {useRef} from 'react'
import {useFrame} from '@react-three/fiber'
import {animated, useSpring} from '@react-spring/three'

import {gameState} from '../game/GameLogic'

export const springConfigSlide = {mass: 2, tension: 1400, friction: 150}
export const springConfigSlow = {mass: 2, tension: 1000, friction: 300.0}

// const AnimatedLight = animated(PointLight)

function PointLight({color = 0xffffff, position}) {
  // const [intensity, distance, decay] = [2, 5, 2]
  // const longDistance = [3, 7, 2]

  // const longDistance = [3, 19, 1]
  // const medDistance = [3, 4, 2]
  const shortDistance = [5, 2, 2]
  const [intensity, distance, decay] = shortDistance
  return <group>
    {/* <pointLight args={[color, 2, 3, 2]} position={position} /> */}
    <pointLight args={[color, intensity, distance, decay]} position={position}/>
    {/* <pointLight args={[color, 2, 10, 6]} position={position}/> */}
  </group>
}

const AnimatedPointLight = animated(PointLight)

export default function DungeonLights({map}) {
  const ambientRef = useRef()

  const startPos = gameState.position
  const [{position}, posApi] = useSpring(() => ({
    position: [startPos.x, startPos.y, 2],
    // config: springConfigSlide
    config: springConfigSlow
  }))

  useFrame(() => {
    const pos = gameState.position
    posApi.start({position: [pos.x, pos.y, 0.4]})
  })

  const lights = []

  // Ambient light
  const color = 0xffffff
  const intensity = 0.09
  lights.push(<ambientLight key="ambient" args={[color, intensity]} ref={ambientRef}/>)

  // Party light (todo: needs to be driven by spell/torch... info)
  lights.push(<AnimatedPointLight key="party" position={position}/>)

  // Extra dungeon lights
  if (map.lights) {
    let num = 0
    for (let extraLight of map.lights) {
      num++
      const [[x, y], params] = extraLight
      lights.push(<PointLight key={num} color='lightyellow' {...params} position={[x, y, 1.2]}/>)
    }
  }
  return <>{lights}</>
}
