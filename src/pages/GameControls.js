import React, { useEffect, useRef, useState } from 'react'
import { handleKeyDown } from '../game/KeyMap'
import { handleMouseDown, handleMouseMove, handleMouseUp } from '../game/MouseHandling'

export default function GameControls() {
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const [element, setElement] = useState(document)
  // useEffect(() => {
  //   const el = document.getElementById('3dview')
  //   console.log('3DView: ', el)
  //   setElement(el)
  // }, [])

  useEffect(() => {
    console.log("Adding event listener: ", element)
    if (element) {
      const useCapture = false
      element.addEventListener('mousedown', handleMouseDown, useCapture)
      element.addEventListener('mousemove', handleMouseMove, useCapture)
      element.addEventListener('mouseup', handleMouseUp, useCapture)
      element.addEventListener('mouseleave', handleMouseUp, useCapture)
      console.log("Added event listener: ", element)

      return () => {
        element.removeEventListener('mousedown', handleMouseDown)
        element.removeEventListener('mousemove', handleMouseMove)
        element.removeEventListener('mouseup', handleMouseUp)
        element.removeEventListener('mouseleave', handleMouseUp)
      }
    }
  }, [element])
  return <></>
}
