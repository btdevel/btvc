import React, {useRef, useState} from 'react'
import {useFrame} from '@react-three/fiber'
import * as THREE from 'three'
import {Sky as DreiSky, Sphere} from '@react-three/drei'

import PlayerPos from './PlayerPos'
import {gameState} from '../game/GameLogic'
import {clamp} from '../util/math'

import starImg from '../assets/images/textures/star.png'

export function ShaderSky() {
  const sunRef = useRef()
  let sunInitialized = false

  useFrame(() => {

    if (sunRef.current) {
      const [x, y, z] = gameState.sun.position()
      const uniforms = sunRef.current.material.uniforms
      if (!sunInitialized) {
        uniforms.up.value.x = 0
        uniforms.up.value.y = 0
        uniforms.up.value.z = 1

        uniforms['turbidity'].value = 6.9 // 0..10
        uniforms['rayleigh'].value = 0.3 // 0..10
        uniforms['mieCoefficient'].value = 0.001 // 0..0.1
        uniforms['mieDirectionalG'].value = 0.999 // 0..1
        sunInitialized = true
      }
      uniforms.sunPosition.value.x = x
      uniforms.sunPosition.value.y = y
      uniforms.sunPosition.value.z = z

      sunRef.current.material.uniformsNeedUpdate = true
    } else {
      sunInitialized = false
    }
    // todo: does not need to be done very frame, but only when sun position changed significantly
    // same as with Lights.js
  })

  const [x, y, z] = gameState.sun.position()

  return <DreiSky ref={sunRef} distance={10000} sunPosition={[x, y, z]}/>
}


const sunVertexArray=new Float32Array([0, 0, 0])
const sunTexture=new THREE.TextureLoader().load(starImg)

export function Sun({dist = 100, color = "yellow", size = 0.06}) {
  const sunRef = useRef()
  useFrame(() => {
    const spos = gameState.sun.position()
    if (sunRef.current) {
      sunRef.current.position.x = dist * spos[0]
      sunRef.current.position.y = dist * spos[1]
      sunRef.current.position.z = dist * spos[2]
    }
  })

  return (<points ref={sunRef}>
    <bufferGeometry>
      <bufferAttribute
        attach="attributes-position"
        array={sunVertexArray}
        count={1} //
        itemSize={3}
      />
    </bufferGeometry>
    <pointsMaterial
      color={color}
      size={size * dist}
      transparent
      opacity={1.0}
      map={sunTexture}/>
  </points>)
}

function skyColor() {
  const [x, y, z] = gameState.sun.position()
  const r = z / Math.hypot(x, y)
  const f = clamp(2 * r, 0, 1)

  const dayColor = new THREE.Color("#66a9ff")
  const nightColor = new THREE.Color(0.01, 0.01, 0.01)
  const color = nightColor.lerp(dayColor, f)
  color.convertLinearToSRGB()
  return color
}

export function SimpleSky({dist = 100}) {
  const [color, setColor] = useState(skyColor())

  useFrame(() => {
    const newColor = skyColor()
    setColor(newColor)
  })

  return (<>
    <Sphere args={[dist, 8, 8]}>
      <meshBasicMaterial side={THREE.DoubleSide} color={color}/>
    </Sphere>
  </>)
}


export default function Sky({useShader}) {
  if (useShader) return <ShaderSky/>
  return (<PlayerPos>
    <SimpleSky dist={500}/>
    <Sun dist={280} color={"yellow"} size={0.12}/>
  </PlayerPos>)
}