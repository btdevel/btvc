import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'

import house1Img from '../assets/images/city/house1.png'
import house1Bump from '../assets/images/city/house1_bump.png'
import house2Img from '../assets/images/city/house2.png'
import house2Alpha from '../assets/images/city/house2_alpha.png'
import house3Img from '../assets/images/city/house3.png'
import house4Img from '../assets/images/city/house4.png'

import guildImg from '../assets/images/city/guild.png'
import guildAlpha from '../assets/images/city/guild_alpha.png'
import guildEmis from '../assets/images/city/guild_emissive.png'
import tavernImg from '../assets/images/city/tavern.png'
import tavernAlpha from '../assets/images/city/tavern_alpha.png'
import tavernEmis from '../assets/images/city/tavern_emissive.png'
import shopImg from '../assets/images/city/shop.png'
import templeImg from '../assets/images/city/temple.png'
import castleImg from '../assets/images/city/castle.png'
import castleAlpha from '../assets/images/city/castle_alpha.png'

import statueImg from '../assets/images/city/statue.png'
import cityGateImg from '../assets/images/city/city_gate.png'
import gateImg from '../assets/images/city/gate.png'


const loader = new THREE.TextureLoader()
function load(img) { return loader.load(img)}

const houseTextures = {
  1: {map: load(house1Img), displacementMap: load(house1Bump), displacementScale: 0.0},
  2: {map: load(house2Img), alphaMap: load(house2Alpha), transparent: true },
  3: {map: load(house3Img)},
  4: {map: load(house4Img)},
  5: {map: load(guildImg), alphaMap: load(guildAlpha), transparent: true, emissiveMap: load(guildEmis), emissive: 0xFFFFFF},
  6: {map: load(tavernImg), alphaMap: load(tavernAlpha), transparent: true, emissiveMap: load(tavernEmis), emissive: 0xFFFFFF },
  7: {map: load(shopImg)},
  8: {map: load(templeImg)},
  9: {map: load(castleImg), alphaMap: load(castleAlpha), transparent: true },
}


{/* <texture attach="map" image={img} onUpdate={self => img && (self.needsUpdate = true)} /> */}
export default function House ({ type, x, y, props }) {
  // console.log(houseTextures)
  return (
    <mesh position={[x, 0, y]}>
      <boxBufferGeometry attach='geometry' args={[1, 1, 1, 5, 5, 5]} />
      <meshStandardMaterial attach='material' {...houseTextures[type]} />
    </mesh>
  )
}

House.defaultProps = {
  x: 0,
  y: 0,
  type: 3
}
