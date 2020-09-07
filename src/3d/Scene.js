import React, { useEffect } from 'react'

import City from './City'
import Lights from './Lights'
import MySky from './MySky'
import Ground from './Ground'
import Camera from './Camera'
import Effects from './Effects'
import { useStore } from '../game/GameLogic'
import MyStars from './MyStars'

function CityScene () {
  return (
    <group>
      <Camera />
      <Lights />
      <MySky />
      <MyStars size={1.1} sprite={true} color='lightyellow' number={1000} box={400}/>
      <Ground />
      <City />
      <Effects />
    </group>
  )
}

function DungeonScene ({ level }) {
  return (
    <group>
      <Camera />
      <Lights />
      <Ground />
      <MyStars size={1.1} sprite={true} color='lightyellow' number={1000} box={400}/>
    </group>
  )
}

export default function Scene () {
  const level = useStore(state => state.level)

  return level==='city' ? <CityScene /> : <DungeonScene level={level} />
}
