import React from 'react'
import * as THREE from 'three'
import {Canvas} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei'

import Scene from '../3d/Scene'
import GameControls from '../controls/GameControls'
import {useOrbitcontrols} from '../game/GameLogic'

function PartyView() {
  const orbitControls = useOrbitcontrols()

  return (
    <Canvas
      shadows={{
        enabled: true,
        type: THREE.PCFShadowMap
      }}
      gl={{
        toneMapping: THREE.NoToneMapping,
        outputEncoding: THREE.LinearEncoding,
      }}
    >
      <Scene/>
      {orbitControls ? <OrbitControls/> : <GameControls/>}
    </Canvas>
  )
}

export default PartyView


