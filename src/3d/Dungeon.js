import React from 'react'
import { loadTextureLinear, makeWallGeometry } from './util'
import * as THREE from 'three'
import VideoScreen from './VideoScreen'

import wallImg from '../assets/images/levels1/dungeon_wall_imp.png'
import doorImg from '../assets/images/levels1/dungeon_door_imp.png'
// import wallImg from '../assets/images/levels1/dungeon_wall.png'
// import doorImg from '../assets/images/levels1/dungeon_door.png'

// const colorCeiling = new THREE.Color("rgb(0, 85, 68)")
const wallMat = new THREE.MeshStandardMaterial({ map: loadTextureLinear(wallImg) })
const doorMat = new THREE.MeshStandardMaterial({ map: loadTextureLinear(doorImg) })
const secretDoorMat = wallMat // It's secret after all...
const materials = [undefined, wallMat, doorMat, secretDoorMat]


const wallGeom = makeWallGeometry()

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

  const walls = []
  const repI = 0, repJ = 0;
  for (let i = -repI; i <= repI; ++i) {
    for (let j = -repJ; j <= repJ; ++j) {
      walls.push(<mesh key={[i, j]} position={[x + 22 * i, y + 22 * j, 0]} rotation-order='ZXY' rotation={[Math.PI / 2, 0, rot]} material={materials[wtype]} geometry={wallGeom} />)
    }
  }
  return <group>{walls}</group>
}

function createLevel(map) {
  if (!map?.map) return []

  let elements = []
  const columns = map.columns
  const rows = map.rows

  for (let i = 0; i < columns; ++i) {
    for (let j = 0; j < rows; ++j) {
      const space = map.map[i][j]
      const dirs = [space.north, space.west, space.south, space.east]

      for (let k = 0; k < 4; k++) {
        if (dirs[k]) {
          elements.push(<Wall key={`${i}-${j}-${k}`} x={i} y={j} dir={k} wtype={dirs[k]} />)
        }
      }
    }
  }

  if (map.videos) {
    for (let video of map.videos) {
      const [[x, y], dir, trackNo, params] = video
      elements.push(<VideoScreen key={`video-${x}-${y}-${dir}`} x={x} y={y} dir={dir} trackNo={trackNo} {...params} />)
    }
  }

  return elements
}

export default function Dungeon({ map }) {
  return <group>{createLevel(map)}</group>
}
