import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Scene from '../3d/Scene'
import * as THREE from 'three'
import Ground from '../3d/Ground'
import House from '../3d/House'
import City from '../3d/City'

function Plane ({ position }) {
  return (
    <mesh position={position} rotation={[0.5 * Math.PI, 0, 0]} receiveShadow>
      <planeGeometry attach='geometry' args={[100, 100]} />
      <meshStandardMaterial
        attach='material'
        side={THREE.DoubleSide}
        color='#171717'
      />
    </mesh>
  )
}

function Box ({ position }) {
  return (
    <mesh castShadow>
      <boxGeometry attach='geometry' args={[2, 2, 2]} />
      <meshStandardMaterial attach='material' color='#575757' />
    </mesh>
  )
}

// light.shadow.mapSize.width = 512;  // default
// light.shadow.mapSize.height = 512; // default
// light.shadow.camera.near = 0.5;    // default
// light.shadow.camera.far = 500;     // default

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

function PlayerViewTest () {
  const smap = {
    mapSize: {
      width: 4*512,
      height: 4*512
    },
    camera: {
      near: 0.5,
      far: 500
    }
  }
  const ref = useRef()

  return (
    <Canvas shadowMap={smap}>
      {/* <directionalLight intensity={1} position={[30, 30, 50]} castShadow target={ref}/> */}
      <Light />
      <ambientLight intensity={0.3} />-{/* <Plane position={[0, -4, -4]} /> */}
      <Ground />
      {/* <Box position={[-1, 1, 3]} /> */}
      <House type={4} x={10} y={0} forwardRef={ref}/>
      <House type={4} x={11.2} y={1.2} />
      <City />
      <OrbitControls />
    </Canvas>
  )
}

// export default PlayerViewCity
export default PlayerViewTest
