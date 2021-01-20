import React, { forwardRef } from 'react'
import * as THREE from 'three'

import house1Img from '../assets/images/city/house1.png'
import house1Alpha from '../assets/images/city/house1_alpha.png'
// import house1Bump from '../assets/images/city/house1_bump.png'
import house2Img from '../assets/images/city/house2.png'
import house2Alpha from '../assets/images/city/house2_alpha.png'
import house3Img from '../assets/images/city/house3.png'
import house4Img from '../assets/images/city/house4.png'

import guildImg from '../assets/images/city/guild.png'
import guildAlpha from '../assets/images/city/guild_alpha.png'
import guildEmissive from '../assets/images/city/guild_emissive.png'
import tavernImg from '../assets/images/city/tavern.png'
import tavernAlpha from '../assets/images/city/tavern_alpha.png'
import tavernEmissive from '../assets/images/city/tavern_emissive.png'
import shopImg from '../assets/images/city/shop.png'
import templeImg from '../assets/images/city/temple.png'
import castleImg from '../assets/images/city/castle.png'
import castleAlpha from '../assets/images/city/castle_alpha.png'

import statueImg from '../assets/images/city/statue.png'
import statueAlpha from '../assets/images/city/statue_alpha.png'
import cityGateImg from '../assets/images/city/city_gate.png'
import cityGateAlpha from '../assets/images/city/city_gate_alpha.png'
import gateImg from '../assets/images/city/gate.png'
import gateAlpha from '../assets/images/city/gate_alpha.png'
import { MeshStandardMaterial } from 'three'

import { makeShapeGeometry, makeWallGeometry } from './util'

const loader = new THREE.TextureLoader()
function load(img) {
  const texture = loader.load(img)
  texture.minFilter = THREE.LinearFilter
  return texture
}

// 1: {map: load(house1Img), displacementMap: load(house1Bump), displacementScale: 0.0},

const materialProps = {
  " ": {},
  "1": { map: load(house1Img), alphaMap: load(house1Alpha), transparent: !true },
  "2": { map: load(house2Img), alphaMap: load(house2Alpha), transparent: true },
  "3": { map: load(house3Img) },
  "4": { map: load(house4Img) },
  "A": { map: load(guildImg), alphaMap: load(guildAlpha), transparent: true, emissiveMap: load(guildEmissive), emissive: 0xFFFFFF },
  "P": { map: load(tavernImg), alphaMap: load(tavernAlpha), transparent: true, emissiveMap: load(tavernEmissive), emissive: 0xFFFFFF },
  "G": { map: load(shopImg) },
  "T": { map: load(templeImg) },
  "C": { map: load(castleImg), alphaMap: load(castleAlpha), transparent: true },
  "#": { map: load(gateImg), alphaMap: load(gateAlpha), transparent: true },
  "|": { map: load(cityGateImg), alphaMap: load(cityGateAlpha), transparent: true },
  "S": { map: load(statueImg), alphaMap: load(statueAlpha), transparent: true },
}
const meshProps = {
  " ": {},
  "1": {}, //renderOrder: 4 },
  "2": {},//renderOrder: 3 },
  "3": {},
  "4": {},
  "A": {},
  "P": {},
  "G": {},
  "T": {},
  "C": {},
  "#": { renderOrder: 2 },
  "|": { renderOrder: 2 },
  "S": {},
}

export function makeHouseGeometry(type) {
  const width = 224
  const height = 176
  const points1 = [[0, 40], [104, 0], [109, 0], [224, 41]]
  const points2 = [[0, 48], [108, 0], [119, 0], [136, 6], [136, 0], [157, 0], [157, 15], [224, 42]]
  const points3 = [[0, 48], [70, 15], [70, 0], [99, 0], [99, 5], [108, 0], [119, 0], [224, 42]]
  const points = [points1, points2, points3]
  const p = points[type].map(([x, y]) => [x / width, (height - y) / height])
  return makeShapeGeometry([[0, 0], ...p, [1, 0]])
}

const standardWallGeom = makeWallGeometry()
const gateGeom = makeWallGeometry().translate(0, 0, -0.45)
const geoms = {
  " ": {},
  "1": standardWallGeom,
  "2": makeHouseGeometry(0),
  "3": standardWallGeom,
  "4": standardWallGeom,
  "A": makeHouseGeometry(1),
  "P": makeHouseGeometry(2),
  "G": standardWallGeom,
  "T": standardWallGeom,
  "C": standardWallGeom,
  "#": gateGeom,
  "|": gateGeom,
  "S": gateGeom,
}

const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )
const materials = objectMap(materialProps, props => new MeshStandardMaterial(props))

// const materials = materialProps.map(props => new MeshStandardMaterial(props))

export const House = forwardRef(({ type, x, y, props }, ref) => {
  const pi2 = Math.PI / 2
  const z = 0
  const d = 0.5
  const xgeom = geoms[type]
  return (
    <>
      <mesh rotation-order="ZXY" rotation={[pi2, 0, 2 * pi2]} position={[x, y + d, z]} castShadow receiveShadow {...meshProps[type]} ref={ref} geometry={xgeom} material={materials[type]} />
      <mesh rotation-order="ZXY" rotation={[pi2, 0, 3 * pi2]} position={[x - d, y, z]} castShadow receiveShadow {...meshProps[type]} ref={ref} geometry={xgeom} material={materials[type]} />
      <mesh rotation-order="ZXY" rotation={[pi2, 0, 0 * pi2]} position={[x, y - d, z]} castShadow receiveShadow {...meshProps[type]} ref={ref} geometry={xgeom} material={materials[type]} />
      <mesh rotation-order="ZXY" rotation={[pi2, 0, 1 * pi2]} position={[x + d, y, z]} castShadow receiveShadow {...meshProps[type]} ref={ref} geometry={xgeom} material={materials[type]} />
    </>
  )
  // return (
  //   <mesh rotation={[Math.PI/2, 0, 0]}
  //     position={[x, y, -eps/2]} castShadow receiveShadow {...meshProps[type]} ref={ref} geometry = {houseGeometry} material = {materials[type]}>
  //     {/* <boxBufferGeometry attach='geometry' args={[1, 1, 1]} /> */}
  //     {/* <meshStandardMaterial attach='material' {...materialProps[type]} /> */}
  //   </mesh>
  // )
})

House.defaultProps = {
  x: 0,
  y: 0,
  type: 3
}

export default House
