import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import starImg from '../assets/images/textures/star.png'
import { gameState } from '../game/GameLogic'
import { useFrame } from 'react-three-fiber'

export default function Stars ({ number, box, minDist, color, size, sprite }) {
  const starGeo = new THREE.Geometry()

  for (let i = 0; i < 2 * number; i++) {
    let star = new THREE.Vector3(
      box * (2.0 * Math.random() - 1.0),
      box * (2.0 * Math.random() - 1.0),
      box * (2.0 * Math.random() - 1.0)
    )
    // console.log(star.x);
    if (star.length() <= box && star.length() > minDist) {
      starGeo.vertices.push(star)
    }
  }

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

  return <primitive object={stars} />
}

Stars.propTypes = {
  number: PropTypes.number,
  box: PropTypes.number,
  mindDist: PropTypes.number,
  color: PropTypes.oneOfType( [PropTypes.number, PropTypes.string] ),
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
