import React from 'react'
import {Bloom, DepthOfField, EffectComposer, Noise, Vignette, Pixelation} from '@react-three/postprocessing'
import {useGraphicsConfig} from '../game/GameLogic'

// https://github.com/felixturner/bad-tv-shader

export default function Effects({enable = false}) {
  const graphicsConfig = useGraphicsConfig()

  return (
    <>
      {enable && <EffectComposer>
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480}/>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300}/>

        <Noise opacity={0.02}/>
        <Vignette eskil={false} offset={0.1} darkness={1.1}/>
      </EffectComposer>}
      {(graphicsConfig.pixelation > 1) &&
        <EffectComposer>
          <Pixelation granularity={graphicsConfig.pixelation} />
        </EffectComposer>
      }
    </>
  )
}
