import React, { useRef, useEffect } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { Stars, Sky, OrbitControls, useCamera, PerspectiveCamera } from 'drei'
import * as THREE from 'three'
import PropTypes from 'prop-types'

import TimeStepper from '../game/TimeStepper'
import { stepper } from '../game/GameLogic'
import City from './City'
import { SPECIAL_KEY } from './Keys'

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

let startY = 15
let startX = 25 // Guild
// let startX = 15 // Market square

let angle = 0

export default function Scene () {
  console.log('RENDERING SCENE')
  const cameraRef = useRef()
  // useFrame(() => ref.current.position.x += 0.02 )
  useFrame(() => {
    // cameraRef.current.rotation.y = stepper.getSimTime()
  })

  useEffect(() => {
    function onDocumentKeyDown (event) {
      var keyCode = event.which
      const position = cameraRef.current.position
      const rotation = cameraRef.current.rotation

      if (keyCode == SPECIAL_KEY.DOWN) {
        position.x += Math.round(Math.sin(angle / 180 * Math.PI))
        position.z += Math.round(Math.cos(angle / 180 * Math.PI))
      } else if (keyCode == SPECIAL_KEY.UP) {
        position.x -= Math.round(Math.sin(angle / 180 * Math.PI))
        position.z -= Math.round(Math.cos(angle / 180 * Math.PI))
      } else if (keyCode == SPECIAL_KEY.LEFT) {
        console.log(rotation)
        angle += 90
        rotation.set(0, angle / 180 * Math.PI, 0, 'XYZ')
      } else if (keyCode == SPECIAL_KEY.RIGHT) {
        angle -= 90
        rotation.set(0, angle / 180 * Math.PI, 0, 'XYZ')
      }
    }

    document.addEventListener('keydown', onDocumentKeyDown, false)
  }, [])

  return (
    <group>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[startX, 0, startY]}
        on
      />
      <Lights />
      {/* <Stars /> */}
      <MySky />
      <Ground />
      <City />
      {/* <OrbitControls /> */}
    </group>
  )
}
