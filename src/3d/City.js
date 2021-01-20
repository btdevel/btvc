import React from 'react'
import House from './House'

export default function City({ map }) {
  if (!map) return <></>

  const elements = []

  for (let x = 0; x < map.width; x++) {
    for (let y = 0; y < map.height; y++) {
      const type = map.map[x][y].type
      const dir = map.map[x][y].dir
      if (type !== ' ') {
        elements.push(<House key={[x, y]} x={x} y={y} type={type} dir={dir}/>)
      }
    }
  }

  return <group>{elements}</group>
}
