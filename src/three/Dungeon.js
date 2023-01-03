import React from 'react'
import * as THREE from 'three'
import {loadTextureLinear, makeWallGeometry} from './util'

import wallImg from '../assets/images/levels1/dungeon_wall_imp.png'
import doorImg from '../assets/images/levels1/dungeon_door_imp.png'
import {createLevel} from "./LevelBase"
import {useAudioConfig, useVideoConfig} from "../game/GameLogic"

const wallMat = new THREE.MeshStandardMaterial({map: loadTextureLinear(wallImg)})
const doorMat = new THREE.MeshStandardMaterial({map: loadTextureLinear(doorImg)})
const secretDoorMat = wallMat // It's secret after all...
const materials = [undefined, wallMat, doorMat, secretDoorMat]


const wallGeom = makeWallGeometry()

function Wall({x, y, dir, wtype}) {
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
  const repI = 1, repJ = 1;
  for (let i = -repI; i <= repI; ++i) {
    for (let j = -repJ; j <= repJ; ++j) {
      walls.push(<mesh key={[i, j]} position={[x + 22 * i, y + 22 * j, 0]} rotation-order='ZXY'
                       rotation={[Math.PI / 2, 0, rot]} material={materials[wtype]} geometry={wallGeom}/>)
    }
  }
  return <group>{walls}</group>
}

function createWalls(elements, x, y, square) {
  const dirs = [square.north, square.west, square.south, square.east]

  for (let k = 0; k < 4; k++) {
    if (dirs[k]) {
      elements.push(<Wall key={`${x}-${y}-${k}`} x={x} y={y} dir={k} wtype={dirs[k]}/>)
    }
  }
}

export default function Dungeon({map}) {
  const videoEnabled = useVideoConfig((videoConfig) => videoConfig.enabled)
  const audioEnabled = useAudioConfig((audioConfig) => audioConfig.enabled)
  return <group>{createLevel(map, createWalls, videoEnabled, audioEnabled)}</group>
}
