import React from 'react'
import Map, { create2dArray } from './Map'
import { Direction, mod} from './Movement'
import cityMapJsonRaw from '../assets/levels/city.json'
import { setGameText } from './GameLogic'
import { mapTo } from '../util/math'
import cityMapImg from '../assets/images/city/bt1-skara-brae.jpg'


export class CityMap extends Map {
  rows = 30
  columns = 30
  loaded = false
  name = "Skara Brae"
  level = "city"
  map = null

  // type
  // subtype
  // name

  constructor() {
    super()

    this.load()

    // this.subtype = create2dArray(this.rows, this.columns, 0)
    // this.name = create2dArray(this.rows, this.columns, '')
  }

  isCity() {
    return true
  }

  load() {
    this.parseJson(cityMapJsonRaw)
    this.loaded = true
  }

  canMove(old_x, old_y, dir) {
    // console.log("CityMap: ", this)
    const new_x = mod(old_x + Direction.dx[dir], this.columns)
    const new_y = mod(old_y + Direction.dy[dir], this.rows)
    if (this.map[new_x][new_y].type !== 0) {
      if (!this.map[new_x][new_y].actions) {
        return [false, undefined, old_x, old_y]
      }
    }
    return [true, undefined, new_x, new_y]
  }

  showMap(pos, dir) {
    // const x = this.position.x * 10
    // const y = this.position.y * 10

    // Guild at 25,14
    // const x = 200
    // const y = 86
    // Mangar at 2, 24
    // const x = 42
    // const y = 138
    const x = mapTo(pos.x, 2, 25, 42, 200)
    // const y = mapTo(pos.y, 14, 24, 86, 138)
    const y = mapTo(pos.y, 15, 5, 90, 140)
    const arrows = ['\u2191', '\u2190', '\u2193', '\u2192']
    dir = mod(dir, 4)

    setGameText(
      <div style={{ width: '100%', height: '100%' }}>
        <img height='100%' width='100%' src={cityMapImg} alt="Map of Skara Brae" />
        <div style={{ fontSize: 12, fontWeight: 'bold', fontFamily: 'sans', color: 'red', position: 'absolute', left: x, top: y }}>{arrows[dir]}</div>
      </div>
    )
  }


  parseJson(cityMapJsonRaw) {
    this.rows = cityMapJsonRaw.pattern[0].length
    this.columns = cityMapJsonRaw.pattern[0].length
    this.map = create2dArray(this.rows, this.columns, {})

    const elem = {}
    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
        const type = getHouseType(cityMapJsonRaw.pattern[this.rows - j - 1][i])
        const elem = { type }
        this.map[i][j] = elem
      }
    }
  }

}



function getHouseType(jsonType) {
  switch (jsonType) {
    case '00': // street, none
      return 0
    case '01': // house1
      return 1
    case '02': // house2
      return 2
    case '03': // house3
      return 3
    case '04': // house4
      return 4
    case '0B': // guild (house3)
      return 5
    case '12': // tavern (house2)
      return 6
    case '1C': // shop (house4)
      return 7
    case '21': // temple (house1)
      return 8
    case '2B': // review_board (house3)
      return 3
    case '60': // statue
      return 0
    case '68': // gate
      return 10
    case '71': // madgod_temple
      return 8
    case '78': // sewer_entrance
      return 0
    case '81': // credits
      return 1
    case '89': // roscoe
      return 1
    case '91': // kylearans_tower
      return 1
    case '9B': // harkyns_castle (house3)
      return 9
    case 'A1': // mangars_tower
      return 1
    case 'A8': // city_gate"
      return 11
  }
  return 0
}