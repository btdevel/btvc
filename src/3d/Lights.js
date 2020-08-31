import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { gameState } from '../game/GameLogic'
import * as THREE from 'three'

const Light = () => {
  //Create a PointLight and turn on shadows for the light
  const light = new THREE.DirectionalLight(0xffffff, 1, 100)
  const n=100
  light.position.set(n, n, n)
  // light.position.set(1, 1, 1)
  light.castShadow = true // default false
  //Set up shadow properties for the light
  light.shadow.mapSize.width = 5120 // default
  light.shadow.mapSize.height = 5120 // default
  light.shadow.camera.near = 0.1 // default
  light.shadow.camera.far = 500 // default
  light.shadow.camera.top = -100 // default
  light.shadow.camera.right = 100 // default
  light.shadow.camera.left = -100 // default
  light.shadow.camera.bottom = 100 // default
  return <primitive object={light} />
}


export default function Lights () {
  const ambientRef = useRef()
  const sunRef = useRef()

  const t = useThree()
  const renderer = t.gl
  // console.log('TTT: ', t);

  useEffect(() => {
    if (renderer) {
      console.log('SETTING SHADOWS');
      // renderer.shadowMap.enabled = true
      // renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap
    }

    // const light = sunRef.current
    // light.shadow.mapSize.width = 512 // default
    // light.shadow.mapSize.height = 512 // default
    // light.shadow.camera.near = 0.5 // default
    // light.shadow.camera.far = 500 // default
  }, [renderer])

  useFrame(() => {
    if(false){
    const theta = gameState.sun.elevation()
    const [x, y, z] = gameState.sun.position()

    const intensity = Math.min(0.9, Math.max(theta, 0.1))
    ambientRef.current.intensity = 0.5 * intensity

    sunRef.current.position.x = 10*x
    sunRef.current.position.y = 10*z
    sunRef.current.position.z = 10*(-y)
    sunRef.current.intensity = 0.7 * intensity}

    //Math.min(0.9, Math.max(0, theta + 0.2) + 0.15) // 0.5 * (1 + Math.cos(phi) + 0.4)
  })

  const color = 0xffffff
  const intensity = 0.5
  return (
    <>
      <ambientLight args={[color, 0.5*intensity]} ref={ambientRef} />
      {/* <directionalLight position={[1, 1, 1]} castShadow ref={sunRef} /> */}
      {/* <directionalLight position={[1, 1, 2]} castShadow /> */}
      <Light />
    </>
  )
}
