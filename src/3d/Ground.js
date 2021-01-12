import React from 'react'
import * as THREE from 'three'

import { useSpring, animated, a } from 'react-spring'


import floorImg from '../assets/images/textures/yellow_floor.png'
import dungeonFloorImg from '../assets/images/textures/stone_floor.png'

const loader = new THREE.TextureLoader()
function loadTexture(img) {
  const texture = loader.load(img)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2 * 3.141 * 1000, 2 * 3.141 * 1000)
  return texture
}

const white = new THREE.Color(0xffffff)
const black = new THREE.Color(0x000000)

function createCheckeredTexture(color1 = white, color2 = black) {
  const width = 2;
  const height = 2;

  const size = width * height;
  const data = new Uint8Array(3 * size);

  data[0] = Math.floor(color1.r * 255)
  data[1] = Math.floor(color1.g * 255)
  data[2] = Math.floor(color1.b * 255)
  data[3] = Math.floor(color2.r * 255)
  data[4] = Math.floor(color2.g * 255)
  data[5] = Math.floor(color2.b * 255)

  data.copyWithin(6, 3, 6)
  data.copyWithin(9, 0, 3)

  // for (let i = 1; i < size / 2; i++) {
  //   data.copyWithin(i * 6, 0, 6)
  // }

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  texture.repeat.set(4*500, 4*500);
  return texture
}

const floorTexture = loadTexture(floorImg)
// const dungeonTexture = loadTexture(dungeonFloorImg)

function lighten(color, add) {
  const { h, s, l } = color.getHSL()
  const newColor = new THREE.Color()
  return newColor.setHSL(h, s, l + add)
}
const floorColor = new THREE.Color("rgb(0, 85, 68)")
const floorColor2 = lighten(floorColor, 0.1)

const dungeonTexture = createCheckeredTexture(floorColor, floorColor2)




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
