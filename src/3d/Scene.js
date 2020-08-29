import React, { useRef, useEffect } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { Stars, OrbitControls, useCamera, PerspectiveCamera } from 'drei'
import * as THREE from 'three'
import PropTypes from 'prop-types'

import { getState } from '../game/GameLogic'
import { SPECIAL_KEY } from './Keys'

import City from './City'
import Lights from './Lights'
import MySky from './MySky'
import Ground from './Ground'

const stepper = getState().stepper

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
