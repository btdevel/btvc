import React, { useRef } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { Stars, Sky, OrbitControls, useCamera, PerspectiveCamera } from 'drei'
import * as THREE from 'three'
import PropTypes from 'prop-types'


import TimeStepper from '../game/TimeStepper'
import { stepper } from '../game/GameLogic'
import City from './City'


function Lights () {
  return (
    <>
      <ambientLight />
    </>
  )
}


function Ground () {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeBufferGeometry attach='geometry' two args={[1000, 1000, 1, 1]} />
      <meshBasicMaterial attach='material' color={'#503000'} />
    </mesh>
  )
}

function MySky () {
  // const phi = time / 24 * 2 * Math.PI
  // const theta = 80 / 180 * Math.PI
  // const r = 1.00000
  // const x = r * Math.cos(phi)
  // // const y = r * Math.sin(phi) * Math.sin(theta)
  // // const z = -r * Math.sin(phi) * Math.cos(theta)
  // const y = 0.05 * r
  // const z = r * Math.sin(phi)
  const [x, y, z] = [0, 0, -0.6]

  return <Sky sunPosition={[x, y, z]} />
}

export default function Scene () {
  console.log('RENDERING SCENE');
  const ref = useRef()
  // useFrame(() => ref.current.position.x += 0.02 )
  useFrame(() => {
    ref.current.rotation.y = stepper.getSimTime()
  })
  // 
  const startY = 15
  const startX = 25 // Guild
  // const startX = 15 // Market square

  return (
    <group>
      <PerspectiveCamera ref={ref} makeDefault position={[startX, 0, startY]}
      on/>
      <Lights />
      {/* <Stars /> */}
      <MySky />
      <Ground />
      <City />
      {/* <OrbitControls /> */}
    </group>
  )
}

