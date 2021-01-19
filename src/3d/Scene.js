import React, { useEffect, useRef } from 'react'

import City from './City'
import Dungeon from './Dungeon'
import Lights from './Lights'
import DungeonLights from './DungeonLights'
import MySky from './MySky'
import Ground from './Ground'
import Camera, { addAudio } from './Camera'
import Effects from './Effects'
import MyStars from './MyStars'
import { useMap } from '../game/GameLogic'
import Audio from './Audio'

export default function Scene() {
  const map = useMap() // get the map and pass it on to city or dungeon
  if (!map) return <></>
  const isCity = map.isCity()

  return (
    <>
      <Camera key={map.level} />
      {isCity ? <Lights /> : <DungeonLights map={map} />}
      {isCity && <MySky />}
      {isCity && <MyStars size={1.1} sprite={true} color='lightyellow' number={1000} box={400} />}
      <Ground type={isCity ? "city" : "dungeon"} />
      {isCity ? <City map={map} /> : <Dungeon map={map} />}
      <Effects />

      {/* <Audio ambient url='https://file-examples-com.github.io/uploads/2017/11/file_example_OOG_1MG.ogg'/> */}
      {/* <AmbientAudio url={advSound} /> */}

      {/* <fog attach="fog" args={['#AAAAAA', 0.01, 1]} /> */}
      {/* <primitive attach='fog' object={new THREE.Fog(0xb6c1c5, 0.01, 1)} /> */}
      {/* <primitive attach='fog' object={new THREE.Fog(0xb6c1c5, 0.01, 20)} /> */}
      {/* <primitive attach='fog' object={new THREE.FogExp2('#AAAAAA', 1)} /> */}
    </>)

  // return level === 'city' ? <CityScene /> : <DungeonScene level={level} />
}
