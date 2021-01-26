import React from 'react'
import House from './House'
import { createLevel } from './Dungeon'

function createHouse(elements, x, y, square) {
  const type = square.type
  const dir = square.dir
  if (type !== ' ') {
    elements.push(<House key={[x, y]} x={x} y={y} type={type} dir={dir} />)
  }
}


export default function City({ map }) {
  return <group>{createLevel(map, createHouse)}</group>
}
