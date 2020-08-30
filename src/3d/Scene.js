import React, { useEffect } from 'react'

import { gameState } from '../game/GameLogic'
import { onKeyEvent } from '../game/KeyMap'

import City from './City'
import Lights from './Lights'
import MySky from './MySky'
import Ground from './Ground'
import Camera from './Camera'

export default function Scene () {
  return (
    <group>
      <Camera />
      <Lights />
      <MySky />
      <Ground />
      <City />
    </group>
  )
}
