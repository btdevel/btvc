import React, { useEffect } from 'react'
import { MeshBasicMaterial } from 'three'
import { loadLevel } from '../game/DungeonMap'
import { useAsync } from '../util/hooks'
import * as THREE from 'three'
// const cityMap = new CityMap()

// const wallGeom = <planeBufferGeometry attach='geometry' />
// const wallMat = <meshBasicMaterial attach='material' color='skyblue' />
const wallGeom = new THREE.PlaneBufferGeometry()
const wallMat = new THREE.MeshBasicMaterial({ color: 'skyblue' })
const doorMat = new THREE.MeshBasicMaterial({ color: 'brown' })
const sdoorMat = new THREE.MeshBasicMaterial({ color: 'red' })
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
  }

  const elems = []
  elems.push(<mesh key={[0, 0]} position={[x, 0, y]} rotation-y={rot} material={materials[wtype]} geometry={wallGeom} />)
  // for (let i = -1; i <= 1; ++i) {
  //   for (let j = -1; j <= 1; ++j) {
  //     elems.push(<mesh key={[i, j]} position={[x + 22 * i, 0, y + 22 * j]} rotation-y={rot} material={wallMat} geometry={wallGeom} />)
  //   }
  // }
  return <group>{elems}</group>
}

function createLevel(levelMap, elements) {
  const rows = levelMap.map.length
  const columns = levelMap.map[0].length

  for (let i = 0; i < columns; ++i) {
    for (let j = 0; j < rows; ++j) {
      // const space = levelMap.map[i][j]
      const space = levelMap.map[j][i]
      if (space.north) {
        elements.push(<Wall key={`${i}-${j}-n`} x={i} y={j} dir={3} wtype={space.north} />)
      }
      if (space.west) {
        elements.push(<Wall key={`${i}-${j}-w`} x={i} y={j} dir={0} wtype={space.west} />)
      }
      if (space.south) {
        elements.push(<Wall key={`${i}-${j}-s`} x={i} y={j} dir={1} wtype={space.south} />)
      }
      if (space.east) {
        elements.push(<Wall key={`${i}-${j}-e`} x={i} y={j} dir={2} wtype={space.east} />)
      }

      // if (type > 0) {
      //   // elements.push(<House key={[i, j]} type={type} x={i} y={j} />)
      // }
    }
  }

}

export default function Dungeon({ levelNum = 0 }) {

  const [level, loading, error] = useAsync(loadLevel, [levelNum])
  if (loading) return <></>

  console.log(level)

  let elements = []
  createLevel(level, elements)

  return <group>{elements}</group>
}
