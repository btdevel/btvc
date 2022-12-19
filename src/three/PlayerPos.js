import React, {forwardRef, useImperativeHandle, useRef} from 'react'
import {useFrame, useThree} from '@react-three/fiber'

import {gameState} from '../game/GameLogic'
import {makeVector3} from './util'


function AxesHelper() {
  return (<>
    <axesHelper position={[0, -1, 0]}/>
    <axesHelper position={[0, 1, 0]}/>
    <axesHelper position={[-1, 0, 0]}/>
    <axesHelper position={[1, 0, 0]}/>
  </>)
}

const PlayerPos = forwardRef(function PlayerPos({addHelper, foo, children}, ref) {
  const playerPos = makeVector3([gameState.position.x, gameState.position.y, 0])
  const playerRef = useRef()
  useImperativeHandle(ref, () => playerRef.current)

  const camera = useThree().camera
  useFrame(() => {
    playerPos.set(gameState.position.x, gameState.position.y, 0)
    playerRef.current?.position.copy(camera.position)
  })

  return (<object3D position={playerPos} ref={playerRef}>
    {addHelper && <AxesHelper/>}
    {children}
  </object3D>)
})

export default PlayerPos
