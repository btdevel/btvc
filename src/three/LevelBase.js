import React from "react";

import Audio from "./Audio";
import VideoScreen from "./VideoScreen";

export function createLevel(map, createSquare, videoEnabled, audioEnabled) {
  if (!map?.squares) return []

  let elements = []
  const width = map.width
  const height = map.height

  for (let x = 0; x < width; ++x) {
    for (let y = 0; y < height; ++y) {
      createSquare(elements, x, y, map.squares[x][y])
    }
  }

  if (videoEnabled && map.videoScreens) {
    for (let video of map.videoScreens) {
      const [[x, y], dir, trackNo, params] = video
      elements.push(<VideoScreen key={`video-${x}-${y}-${dir}`} x={x} y={y} dir={dir} trackNo={trackNo} {...params} />)
    }
  }

  if (audioEnabled && map.audio) {
    for (let audio of map.audio) {
      const [[x, y], song, params] = audio
      elements.push(<Audio key={`audio-${x}-${y}-${song}`} x={x} y={y} song={song} {...params} />)
    }
  }
  return elements
}