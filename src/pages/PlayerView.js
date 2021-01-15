import React from 'react'
import { Canvas } from 'react-three-fiber'
import { OrbitControls } from 'drei'
import Scene from '../3d/Scene'
import * as THREE from 'three'
import GameControls from '../3d/GameControls'

function PlayerView({ orbitControls }) {

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
      {/* <fog attach="fog" args={['#AAAAAA', 0.01, 1]} /> */}
      {/* <primitive attach='fog' object={new THREE.Fog(0xb6c1c5, 0.01, 1)} /> */}
      {/* <primitive attach='fog' object={new THREE.Fog(0xb6c1c5, 0.01, 20)} /> */}
      {/* <primitive attach='fog' object={new THREE.FogExp2('#AAAAAA', 1)} /> */}

    </Canvas>
  )
}

export default PlayerView
