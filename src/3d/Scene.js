import React, { useRef } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { Stars, Sky, OrbitControls, useCamera, PerspectiveCamera } from 'drei'
import * as THREE from 'three'
import PropTypes from 'prop-types'


import cityMap from '../assets/levels/city.json'
import TimeStepper from '../game/TimeStepper'
import { stepper } from '../game/GameLogic'
import { House } from './House'


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

function TheCity () {
  // console.log('City', cityMap)

  const city = cityMap

  if (city === undefined) return <></>

  const elements = []

  for (let i = 0; i < 30; i++) {
    for (let j = 0; j < 30; j++) {
      const field = city.pattern[29-j][i]
      // const street = city.streets[i][j]
      // const text = [<div key="type">{types[field]}</div>];
      switch (field) {
        case '00':
        case '78':
          // element = <div></div>
          // text.push([<div key="street">{street_names[street]}</div>]);
          break
        case '60':
          // element = <div>o</div>
          break
        case '68':
          // element = <div>X</div> 
          break
        default:
          const num = Number.parseInt(field, 16)
          const type = (num - 1) % 4
          elements.push(<House key={[i,j]} type={type} x={i} y={j} />)
      }
    }
  }

  return <group>{elements}</group>
  
}

// const gameState = {
//   time: 0.0,

// }
// function gameUpdate() {

// }

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
      <TheCity />
      {/* <OrbitControls /> */}
    </group>
  )
}

