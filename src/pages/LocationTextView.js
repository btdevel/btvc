import React from 'react'
import styled from 'styled-components'

import { useLocation } from '../game/GameLogic'

const LocationTextBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 4px;
  font-family: 'C64Font';
  color: white;
`

export default function LocationTextView() {
  const text = useLocation()
  return <LocationTextBox id='location-text' style={{textAlign: 'center'}}>{text}</LocationTextBox>
}
