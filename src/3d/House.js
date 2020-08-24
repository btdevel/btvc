import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'

import house1Img from '../assets/images/city/house1.png'
import house2Img from '../assets/images/city/house2.png'
import house3Img from '../assets/images/city/house3.png'
import house4Img from '../assets/images/city/house4.png'

const houseTextures = [house1Img, house2Img, house3Img, house4Img].map(img =>
  new THREE.TextureLoader().load(img)
)

export function House({ type, x, y, props }) {
  // console.log(houseTextures)
  return (
    <mesh position={[x, 0, y]}>
      <boxBufferGeometry attach='geometry' args={[1, 1, 1]} />
      <meshStandardMaterial attach='material' map={houseTextures[type]} />
    </mesh>
  )
}

House.defaultProps = {
  x: 0,
  y: 0,
  type: 3
}
