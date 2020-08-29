import React, { useEffect } from 'react'
import { useLoader } from 'react-three-fiber'
import { Stars, OrbitControls, useCamera } from 'drei'
import * as THREE from 'three'
import PropTypes from 'prop-types'

import { getState } from '../game/GameLogic'
import { SPECIAL_KEY } from './Keys'

import City from './City'
import Lights from './Lights'
import MySky from './MySky'
import Ground from './Ground'
import Camera from './Camera'

const stepper = getState().stepper

export default function Scene () {
  console.log('RENDERING SCENE')

  useEffect(() => {
    stepper.setSimSpeed(24 * 60 * 3) // One minute is 24 hours
    stepper.resume()

    function onDocumentKeyDown (event) {
      var keyCode = event.which

      if (keyCode == SPECIAL_KEY.DOWN) {
        getState().move(+1)
      } else if (keyCode == SPECIAL_KEY.UP) {
        getState().move(-1)
      } else if (keyCode == SPECIAL_KEY.LEFT) {
        getState().turn(+90)
      } else if (keyCode == SPECIAL_KEY.RIGHT) {
        getState().turn(-90)
      }
    }

    document.addEventListener('keydown', onDocumentKeyDown, false)
  }, [])

  return (
    <group>
      <Camera />
      <Lights />
      <MySky />
      <Ground />
      <City />
      {/* <OrbitControls /> */}
    </group>
  )
}
