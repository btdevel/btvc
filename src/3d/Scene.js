import React, { useEffect } from 'react'

import City from './City'
import Lights from './Lights'
import MySky from './MySky'
import Ground from './Ground'
import Camera from './Camera'
import Effects from './Effects'

export default function Scene () {
  return (
    <group>
      <Camera />
      <Lights />
      <MySky />
      <Ground />
      <City />
      <Effects />
    </group>
  )
}
