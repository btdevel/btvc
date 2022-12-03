import React from 'react'
import * as THREE from 'three'
import {Canvas} from '@react-three/fiber'

import Scene from '../3d/Scene'

function PartyView() {
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
    </Canvas>
  )
}

export default PartyView


