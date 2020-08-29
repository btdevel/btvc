import React from 'react'
import styled from 'styled-components'

const PartyViewBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  font-family: 'C64Font';
  color: black;
  background-color: transparent;
`
const CharacterBox = styled.div`
  padding-left: 20px;
  font-family: 'C64Font';
  position: absolute;
  top: ${props => (props.number - 1) * 20 + 4}px;
  background-color: transparent;
  color: black;
  text-shadow: 1px 1px #777;
`
const tabs = {
  number: -16, name: 0, ac: 248, hp: 296, cnd: 384, sp: 456, cls: 520
}
const Attribute = styled.div`
  position: absolute;
  left: ${props => tabs[props.attr]+20}px;
  background-color: transparent;
  text-transform: uppercase;
`

function CharacterDisp({name, ac, hp, cnd, sp, cls}) {
  return (
    <>
      <Attribute attr='name'>{name}</Attribute>
      <Attribute attr='ac'>{ac}</Attribute>
      <Attribute attr='hp'>{hp}</Attribute>
      <Attribute attr='cnd'>{cnd}</Attribute>
      <Attribute attr='sp'>{sp}</Attribute>
      <Attribute attr='cls'>{cls}</Attribute>
    </>
  )
}

export default function LocationView () {
  return <PartyViewBox style={{textAlign: 'center'}}>
    <CharacterBox number={1}>
      <Attribute attr='number'>1</Attribute>
      <CharacterDisp name='GANDALF' ac='lo' hp={300} cnd='old' sp={512} cls='wzd'/>
    </CharacterBox>
  </PartyViewBox>
}
