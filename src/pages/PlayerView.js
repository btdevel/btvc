import React from 'react'
import { Canvas } from 'react-three-fiber'
import { OrbitControls } from 'drei'
import GameControls from './GameControls'
import Scene from '../3d/Scene'
import * as THREE from 'three'
import { useOrbitcontrols } from '../game/GameLogic'

function PlayerView() {
  const orbitControls = useOrbitcontrols()

  return (
    <Canvas
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


