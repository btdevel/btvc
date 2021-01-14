import React, { useEffect } from 'react'
import { MeshBasicMaterial } from 'three'
import { loadLevel } from '../game/DungeonMap'
import { useAsync } from '../util/hooks'
import * as THREE from 'three'
// const cityMap = new CityMap()

import wallImg from '../assets/images/levels1/dungeon_wall_imp.png'
import doorImg from '../assets/images/levels1/dungeon_door_imp.png'
// import wallImg from '../assets/images/levels1/dungeon_wall.png'
// import doorImg from '../assets/images/levels1/dungeon_door.png'

const colorCeiling = new THREE.Color("rgb(0, 85, 68)")

const wallGeom = new THREE.PlaneBufferGeometry()
const sdoorMat = new THREE.MeshBasicMaterial({ color: 'red' })

const floorMat = new THREE.MeshBasicMaterial({color: colorCeiling})
const ceilMat = new THREE.MeshBasicMaterial({color: colorCeiling})


const loader = new THREE.TextureLoader()
function load(img) {
  const texture = loader.load(img)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  // texture.anisotropy = 16;
  return texture
}

// const wallMat = new THREE.MeshBasicMaterial({ map: load(wallImg) })
const wallMat = new THREE.MeshStandardMaterial({ map: load(wallImg) })
const doorMat = new THREE.MeshStandardMaterial({ map: load(doorImg) })


const materials = [undefined, wallMat, doorMat, sdoorMat]


function Wall({ x, y, dir, wtype }) {
  let rot = 0
  switch (dir) {
    case 0:
      y -= 0.5
      rot = 0
      break
    case 1:
      x -= 0.5
      rot = 0.5 * Math.PI
      break
    case 2:
      y += 0.5
      rot = Math.PI
      break
    case 3:
      x += 0.5
      rot = 1.5 * Math.PI
      break
      break
    default:
      console.error(`Unknown direction: ${dir} ${typeof dir}`)
  }

  const elems = []
  // elems.push(<mesh key={[0, 0]} position={[x, 0, y]} rotation-y={rot} material={materials[wtype]} geometry={wallGeom} />)
  const repI = 0, repJ = 0;
  for (let i = -repI; i <= repI; ++i) {
    for (let j = -repJ; j <= repJ; ++j) {
      elems.push(<mesh key={[i, j]} position={[x + 22 * i, 0, y + 22 * j]} rotation-y={rot} material={wallMat} geometry={wallGeom} />)
    }
  }
  return <group>{elems}</group>
}

function createLevel(map, elements) {
  console.log("Map: ", map)
  if (!map) return {}
  if (!map.map) return {}

  const rows = map.map.length
  const columns = map.map[0].length

  for (let i = 0; i < columns; ++i) {
    for (let j = 0; j < rows; ++j) {
      const space = map.map[j][i]
      const dirs = [space.west, space.south, space.east, space.north]
      // const space = levelMap.map[i][j]
      // const dirs = [space.south, space.west, space.north, space.east]
      // const space = levelMap.map[i][21 - j]
      // const dirs = [space.north, space.west, space.south, space.east]

      for (let k = 0; k < 4; k++) {
        // console.log(k, dirs[k]);
        if (dirs[k]) {
          elements.push(<Wall key={`${i}-${j}-${k}`} x={i} y={j} dir={k} wtype={dirs[k]} />)
        }
      }
    }
  }

}

export default function Dungeon({ map, level }) {

  console.log(level)

  let elements = []
  createLevel(map, elements)

  return <group>{elements}</group>
}
