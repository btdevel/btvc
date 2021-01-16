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
import { useMap } from '../game/GameLogic'


export default function Scene() {
  const map = useMap() // get the map and pass it on to city or dungeon
  if (!map) return <></>

  const isCity = map.isCity()

  // console.log(map)
  // console.warn("rerendering scene")

  return (
    <>
      <Camera />
      {isCity ? <Lights /> : <DungeonLights map={map}/>}
      {isCity && <MySky />}
      {isCity && <MyStars size={1.1} sprite={true} color='lightyellow' number={1000} box={400} />}
      <Ground type={isCity ? "city" : "dungeon"}/>
      {isCity ? <City map={map} /> : <Dungeon map={map} />}
      <Effects />
    </>)

  // return level === 'city' ? <CityScene /> : <DungeonScene level={level} />
}
