import React from 'react'
import styled from 'styled-components'
import { useGameText } from '../game/GameLogic'

const TextViewBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 8px;
  font-family: 'C64Font';
`

export default function TextView() {
  const text = useGameText();
  if (typeof text === "string") {
    const lines = text.split("\n").map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)
    return <TextViewBox>{lines}</TextViewBox>
  }
  else {
    return <TextViewBox>{text}</TextViewBox>
  }
}
