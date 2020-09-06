import React, { useRef, useEffect, forwardRef } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { gameState } from '../game/GameLogic'
import * as THREE from 'three'
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from 'react-postprocessing'

export default function Effects () {
  // const ref = useRef()
  // useFrame(() => {
  //   const theta = gameState.sun.elevation()
  //   let [x, y, z] = gameState.sun.position()
  // })

  return (
    <>
      <EffectComposer>
        {/* <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} /> */}
        {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} /> */}

        {/* <Noise opacity={0.02} /> */}
        {/* <Vignette eskil={false} offset={0.1} darkness={1.1} />         */}
      </EffectComposer>
    </>
  )
}
