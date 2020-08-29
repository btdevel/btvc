import React from 'react'
import styled from 'styled-components'

const LocationViewBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 4px;
  font-family: 'C64Font';
  color: white;
`

export default function LocationView () {
  return <LocationViewBox style={{textAlign: 'center'}}>Skara Brae</LocationViewBox>
}
