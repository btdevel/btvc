import React from 'react'
import styled from 'styled-components'

const PartyRoasterViewBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  font-family: 'C64Font';
  color: black;
  background-color: transparent;
`
const CharacterLineBox = styled.div`
  padding-left: 20px;
  font-family: 'C64Font';
  position: absolute;
  top: ${props => (props.number - 1) * 20 + 4}px;
  background-color: transparent;
  color: black;
  text-shadow: 1px 1px #777;
`
const attrInfo = {
  number: { pos: -62, type: 'num' },
  name: { pos: 4, type: 'upp' },
  ac: { pos: 220, type: 'num' },
  hp: { pos: 300, type: 'num' },
  cnd: { pos: 374, type: 'num' },
  sp: { pos: 456, type: 'num' },
  cls: { pos: 534, type: 'cap' },
}
const Attribute = styled.div`
  position: absolute;
  left: ${props => attrInfo[props.attr].pos + 20}px;
  width: 60px;
  text-align: ${props =>
    attrInfo[props.attr].type === 'num' ? 'right' : 'left'};
  background-color: transparent;
  text-transform: ${props =>
    attrInfo[props.attr].type === 'cap' ? 'capitalize' : 'uppercase'};
  ...extra;
`

function CharacterLineDisplay ({ number, name, ac, hp, cnd, sp, cls }) {
  const id = `character-${number}`
  return (
    <CharacterLineBox number={number} id={id}>
      <Attribute attr='number'>{number}</Attribute>
      <Attribute attr='name'>{name}</Attribute>
      <Attribute attr='ac'>{ac}</Attribute>
      <Attribute attr='hp'>{hp}</Attribute>
      <Attribute attr='cnd'>{cnd}</Attribute>
      <Attribute attr='sp'>{sp}</Attribute>
      <Attribute attr='cls'>{cls}</Attribute>
    </CharacterLineBox>
  )
}

export default function LocationView () {
  return (
    <PartyRoasterViewBox id='party-roaster-box' style={{ textAlign: 'center' }}>
      <CharacterLineDisplay
        number={1}
        name='Gimli'
        ac='lo'
        hp={320}
        cnd='210'
        sp={0}
        cls='wa'
      />
      <CharacterLineDisplay
        number={2}
        name='Bilbo'
        ac='-5'
        hp={120}
        cnd='8'
        sp={0}
        cls='th'
      />
      <CharacterLineDisplay
        number={3}
        name='Gandalf'
        ac='3'
        hp={98}
        cnd='old'
        sp={512}
        cls='wi'
      />
    </PartyRoasterViewBox>
  )
}
