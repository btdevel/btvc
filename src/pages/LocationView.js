import React from 'react'
import styled from 'styled-components'

import { useLocation } from '../game/GameLogic'

const LocationViewBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 4px;
  font-family: 'C64Font';
  color: white;
`

export default function LocationView() {
  const text = useLocation()
  return <LocationViewBox style={{textAlign: 'center'}}>{text}</LocationViewBox>
}
