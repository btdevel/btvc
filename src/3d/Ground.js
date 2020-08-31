import React from 'react'
import * as THREE from 'three'

import floorImg from '../assets/images/textures/yellow_floor.png'
// import floorImg from '../assets/images/textures/stone_floor.png'

const loader = new THREE.TextureLoader()
function load(img) { return loader.load(img)}

const texture = load(floorImg)
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 2*3.141*1000, 2*3.141*1000 );

export default function Ground() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeBufferGeometry attach='geometry' args={[1000, 1000]} />
      {/* <meshStandardMaterial attach='material' color={'#503000'} /> */}
      <meshStandardMaterial attach='material' side={THREE.DoubleSide} map={texture} />
    </mesh>
  )
}
