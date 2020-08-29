import React, { useRef, useEffect } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { Stars, Sky, OrbitControls, useCamera, PerspectiveCamera } from 'drei'
import * as THREE from 'three'
import PropTypes from 'prop-types'

import { getState } from '../game/GameLogic'
import City from './City'
import { SPECIAL_KEY } from './Keys'

const stepper = getState().stepper

function Lights () {
  const ambientRef = useRef()
  useFrame(() => {
    const time = stepper.getSimTime() 
    const phi = time / (60 * 60 * 24) * 2 * Math.PI
    // console.log('SimTime: ', time, phi)///60/24);
  //   const z = Math.cos(phi)

  //   const sunPos = sunRef.current.position
  //   // console.log(time, sunPos,sunRef.current)
  // }) 
    ambientRef.current.intensity = Math.min(0.9, Math.max(0, Math.cos(phi) + 0.2) + 0.15) // 0.5 * (1 + Math.cos(phi) + 0.4)
  })


  const color = 0xFFFFFF
  const intensity = 0.5
  return (
    <>
      <ambientLight args={[color, intensity]} ref={ambientRef} />
    </>
  )
}

function Ground () {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeBufferGeometry attach='geometry' two args={[1000, 1000, 1, 1]} />
      <meshStandardMaterial attach='material' color={'#503000'} />
    </mesh>
  )
}

function MySky () {
  const sunRef = useRef()

  useFrame(() => {
    const time = stepper.getSimTime()
    const phi = time / (60 * 60 * 24) * 2 * Math.PI
    const z = Math.cos(phi)
    if( z>0.999){
      console.log(sunRef.current)
    }
    sunRef.current.material.uniforms.sunPosition.value.z = -1
    sunRef.current.material.uniforms.sunPosition.value.y = z
    sunRef.current.material.uniforms.rayleigh.value = z+1
    sunRef.current.material.uniformsNeedUpdate = true
  })

  const n=1
  const [x, y, z] = [0.0, n*0.1, n*2]

  return <Sky ref={sunRef} sunPosition={[x, y, z]} />
}

let startY = 15
let startX = 25 // Guild
let startAngle = 0

export default function Scene () {
  console.log('RENDERING SCENE')
  const cameraRef = useRef()
  // useFrame(() => ref.current.position.x += 0.02 )
  useFrame(() => {
    // cameraRef.current.rotation.y = stepper.getSimTime()
    const camera = cameraRef.current
    const angle = getState().transient.angle
    const position = getState().transient.position
    camera.position.x = position.x
    camera.position.z = position.y
    camera.rotation.set(0, angle / 180 * Math.PI, 0, 'XYZ')
    // console.log(angle);
  })

  useEffect(() => {
    getState().position.x = startX
    getState().position.y = startY
    getState().angle = startAngle
    getState().transient.position.x = startX
    getState().transient.position.y = startY
    getState().transient.angle = startAngle
    
    stepper.setSimSpeed(24 * 60 * 3) // One minute is 24 hours
    stepper.resume()

    function onDocumentKeyDown (event) {
      var keyCode = event.which
      const position = cameraRef.current.position
      const rotation = cameraRef.current.rotation

      if (keyCode == SPECIAL_KEY.DOWN) {
        getState().move(+1)
      } else if (keyCode == SPECIAL_KEY.UP) {
        getState().move(-1)
      } else if (keyCode == SPECIAL_KEY.LEFT) {
        getState().turn(+90)
        // rotation.set(0, angle / 180 * Math.PI, 0, 'XYZ')
      } else if (keyCode == SPECIAL_KEY.RIGHT) {
        getState().turn(-90)
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
        fov={120}
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
