import React from 'react'
import * as THREE from 'three'
import { loadTextureRepeat } from "./util"

import floorImg from '../assets/images/textures/yellow_floor.png'
import dungeonFloorImg from '../assets/images/levels1/dungeon_floor2.png'
// import dungeonFloorImg from '../assets/images/textures/stone_floor.png'
// import dungeonFloorImg from '../assets/images/levels1/dungeon_floor.png'

const cityFloorTexture = loadTextureRepeat(floorImg, 2 * 3.141 * 1000)
const dungeonFloorTexture = loadTextureRepeat(dungeonFloorImg, 2 * 1000)

export default function Ground({ type }) {
  let texture
  if (type === 'city') {
    texture = cityFloorTexture
  } else {
    texture = dungeonFloorTexture
  }

  return (
    <mesh position={[0, 0, -0.5]} receiveShadow>
      <planeGeometry attach='geometry' args={[1000, 1000]} />
      <meshStandardMaterial attach='material' side={THREE.DoubleSide} map={texture} />
    </mesh>
  )
}
