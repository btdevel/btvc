import React from 'react'

import City from './City'
import Dungeon from './Dungeon'
import Lights from './Lights'
import DungeonLights from './DungeonLights'
import Sky from './Sky'
import Ground from './Ground'
import Camera from './Camera'
import Effects from './Effects'
import Stars from './Stars'
import {useGraphicsConfig, useMap} from '../game/GameLogic'

export default function Scene() {
  const map = useMap() // get the map and pass it on to city or dungeon
  const config = useGraphicsConfig()

  if (!map) {
    return <></>
  } else if (map.isCity()) {
    return (<>
      <Camera key={map.level}/>
      <Lights shadows={config.shadows.enabled} shadowMapSize={config.shadows.shadowMapSize}/>
      {config.sky.enabled && <Sky/>}
      {config.stars.enabled &&
        <Stars size={1.1} sprite={true} color='lightyellow' number={config.stars.count} box={400}/>}
      <Ground type="city"/>
      <City map={map}/>
      <Effects/>
    </>)
  } else {
    return (<>
      <Camera key={map.level}/>
      <DungeonLights map={map}/>
      <Ground type="dungeon"/>
      <Dungeon map={map}/>
      <Effects/>
    </>)
  }

}
