import {useEffect, useRef, useState} from 'react'
import {createMap} from './MapBase'
import styled from 'styled-components'
import {clamp} from '../util/math'
import {addEventListeners} from '../util/event'

function drawIcon(context, pos, icon, color, scale = 0.5, dir = 0) {
  const oldTransform = context.getTransform()
  context.fillStyle = color
  context.translate(pos.x + 0.5, pos.y + 0.5)
  context.scale(scale, scale)
  context.rotate(dir * Math.PI / 2)
  context.fill(icon)
  context.setTransform(oldTransform)
}

function drawMap(context, map, pos, dir, onlyVisited) {
  const rows = map.height
  const columns = map.width

  let playerIcon = new Path2D("M -1 -1 L 0 1 L 1 -1 Z")
  let stairsUpIcon = new Path2D("M -1 -1 L 1 1 L 1 -1 Z")
  let stairsDownIcon = new Path2D("M -1 -1 L -1 1 L 1 -1 Z")

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const square = map.squares[i][j]
      const info = square.info
      if (onlyVisited && !info.visited) continue

      //console.log( square)
      //console.log( info)

      if (info.visited) {
        context.fillStyle = '#FF000022'
        context.fillRect(i, j, 1, 1)
      }

      if (info.stairsUp) {
        drawIcon(context, {x: i, y: j}, stairsUpIcon, 'grey', 0.32)
      } else if (info.stairsDown) {
        drawIcon(context, {x: i, y: j}, stairsDownIcon, 'grey', 0.32)
      } else if (info.texts.length > 0) {
        context.fillStyle = '#00FF0066'
        context.fillRect(i, j, 1, 1)
      }

      const wallTypeInDir = [square.north, square.west, square.south, square.east]
      const d = 0.04
      const addX1 = [0, d, 0, 1 - d]
      const addX2 = [1, d, 1, 1 - d]
      const addY1 = [1 - d, 0, d, 0]
      const addY2 = [1 - d, 1, d, 1]
      for (let dir = 0; dir < 4; dir++) {
        context.strokeStyle = "black"
        context.lineWidth = 0.1
        context.beginPath()
        switch (wallTypeInDir[dir]) {
          case 0:
            break
          case 3:
            context.strokeStyle = "orange"
          case 1:
            context.moveTo(i + addX1[dir], j + addY1[dir])
            context.lineTo(i + addX2[dir], j + addY2[dir])
            break
          case 2:
            const dx = (addX2[dir] - addX1[dir]) / 3
            const dy = (addY2[dir] - addY1[dir]) / 3
            context.moveTo(i + addX1[dir], j + addY1[dir])
            context.lineTo(i + addX1[dir] + dx, j + addY1[dir] + dy)
            context.moveTo(i + addX2[dir] - dx, j + addY2[dir] - dy)
            context.lineTo(i + addX2[dir], j + addY2[dir])
            break
        }
        context.stroke()
      }
    }
  }

  drawIcon(context, pos, playerIcon, '#0000FFBB', 0.35, dir)
}

const TextBox = styled.div`
  font-size: 8px;
  white-space: normal;
  line-height: normal;
`

export default function AutoMap({map, pos, dir, width, height}) {
  const canvasRef = useRef()
  const [text, setText] = useState("")

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.resetTransform()
    context.translate(0, context.canvas.height)
    context.scale(context.canvas.width / map.width, -context.canvas.height / map.height)
    context.fillStyle = '#DDD'
    context.fillRect(0, 0, width, height)
    drawMap(context, map, pos, dir)
  })

  useEffect(() => {
    setText(<p>{map.fullName}</p>)
    const mouseMoved = (ev) => {
      const scaleX = canvasRef.current.width / map.width
      const scaleY = canvasRef.current.height / map.height
      const x = clamp(Math.floor(ev.offsetX / scaleX), 0, map.width-1)
      const y = clamp(Math.floor(map.height - ev.offsetY / scaleY), 0, map.height-1)
      const info = map.squares[x][y].info
      const texts = info.texts.map((s, i) => <p key={i}>{s}</p>)
      setText([<p key="fullname">{map.fullName}<br/>{x}E {y}N</p>, ...texts])
    }
    if (canvasRef.current) {
      return addEventListeners(canvasRef.current, ["mousemove", "click", "touchmove", "touchend"], mouseMoved)
    }
  }, [map, canvasRef.current])

  return (<>
    <canvas ref={canvasRef} width={width} height={height}/>
    <TextBox style={{left: width + 12, top: 8, width: "72px", height: height, position: "absolute"}}>
      {text}
    </TextBox>
  </>)
}