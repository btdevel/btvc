import React from 'react'
import { Canvas } from 'react-three-fiber'
import { OrbitControls } from 'drei'
import Scene from '../3d/Scene'
import * as THREE from 'three'

function PlayerView ({ orbitControls }) {
  return (
    <Canvas
      shadowMap
      onCreated={({ gl }) => {
        // gl.toneMapping = THREE.ACESFilmicToneMapping
        // gl.outputEncoding = THREE.sRGBEncoding
      }}
    >
      <Scene />
      {orbitControls && <OrbitControls />}
    </Canvas>
  )
}

export default PlayerView
