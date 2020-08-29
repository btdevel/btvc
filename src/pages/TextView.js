import React from 'react'
import styled from 'styled-components'

const TextViewBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 8px;
  font-family: 'C64Font';
`

export default function TextView () {
  return <TextViewBox>
    Welcome to Skara Brae!
  </TextViewBox>
}
