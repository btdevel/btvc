import {mod} from '../util/math'

export class Direction {
  static NORTH = 0
  static WEST = 1
  static SOUTH = 2
  static EAST = 3

  static forward = [Direction.NORTH, Direction.WEST, Direction.SOUTH, Direction.EAST]
  static backward = [Direction.SOUTH, Direction.EAST, Direction.NORTH, Direction.WEST]

  static names = ['north', 'west', 'south', 'east']

  static dx = [0, -1, 0, 1]
  static dy = [1, 0, -1, 0]

  static normalize = normalizeDir
}

export function getDirName(dir) {
  return Direction.names[normalizeDir(dir)]
}

export function normalizeDir(dir, forward = true) {
  dir = mod(dir, 4)
  return forward ? dir : Direction.backward[dir]
}
export function moveDir(t, dir, isXDir, map_size) {
  const delta = isXDir ? Direction.dx[dir] : Direction.dy[dir]
  return mod(t + delta, map_size)
}
