import React from 'react'
import * as THREE from 'three'
import { objectMap } from './util'

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
import gate2Img from '../assets/images/city/gate2.png'
import gate2Alpha from '../assets/images/city/gate2_alpha.png'


import { makeShapeGeometry, makeWallGeometry } from './util'

const loader = new THREE.TextureLoader()
function load(img) {
  const texture = loader.load(img)
  texture.minFilter = THREE.LinearFilter
  return texture
}

// 1: {map: load(house1Img), displacementMap: load(house1Bump), displacementScale: 0.0},

// const dummyProps = { color: new THREE.Color("blue") }
const materialProps = {
  " ": [{}],
  "1": [{ map: load(house1Img), alphaMap: load(house1Alpha), transparent: !true }],
  "2": [{ map: load(house2Img), alphaMap: load(house2Alpha), transparent: true }],
  "3": [{ map: load(house3Img) }],
  "4": [{ map: load(house4Img) }],
  "A": [{ map: load(guildImg), alphaMap: load(guildAlpha), transparent: true, emissiveMap: load(guildEmissive), emissive: 0xFFFFFF }],
  "P": [{ map: load(tavernImg), alphaMap: load(tavernAlpha), transparent: true, emissiveMap: load(tavernEmissive), emissive: 0xFFFFFF }],
  "G": [{ map: load(shopImg) }],
  "T": [{ map: load(templeImg) }],
  "C": [{ map: load(castleImg), alphaMap: load(castleAlpha), transparent: true }],
  "#": [{ map: load(gateImg), alphaMap: load(gateAlpha), transparent: true }, { map: load(gateImg), alphaMap: load(gateAlpha), transparent: true }, { map: load(gate2Img), alphaMap: load(gate2Alpha), transparent: true }],
  "|": [{ map: load(cityGateImg), alphaMap: load(cityGateAlpha), transparent: true }],
  "S": [{ map: load(statueImg), alphaMap: load(statueAlpha), transparent: true }],
}
const materials = objectMap(materialProps,
  propsArray => propsArray.map(props => new THREE.MeshStandardMaterial({side: THREE.DoubleSide, ...props})))


const standardProps = {castShadow: true, receiveShadow: true}
const meshProps = {
  " ": [{}],
  "1": [standardProps], //renderOrder: 4 },
  "2": [standardProps],//renderOrder: 3 },
  "3": [standardProps],
  "4": [standardProps],
  "A": [standardProps],
  "P": [standardProps],
  "G": [standardProps],
  "T": [standardProps],
  "C": [standardProps],
  "#": [{ ...standardProps, renderOrder: 2 }],
  "|": [{ ...standardProps, renderOrder: 2 }],
  "S": [{receiveShadow: true}],
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
const gateGeom = makeWallGeometry()
const statueGeom = makeWallGeometry().translate(0, 0, -0.3)
const geoms = {
  " ": [{}],
  "1": [standardWallGeom],
  "2": [makeHouseGeometry(0)],
  "3": [standardWallGeom],
  "4": [standardWallGeom],
  "A": [makeHouseGeometry(1)],
  "P": [makeHouseGeometry(2)],
  "G": [standardWallGeom],
  "T": [standardWallGeom],
  "C": [standardWallGeom],
  "#": [gateGeom],
  "|": [gateGeom],
  "S": [statueGeom],
}


// const materials = materialProps.map(props => new MeshStandardMaterial(props))
function Wall({ face, type }) {
  function select(arr, i) {
    const l = arr.length
    if (i === 3 && l < 4) i = 1
    if (i === 2 && l < 3) i = 0
    if (i === 1 && l < 2) i = 0
    return arr[i]
  }
  const pi2 = Math.PI / 2
  const z = 0
  const d = 0.5
  const x = [0, d, 0, -d][face]
  const y = [-d, 0, d, 0][face]
  const geom = select(geoms[type], face)
  const mat = select(materials[type], face)
  const props = select(meshProps[type], face)

  return (<mesh rotation-order="ZXY" rotation={[pi2, 0, face * pi2]} position={[x, y, z]} {...props} geometry={geom} material={mat} />)
}

export default function House({ x, y, type, dir, props }) {
  const pi2 = Math.PI / 2
  // console.log(dir);
  dir = 2 + '^<v>'.indexOf(dir)
  // console.log(dir);
  const eps = 0.001
  return (
    <group position={[x, y, 0]} rotation-order="ZXY" rotation-z={dir * pi2} scale={[1-eps, 1-eps, 1]}>
      <Wall face={0} type={type} />
      <Wall face={1} type={type} />
      <Wall face={2} type={type} />
      <Wall face={3} type={type} />
    </group>
  )
}

