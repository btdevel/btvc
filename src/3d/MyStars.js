import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import {useFrame} from '@react-three/fiber'

import {gameState} from '../game/GameLogic'

import starImg from '../assets/images/textures/star.png'

export default function Stars({number, box, minDist, color, size, sprite}) {
  const starGeo = new THREE.BufferGeometry()

  let vertices = new Float32Array(3 * number);
  for (let i = 0; i < number; i++) {
    while (true) {
      let star = new THREE.Vector3(
        box * (2.0 * Math.random() - 1.0),
        box * (2.0 * Math.random() - 1.0),
        box * (2.0 * Math.random() - 1.0)
      )
      if (star.length() <= box && star.length() > minDist) {
        star.toArray(vertices, 3 * i)
        break;
      }
    }
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

  let starMaterial = new THREE.PointsMaterial({
    color,
    size,
    opacity: 0.9,
    transparent: true,
    map: sprite ? new THREE.TextureLoader().load(starImg) : undefined
  })

  const stars = new THREE.Points(starGeo, starMaterial)

  useFrame(() => {
    stars.rotation.x = -gameState.sun.latitude
    stars.rotation.z = -gameState.sun.hour_angle()
    const phi = gameState.sun.elevation()
    const opacity = THREE.MathUtils.clamp(-phi + 0.1, 0, 1)
    stars.material.opacity = opacity
  })

  return <primitive object={stars}/>
}

Stars.propTypes = {
  number: PropTypes.number,
  box: PropTypes.number,
  mindDist: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  size: PropTypes.number,
  sprite: PropTypes.bool
}

Stars.defaultProps = {
  number: 6000,
  box: 300,
  minDist: 100,
  color: 0xaaaaaa,
  size: 2.7,
  sprite: true
}
