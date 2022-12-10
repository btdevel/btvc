import React, {useRef, useState} from 'react'
import {useFrame} from '@react-three/fiber'
import * as THREE from 'three'
import {Sky as DreiSky, Sphere} from '@react-three/drei'
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

        uniforms['turbidity'].value = 10
        uniforms['rayleigh'].value = 0.5
        uniforms['mieCoefficient'].value = 0.00001
        uniforms['mieDirectionalG'].value = 0.007
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

  return <DreiSky ref={sunRef} distance={1000} sunPosition={[x, y, z]}/>
}

export function Sun({color = "yellow", size = 10}) {
  const sunGeometry = new THREE.BufferGeometry()

  let vertices = new Float32Array(3)
  // let sunVector = new THREE.Vector3(99, 0, 0)
  let sunVector = new THREE.Vector3(0, -100, 0)
  sunVector.toArray(vertices, 0)
  sunGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  // console.log("In Sun")

  let sunMaterial = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    map: new THREE.TextureLoader().load(starImg),
  })

  const sun = new THREE.Points(sunGeometry, sunMaterial)

  useFrame(() => {
    sun.rotation.x = -gameState.sun.latitude
    sun.rotation.z = -gameState.sun.hour_angle()
  })

  return <primitive object={sun}/>
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

export function SimpleSky() {
  const radius = 400
  const widthSegs = 8
  const heightSegs = 8

  const [color, setColor] = useState(skyColor())

  useFrame(() => {
    const newColor = skyColor()
    setColor(newColor)
  })
  console.log("In Simple")


  return (<>
    <Sphere args={[radius, widthSegs, heightSegs]}>
      <meshBasicMaterial side={THREE.DoubleSide} color={color} wireframe={false}
                         fog={false}
      />
    </Sphere>
  </>)
}


export default function Sky({useShader}) {
  return (useShader ? <ShaderSky/> :
    <><SimpleSky/><Sun/></>)
}