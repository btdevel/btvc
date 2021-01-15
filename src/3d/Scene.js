import React from 'react'

import City from './City'
import Dungeon from './Dungeon'
import Lights from './Lights'
import DungeonLights from './DungeonLights'
import MySky from './MySky'
import Ground from './Ground'
import Camera from './Camera'
import Effects from './Effects'
import MyStars from './MyStars'
import { useLevel, useMap } from '../game/GameLogic'


export default function Scene() {
  const level = useLevel()
  const map = useMap()
  // get the map and pass it on to city or dungeon
  const isCity = level === 'city'

  // console.log(map)
  // console.warn("rerendering scene")

  return (
    <>
      <Camera />
      {isCity ? <Lights /> : <DungeonLights />}
      {isCity && <MySky />}
      {isCity && <MyStars size={1.1} sprite={true} color='lightyellow' number={1000} box={400} />}
      <Ground type={isCity ? "city" : "dungeon"}/>
      {isCity ? <City map={map} /> : <Dungeon map={map} level={level} />}
      <Effects />
    </>)

  // return level === 'city' ? <CityScene /> : <DungeonScene level={level} />
}
