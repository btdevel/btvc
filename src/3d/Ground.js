import React from 'react'
import * as THREE from 'three'

import floorImg from '../assets/images/textures/yellow_floor.png'
import dungeonFloorImg from '../assets/images/textures/stone_floor.png'

const loader = new THREE.TextureLoader()
function loadTexture (img) {
  const texture = loader.load(img)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2 * 3.141 * 1000, 2 * 3.141 * 1000)
  return texture
}

const floorTexture = loadTexture(floorImg)
const dungeonTexture = loadTexture(dungeonFloorImg)

export default function Ground({ type }) {
  let texture
  if (type === 'dungeon') {
    texture = dungeonTexture
  } else {
    texture = floorTexture
  }

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeBufferGeometry attach='geometry' args={[1000, 1000]} />
      {/* <meshStandardMaterial attach='material' color={'#503000'} /> */}
      <meshStandardMaterial attach='material' side={THREE.DoubleSide} map={texture} />
    </mesh>
  )
}
