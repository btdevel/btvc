import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import { Sky } from 'drei'
import { useStore, gameState } from '../game/GameLogic'

export default function MySky () {
  const sunRef = useRef()
  const modifyStore = useStore(state => state.modify)

  useFrame(() => {
    const [x, y, z] = gameState.sun.position()
    // if (z > 0.999) {
    //   console.log(sunRef.current)
    // }
    const uniforms = sunRef.current.material.uniforms
    uniforms.sunPosition.value.x = x
    uniforms.sunPosition.value.y = z
    uniforms.sunPosition.value.z = -y

    var effectController = {
      turbidity: 10,
      rayleigh: 0.5,
      mieCoefficient: 0.00001,
      mieDirectionalG: 0.007
    }
    uniforms['turbidity'].value = effectController.turbidity
    uniforms['rayleigh'].value = effectController.rayleigh
    uniforms['mieCoefficient'].value = effectController.mieCoefficient
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG

    sunRef.current.material.uniformsNeedUpdate = true
    // modifyStore(draft => {
    //   draft.overlayText = (<div style={{background: 'rgba(0,0,0,0.5)', width: '30%'}}>
    //     x: {x.toFixed(3)}<br />y: {y.toFixed(3)}<br />z: {z.toFixed(3)}
    //     {/* &phi;: {(degree(phi)%360).toFixed(2)}<br />
    //     &theta;: {degree(theta).toFixed(2)}<br /> */}
    //   </div>)
    // })
  })

  const n = 1
  const [x, y, z] = [0.0, n * 0.1, n * 2]

  return <Sky ref={sunRef} distance={1000} sunPosition={[x, y, z]} />
}
