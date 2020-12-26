import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import { gameState } from '../game/GameLogic'
import { radians } from '../game/Sun'
import * as THREE from 'three'

export default function Lights () {
  const ambientRef = useRef()
  const sunRef = useRef()
  const targetRef = useRef()
  const clock = useRef(new THREE.Clock(true)).current

  useFrame(() => {
    const theta = gameState.sun.elevation()
    const [x, y, z] = gameState.sun.position()
    const sunPos = new THREE.Vector3(x, y, z)

    const sin = Math.sin(theta)
    const intensity1 = Math.min(0.9, Math.max(2 * sin, 0.1))
    const intensity2 = Math.min(0.9, Math.max(2 * (sin - 0.0001), 0.0))

    if (ambientRef.current) {
      ambientRef.current.intensity = 0.5 * intensity1
    }
    if (sunRef.current) {
      const n = 20
      const mindiff = 0.3
      sunRef.current.intensity = 0.7 * intensity2
      const pos = sunRef.current.position
      const tpos = sunRef.current.target.position
      const lightPos = sunPos.multiplyScalar(n).add(tpos)
      if (lightPos.distanceTo(pos) > mindiff) {
        sunRef.current.position.copy(lightPos)
      }

      if (clock.getElapsedTime() > 2) {
        sunRef.current.position.copy(lightPos)
        // console.log(clock.getElapsedTime(), lightPos);
        clock.start()
      }
    }
  })

  const color = 0xffffff
  const intensity = 0.5
  const w = 20
  const mapSize = 8 * 512
  const debug = false
  return (
    <>
      <ambientLight args={[color, intensity]} ref={ambientRef} />

      <object3D position={[15, 0.0, 15]} ref={targetRef}>
        {debug && <axesHelper />}
      </object3D>
      <directionalLight 
        angle={radians(10)}
        castShadow ref={sunRef} 
        shadow-camera-left={-w}
        shadow-camera-right={w}
        shadow-camera-bottom={-w}
        shadow-camera-top={w}
        shadow-camera-near={0}
        shadow-camera-far={40}
        target={targetRef.current}
        shadow-mapSize-width={mapSize}
        shadow-mapSize-height={mapSize}
      >
        {debug && <axesHelper args={[5]} />}
      </directionalLight>
      {debug && sunRef.current &&
        <cameraHelper args={[sunRef.current.shadow.camera]}>
          <axesHelper args={[5]}/>
        </cameraHelper>
      }
    </>
  )
}

// var gui = new dat.GUI();
// gui.add( light.shadow.camera, 'top' ).min( 1 ).max( 100000 ).onChange( function ( value ) {
//     light.shadow.camera.bottom = -value;
//     light.shadow.camera.left = value;
//     light.shadow.camera.right = -value;
// });
