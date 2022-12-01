import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import GameControls from './GameControls'
import Scene from '../3d/Scene'
import * as THREE from 'three'
import { useOrbitcontrols } from '../game/GameLogic'

function PlayerView() {
  const orbitControls = useOrbitcontrols()

  return (
    <Canvas
      // todo: need to reenable this...
      // shadowMap={{
      //   enabled: true,
      //   type: THREE.PCFSoftShadowMap
      // }}

    >
      <Scene />
      {orbitControls ? <OrbitControls /> : <GameControls />}
    </Canvas>
  )
}

export default PlayerView


