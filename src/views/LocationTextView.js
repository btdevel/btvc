import React from 'react'
import styled from 'styled-components'

import {useLocation} from '../game/GameLogic'

const LocationTextBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  font-family: 'EightBit';
  color: white;
  text-align: center;
`

export default function LocationTextView() {
  const text = useLocation()
  return <LocationTextBox id='location-text'>{text}</LocationTextBox>
}
