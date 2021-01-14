import React from 'react'
import House from './House'

export default function City({ map }) {
  if (!map) return <></>

  const elements = []

  for (let i = 0; i < map.columns; i++) {
    for (let j = 0; j < map.rows; j++) {
      const type = map.map[i][j].type
      if (type>0) {
        elements.push(<House key={[i,j]} type={type} x={i} y={j} />)
      }
    }
  }

  return <group>{elements}</group>
}
