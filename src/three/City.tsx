import React from 'react'

import House from './House'
import {createLevel} from "./LevelBase"
import {useAudioConfig, useVideoConfig} from "../game/GameLogic"

function createHouse(elements, x, y, square) {
  const type = square.type
  const dir = square.dir
  if (type !== ' ') {
    elements.push(<House key={[x, y]} x={x} y={y} type={type} dir={dir}/>)
  }
}

export default function City({map}) {
  const videoEnabled = useVideoConfig((videoConfig) => videoConfig.enabled)
  const audioEnabled = useAudioConfig((audioConfig) => audioConfig.enabled)

  return <group>{createLevel(map, createHouse, videoEnabled, audioEnabled)}</group>
}
