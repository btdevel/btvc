import Map, { create2dArray } from './Map'
import { Direction, mod} from './Movement'
import cityMapJsonRaw from '../assets/levels/city.json'

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

  load() {
    this.parseJson(cityMapJsonRaw)
    this.loaded = true
  }

  canMove(old_x, old_y, dir) {
    // console.log("CityMap: ", this)
    const new_x = mod(old_x + Direction.dx[dir], this.columns)
    const new_y = mod(old_y + Direction.dy[dir], this.rows)
    if (this.map[new_x][new_y].type !== 0) return [false, undefined, old_x, old_y]
    return [true, undefined, new_x, new_y]
  }


  parseJson(cityMapJsonRaw) {
    this.rows = cityMapJsonRaw.pattern[0].length
    this.columns = cityMapJsonRaw.pattern[0].length
    this.map = create2dArray(this.rows, this.columns, {})

    const elem = {}
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        const type = getHouseType(cityMapJsonRaw.pattern[j][i])
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