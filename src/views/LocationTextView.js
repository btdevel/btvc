import React from 'react'
import styled from 'styled-components'

import {useLocation} from '../game/GameLogic'

const LocationTextBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  font-family: 'EightBit';
  font-size: 10pt;
  padding-top: 2px;
  color: white;
  text-align: center;
`

export default function LocationTextView() {
  const text = useLocation()
  return <LocationTextBox id='location-text'>{text}</LocationTextBox>
}
