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


const wallGeom = new THREE.PlaneBufferGeometry()



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
// const sdoorMat = new THREE.MeshBasicMaterial({ color: 'red' })
const sdoorMat = wallMat // It's secret after all...

const colorCeiling = new THREE.Color("rgb(0, 85, 68)")
const floorMat = new THREE.MeshBasicMaterial({ color: colorCeiling })
const ceilMat = new THREE.MeshBasicMaterial({ color: colorCeiling })


const materials = [undefined, wallMat, doorMat, sdoorMat]


function Wall({ x, y, dir, wtype }) {
  switch (dir) {
    case 0: // north
      y += 0.5
      break
    case 1: // west
      x -= 0.5
      break
    case 2: // south
      y -= 0.5
      break
    case 3: // east
      x += 0.5
      break
    default:
      console.error(`Unknown direction: ${dir} ${typeof dir}`)
  }
  const rot = dir * 0.5 * Math.PI

  const elems = []
  elems.push(<mesh key={[0, 0]} position={[x, y, 0]} rotation-order='ZXY' rotation={[Math.PI / 2, 0, rot]} material={materials[wtype]} geometry={wallGeom} />)

  // const repI = 0, repJ = 0;
  // for (let i = -repI; i <= repI; ++i) {
  //   for (let j = -repJ; j <= repJ; ++j) {
  //     elems.push(<mesh key={[i, j]} position={[x + 22 * i, 0, y + 22 * j]} rotation-y={rot} material={materials[wtype]} geometry={wallGeom} />)
  //   }
  // }
  return <group>{elems}</group>
}

function createLevel(map, elements) {
  // console.log("Map: ", map)
  // console.warn("creating level")
  if (!map?.map) return {}

  const columns = map.columns
  const rows = map.rows

  for (let i = 0; i < columns; ++i) {
    for (let j = 0; j < rows; ++j) {
      // const space = map.map[j][i]
      // const dirs = [space.west, space.south, space.east, space.north]
      const space = map.map[i][j]
      const dirs = [space.north, space.west, space.south, space.east]

      for (let k = 0; k < 4; k++) {
        // elements.push(<Wall key={`${i}-${j}-${k}`} x={i} y={j} dir={k} wtype={2} />)
        if (dirs[k]) {
          elements.push(<Wall key={`${i}-${j}-${k}`} x={i} y={j} dir={k} wtype={dirs[k]} />)
        }
      }
    }
  }
}

export default function Dungeon({ map, level }) {

  let elements = []
  createLevel(map, elements)

  return <group>{elements}</group>
}
