import React from 'react'
import { Canvas } from 'react-three-fiber'
import { ErrorBoundary } from 'react-error-boundary'
import Scene from '../3d/Scene'
import mainImg from '../assets/images/main.png'
import { stepper } from '../game/GameLogic'

function ErrorComponent () {
  return <></>
}

export default function City () {
  return (
    <div style={{ width: 640, height: 400 }}>
      <div
        style={{
          width: 640,
          height: 480,
          position: 'absolute',
          left: 0,
          top: 0
        }}
      >
        <img
          src={mainImg}
          style={{ width: 640, height: 400 }}
          alt='BT1 main screen'
        />
      </div>
      <div
        style={{
          backgroundColor: 'black',
          width: 224,
          height: 176,
          position: 'absolute',
          left: 34,
          top: 30
        }}
      >
        <ErrorBoundary FallbackComponent={ErrorComponent}>
          <Canvas 
            onClick={() => {stepper.setPaused(!stepper.isPaused()); console.log(stepper.getSystemTime(), stepper.isPaused());}}
            onDoubleClick={() => stepper.accelerate(1.5)}
            >
            <Scene />
          </Canvas>
        </ErrorBoundary>
      </div>
    </div>
  )
}
