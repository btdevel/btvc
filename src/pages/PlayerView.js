import React, { useEffect, useRef } from 'react'
import { Canvas } from 'react-three-fiber'
import { OrbitControls } from 'drei'
import Scene from '../3d/Scene'
import * as THREE from 'three'
import GameControls from './GameControls'

function PlayerView({ orbitControls }) {
  return (
    // <div ref={canvasRef}>
      <Canvas
        shadowMap={{
          enabled: true,
          type: THREE.PCFSoftShadowMap
        }}

      >
        <Scene />
        {orbitControls ? <OrbitControls /> : <GameControls />}
      </Canvas>
    // </div>
  )
}

export default PlayerView


