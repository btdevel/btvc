import React from 'react'
import cityMapJsonRaw from '../assets/levels/city.json'
import House from './House'

const create2dArray = (rows, columns, defaultVal) =>
  [...Array(rows).keys()].map(() => Array(columns).fill(defaultVal))

class CityMap {
  // 0
  rows = 30
  columns = 30
  type
  subtype
  name

  constructor () {
    this.type = create2dArray(this.rows, this.columns, 0)
    this.subtype = create2dArray(this.rows, this.columns, 0)
    this.name = create2dArray(this.rows, this.columns, '')
    this.parseJson(cityMapJsonRaw)
  }

  parseJson (city) {
    const type = this.type
    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < 30; j++) {
        const field = city.pattern[29 - j][i]
        switch (field) {
          case '00': // street, none
            break
          case '01': // house1
            type[i][j] = 1
            break
          case '02': // house2
            type[i][j] = 2
            break
          case '03': // house3
            type[i][j] = 3
            break
          case '04': // house4
            type[i][j] = 4
            break
          case '0B': // guild (house3)
            type[i][j] = 5 
            break
          case '12': // tavern (house2)
            type[i][j] = 6
            break
          case '1C': // shop (house4)
            type[i][j] = 7
            break
          case '21': // temple (house1)
            type[i][j] = 8 
            break
          case '2B': // review_board (house3)
            type[i][j] = 3
            break
          case '60': // statue
            type[i][j] = 0
            break
          case '68': // gate
            type[i][j] = 0
            break
          case '71': // madgod_temple
            type[i][j] = 8
            break
          case '78': // sewer_entrance
            type[i][j] = 0
            break
          case '81': // credits
            type[i][j] = 1
            break
          case '89': // roscoe
            type[i][j] = 1
            break
          case '91': // kylearans_tower
            type[i][j] = 1
            break
          case '9B': // harkyns_castle (house3)
            type[i][j] = 9
            break
          case 'A1': // mangars_tower
            type[i][j] = 1
            break
          case 'A8': // city_gate"
            type[i][j] = 0
            break
        }
      }
    }
  }
}

const cityMap = new CityMap()

export default function City () {
  // console.log('City', cityMap)

  const elements = []

  for (let i = 0; i < cityMap.columns; i++) {
    for (let j = 0; j < cityMap.rows; j++) {
      const type = cityMap.type[i][j]
      if (type>0) {
        elements.push(<House key={[i,j]} type={type} x={i} y={j} />)
      }
    }
  }

  return <group>{elements}</group>
}
