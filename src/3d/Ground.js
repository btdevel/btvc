import React from 'react'

export default function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeBufferGeometry attach='geometry' two args={[1000, 1000, 1, 1]} />
      <meshStandardMaterial attach='material' color={'#503000'} />
    </mesh>
  )
}
