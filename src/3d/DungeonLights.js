import React, { useRef } from 'react'

export default function DungeonLights () {
  const ambientRef = useRef()

  const color = 0xffffff
  const intensity = 0.5
  return (
    <>
      <ambientLight args={[color, intensity]} ref={ambientRef} />
    </>
  )
}
