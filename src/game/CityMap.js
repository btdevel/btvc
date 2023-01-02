import React from 'react'

import MapBase, {createMap} from './MapBase'
import {gameState, setGameText} from './GameLogic'
import {mapTo, mod} from '../util/math'

import cityMapJsonRaw from '../assets/levels/city.json'
import cityMapImg from '../assets/images/city/bt1-skara-brae.jpg'


export class CityMap extends MapBase {
  width
  height
  loaded = false
  name = "Skara Brae"
  level = "city"
  squares = null


  constructor() {
    super()
    this.load()
  }

  isCity() {
    return true
  }

  async loadRawMap() {
    return cityMapJsonRaw
  }

  transformSquares() {
    const streetNames = cityMapJsonRaw.streetNames

    const types = cityMapJsonRaw.types
    const streets = cityMapJsonRaw.streets
    const dirs = cityMapJsonRaw.dirs
    const rows = types.length
    const columns = types[0].length

    this.width = columns
    this.height = rows
    this.squares = createMap(this.width, this.height, {})

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const square = {}
        square.type = types[i][j]
        square.dir = dirs[i][j]
        square.street = streetNames[streets[i][j]]
        if (['1', '2', '3', '4'].includes(square.type)) {
          square.actions = [['program', 'emptyHouse']]
        }

        const x = j, y = rows - 1 - i
        this.squares[x][y] = square
      }
    }

    // this.squares[28][5].actions = [["teleport", 0, 0, 0]]
  }

  canMove(old_x, old_y, dir, new_x, new_y) {
    // console.log("CityMap: ", this)
    const type = this.squares[new_x][new_y].type
    if (type !== ' ' && type !== '#' && type !== 'S') { // empty, gate, statue
      if (!this.squares[new_x][new_y].actions) {
        return [false, undefined]
      }
    }
    return [true, undefined]
  }

  showMap(pos, dir) {
    // Guild at 25,14,  const x = 200, const y = 86
    // Mangar at 2, 24, const x = 42, const y = 138

    const x = mapTo(pos.x, 2, 25, 42, 200)
    const y = mapTo(pos.y, 15, 5, 90, 140)
    const arrows = ['\u2191', '\u2190', '\u2193', '\u2192']
    dir = mod(dir, 4)

    setGameText([
      <div style={{width: '100%', height: '100%'}}>
        <img height='100%' width='100%' src={cityMapImg} alt="MapBase of Skara Brae"/>
        <div style={{
          fontSize: 12,
          fontWeight: 'bold',
          fontFamily: 'sans',
          color: 'red',
          position: 'absolute',
          left: x,
          top: y
        }}>{arrows[dir]}</div>
      </div>
    ])
  }

  getLocationInfo() {
    const {x, y} = gameState.position
    const street = this.squares[x][y].street
    return `You are on ${street}`
  }


}
