import React from 'react'
import styled from 'styled-components'

import {useGameText} from '../game/GameLogic'

const TextViewBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 8px;
  font-family: 'EightBit';
  font-size: 10pt;
  overflow: hidden;
  white-space: nowrap;
  line-height: 115%;
`

function getTextWidth(text) {
  // const font = document.getElementById('text-view-box').font
  const font = "10pt EightBit"
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const width = context.measureText(text).width;
  return width
}

export default function TextView() {
  const lines = useGameText()
  const children = lines.map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)
  return <TextViewBox id='text-view-box'>{children}</TextViewBox>
}
