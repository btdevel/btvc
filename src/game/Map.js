export const create2dArray = (rows, columns, defaultVal) =>
  [...Array(rows).keys()].map(() => Array(columns).fill(defaultVal))

export default class Map {
    rows
    columns
    name
    loaded
    name
    level
    map

    constructor() {
    }
}