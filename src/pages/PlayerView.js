import React from 'react'
import { Canvas } from 'react-three-fiber'
import { OrbitControls } from 'drei'
import Scene from '../3d/Scene'
import * as THREE from 'three'
import GameControls from '../3d/GameControls'

function PlayerView ({ orbitControls }) {
  return (
    <Canvas
      // shadowMap
      shadowMap={{
        enabled: true,
        type: THREE.PCFSoftShadowMap
      }} 
    >
      <Scene />
      {orbitControls ? <OrbitControls /> : <GameControls />}
    </Canvas>
  )
}

export default PlayerView
