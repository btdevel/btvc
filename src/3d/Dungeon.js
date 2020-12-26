import React from 'react'
import House from './House'
import { CityMap } from '../game/CityMap'

const cityMap = new CityMap()

export default function Dungeon () {
  // console.log('City', cityMap)

  const elements = []

  for (let i = 0; i < cityMap.columns; i++) {
    for (let j = 0; j < cityMap.rows; j++) {
      const type = cityMap.type[i][j]
      if (type > 0) {
        // elements.push(<House key={[i, j]} type={type} x={i} y={j} />)
      }
    }
  }

  return <group>{elements}</group>
}
