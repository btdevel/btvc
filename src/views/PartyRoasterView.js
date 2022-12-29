import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import zipUrlMSDOS2 from '../assets/data/msdos2.zip'
import zipUrlAmiga from '../assets/data/amiga.zip'

import {importChars} from '../game/Loader/Loader'
import {loadCurrentParty} from '../game/Party'

const PartyRoasterViewBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
`
const CharacterLineBox = styled.div`
  position: absolute;
  top: ${props => (props.number - 1) * 16 + 16}px;
  padding-left: 20px;
  font-family: 'EightBit';
  font-size: 12pt;
  color: black;
  background-color: transparent;
  white-space: nowrap;
`
const attrInfo = {
  number: {pos: -1062, right: true},
  name: {pos: 8},
  ac: {pos: 236, right: true},
  hp: {pos: 316, right: true},
  cnd: {pos: 396, right: true, emph: true },
  sp: {pos: 476, right: true },
  cls: {pos: 552},
}
const Attribute = styled.div`
  position: absolute;
  left: ${props => attrInfo[props.attr].pos}px;
  width: 60px;
  color: ${props => attrInfo[props.attr].emph ? 'white' : 'black'};
  text-align: ${props =>
          attrInfo[props.attr].right ? 'right' : 'left'};
`

function CharacterLineDisplay({number, name, ac, hp, cnd, sp, cls}) {
  const id = `character-${number}`
  return (
    <CharacterLineBox number={number} id={id}>
      <Attribute attr='number'>{number}</Attribute>
      <Attribute attr="name">{name}</Attribute>
      <Attribute attr="ac">{ac}</Attribute>
      <Attribute attr="hp">{hp}</Attribute>
      <Attribute attr="cnd">{cnd}</Attribute>
      <Attribute attr="sp">{sp}</Attribute>
      <Attribute attr="cls">{cls}</Attribute>
    </CharacterLineBox>
  )
}

function PartyRoaster({chars}) {
  const elems = []
  for (let i = 0; i < chars.length; ++i) {
    const char = chars[i]
    console.log("Showing...", char)
    elems.push(
      <CharacterLineDisplay key={i + 1} number={i + 1}
                            name={char.name}
                            ac={char.acName()}
                            hp={char.maxHP}
                            cnd={char.currHP}
                            sp={char.currSP}
                            cls={char.className().substring(0, 2)}
      />,
    )
  }
  return elems // <>{elems}</>
}

async function loadCharsFromZip(setChars) {
  localStorage.clear()
  // await importChars(zipUrlMSDOS)
  await importChars(zipUrlMSDOS2)
  // await importChars(zipUrlMSDOS3)
  await importChars(zipUrlAmiga)

  const chars = loadCurrentParty()
  console.log("Characters loaded", chars)
  setChars(chars)
}

export default function LocationView() {
  const [chars, setChars] = useState([])
  useEffect(() => {
    loadCharsFromZip(setChars)
  }, [setChars])

  return (
    <PartyRoasterViewBox id="party-roaster-box" style={{textAlign: 'center'}}>
      <PartyRoaster chars={chars}/>
    </PartyRoasterViewBox>
  )
}
