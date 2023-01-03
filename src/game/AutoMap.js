import {useEffect, useRef} from 'react'
import {createMap} from './MapBase'

function drawMap(context, map, pos, dir, onlyVisited) {
  // context.fillStyle = '#0000FFFF'
  // context.fillRect(21, 21, 1, 1)

  const rows = map.height
  const columns = map.width

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const square = map.squares[i][j]
      if( onlyVisited && !square.visited ) continue
      if( square.visited ) {
        context.fillStyle = (pos.x==i && pos.y==j) ? '#0000FF' : '#FF000033'
        context.fillRect(i, j, 1, 1)
      }

      const wallTypeInDir = [square.north, square.west, square.south, square.east]
      const addx1 = [0, 0, 0, 1]
      const addx2 = [1, 0, 1, 1]
      const addy1 = [1, 0, 0, 0]
      const addy2 = [1, 1, 0, 1]
      for( let dir = 0; dir<4; dir++ ) {
        context.strokeStyle = "black"
        context.lineWidth = 0.1
        context.beginPath()
        switch( wallTypeInDir[dir] ) {
          case 0:
            break
          case 1: case 3:
            context.moveTo(i + addx1[dir], j+addy1[dir])
            context.lineTo(i + addx2[dir], j+addy2[dir])
            break
          case 2:
            const dx = (addx2[dir] - addx1[dir])/3
            const dy = (addy2[dir] - addy1[dir])/3
            context.moveTo(i + addx1[dir], j+addy1[dir])
            context.lineTo(i + addx1[dir] + dx, j+addy1[dir] + dy)
            context.moveTo(i + addx2[dir] - dx, j+addy2[dir] - dy)
            context.lineTo(i + addx2[dir], j+addy2[dir])
            break
        }
        context.stroke()
      }
    }
  }
}
export default function AutoMap({map, pos, dir, width, height}) {

  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.resetTransform()
    context.translate(0, context.canvas.height)
    context.scale(context.canvas.width / map.width, -context.canvas.height / map.height)
    context.fillStyle = '#00000008'
    context.fillRect(0, 0, width, height)
    drawMap(context, map, pos, dir)
  })

  return <canvas ref={canvasRef} width={width} height={height}/>
}