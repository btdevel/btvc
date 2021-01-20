import React from 'react'
import Map, { create2dArray } from './Map'
import { Direction } from './Movement'
import cityMapJsonRaw from '../assets/levels/city.json'
import { setGameText } from './GameLogic'
import { mapTo, mod } from '../util/math'
import cityMapImg from '../assets/images/city/bt1-skara-brae.jpg'
import { gameState } from './GameLogic'


export class CityMap extends Map {
  width
  height
  loaded = false
  name = "Skara Brae"
  level = "city"
  map = null


  constructor() {
    super()
    this.load()
  }

  isCity() {
    return true
  }

  load() {
    this.parseJson(cityMapJsonRaw)
    this.map[28][5].actions = [["teleport", 0, 0, 0]]
    this.map[18][15].actions = [["teleport", 4, 0, 0]]
    this.map[4][24].actions = [["teleport", 7, 0, 0]]
    this.map[27][27].actions = [["teleport", 10, 0, 0]]
    this.map[2][2].actions = [["teleport", 11, 0, 0]]
    this.loaded = true
  }

  canMove(old_x, old_y, dir) {
    // console.log("CityMap: ", this)
    const new_x = mod(old_x + Direction.dx[dir], this.width)
    const new_y = mod(old_y + Direction.dy[dir], this.height)
    const type = this.map[new_x][new_y].type
    if (type !== ' ' && type !== '#' && type !== 'S') { // empty, gate, statue
      if (!this.map[new_x][new_y].actions) {
        return [false, undefined, old_x, old_y]
      }
    }
    return [true, undefined, new_x, new_y]
  }

  showMap(pos, dir) {
    // Guild at 25,14,  const x = 200, const y = 86
    // Mangar at 2, 24, const x = 42, const y = 138

    const x = mapTo(pos.x, 2, 25, 42, 200)
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

  getLocationInfo() {
    const { x, y } = gameState.position
    const street = this.map[x][y].street
    return `You are on ${street}`
  }


  parseJson(cityMapJsonRaw) {
    const streetNames = cityMapJsonRaw.streetNames

    const types = cityMapJsonRaw.types
    const streets = cityMapJsonRaw.streets
    const dirs = cityMapJsonRaw.dirs
    const rows = types.length
    const columns = types[0].length

    this.width = columns
    this.height = rows
    this.map = create2dArray(this.width, this.height, {})

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const square = {}
        square.type = types[i][j]
        square.dir = dirs[i][j]
        square.street = streetNames[streets[i][j]]

        const x = j, y = rows - 1 - i
        this.map[x][y] = square
      }
    }
  }

}
