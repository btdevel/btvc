import React, {useEffect} from 'react'
import {useFrame} from '@react-three/fiber'
import {PerspectiveCamera} from '@react-three/drei'
import {animated, useSpring} from '@react-spring/three'
import * as THREE from 'three'
import {getAudioListener} from './Audio'
import {gameState} from '../game/GameLogic'
import {Quaternion, Vector3} from "three";


export const springConfigMove = {mass: 3, tension: 400, friction: 12.0, clamp: true}
export const springConfigSlide = {mass: 2, tension: 1400, friction: 150}
export const springConfigWobble = {mass: 3, tension: 400, friction: 12.0}

const AnimatedCamera = animated(PerspectiveCamera)

function resumeListener() {
  const audioListener = getAudioListener()
  const context = audioListener.context
  if( context.state === 'suspended') {
    console.log("Resuming audio context...")
    context.resume()
  }
}

export default function Camera() {
  const audioListener = getAudioListener()
  const startPos = gameState.position
  const startAngle = gameState.angle()

  const [{position}, posApi] = useSpring(() => ({
    position: [startPos.x, startPos.y, 0],
    config: springConfigSlide
  }))
  const [{rotationZ, rotationX}, rotApi] = useSpring(() => ({
    rotationZ: startAngle,
    rotationX: Math.PI / 2,
    config: springConfigSlide
  }))

  useFrame(() => {
    const pos = gameState.position
    const angle = gameState.angle()
    const dPhi = gameState.dPhi
    const dTheta = gameState.dTheta
    const z = gameState.flyMode ? 1 : 0

    const immediate = gameState.jumped
    posApi.start({position: [pos.x, pos.y, z], immediate: immediate})
    rotApi.start({rotationZ: angle + dPhi, rotationX: Math.PI / 2 + dTheta, immediate: immediate})
  })

  document.addEventListener('contextmenu', ()=>{
    // console.log(audioListener)
    console.log(audioListener.context)
    console.log(audioListener.context.listener)
    audioListener.updateMatrixWorld()
    const up = audioListener.up
    console.log(up)

    // const _position$1 = /*@__PURE__*/ new Vector3();
    // const _quaternion$1 = /*@__PURE__*/ new Quaternion();
    // const _scale$1 = /*@__PURE__*/ new Vector3();
    // const _orientation$1 = /*@__PURE__*/ new Vector3();
    // audioListener.matrixWorld.decompose( _position$1, _quaternion$1, _scale$1 );
    // up.set( 0, 1, 0 ).applyQuaternion( _quaternion$1 );
    // console.log(up)

    // up.x = 0
    // up.y = 0
    // up.z = 1
    // console.log('Pos', audioListener.context.listener.positionX)
    // const audioCtx = new AudioContext()
    // const audioListener2 = audioCtx.listener
    // console.log(audioCtx)
    // console.log(audioListener2)
    // console.log(audioListener.context.listener.getOrientation())
  })

  useEffect(()=> {
    // We do this here (not in Audio, since here is where we have/need our listener
    // Note, that only mouse and touch events seem to indicate to the typical browsers
    // that the user has interacted with the page, but no keyboard events (sigh)
    const event_types = ['click', 'contextmenu', 'touchstart']
    for( let type of event_types) {
      document.addEventListener(type, resumeListener)
    }
    return () => {
      for( let type of event_types) {
        document.removeEventListener(type, resumeListener)
      }
    }
  })

  return (<AnimatedCamera
      makeDefault
      position={position.to(Array)}
      rotation-x={rotationX}
      rotation-z={rotationZ}
      rotation-order='YZX'
      // fov={120}
      fov={90}
      near={0.01}
      far={550}
      on
    >
      <primitive object={audioListener}/>
    </AnimatedCamera>

  )
}
