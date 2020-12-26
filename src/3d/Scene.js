import React from 'react'

import City from './City'
import Dungeon from './Dungeon'
import Lights from './Lights'
import DungeonLights from './DungeonLights'
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
      <DungeonLights />
      <Ground type='dungeon'/>
      <Dungeon level={level} />
    </group>
  )
}

export default function Scene () {
  const level = useStore(state => state.level)

  return level==='city' ? <CityScene /> : <DungeonScene level={level} />
}
