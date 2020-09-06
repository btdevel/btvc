import React, { useEffect } from 'react'
import { handleKeyDown } from '../game/KeyMap'
import { handleMouseDown, handleMouseMove, handleMouseUp } from '../game/MouseHandling'

export default function GameControls () {
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false)
    document.addEventListener('mousedown', handleMouseDown, false)
    document.addEventListener('mousemove', handleMouseMove, false)
    document.addEventListener('mouseup', handleMouseUp, false)
    document.addEventListener('mouseleave', handleMouseUp, false)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseUp)
    }
  }, [])
  return <></>
}
