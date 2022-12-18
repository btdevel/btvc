import React, { useState } from 'react';
import {PopupBox, Button, Entries, Entry, Link} from "./DialogElements";


function HelpText() {
  // todo: read from yaml
  return (
    <>
      <Entries alwaysOpen={false} defaultActiveKey={1}>
        <Entry number={1} header="Welcome">
          Welcome to the one and only Bard's Tale Video Chat client.
          Currently you can move freely inside the city and the dungeons.
          You find the video chat in the Cellars level 1 (head south to the Scarlet Bard).
          There are no monsters yet, and no characters and also stairs and portals don't work yet,
          as that was not the prime focus of this project.
        </Entry>
        <Entry number={2} header="Moving around">
          Use left mouse button and swiping gestures to move or <br/>
          Use the keyboard for this (cursor keys or ASDW) <br/>
          You can also strafe (AD strafe, while QE turn) <br/>
          Click and hold the right mouse button to look around
        </Entry>
        <Entry number={3} header="Special keys">
          Press ? to get location information<br/>
          Use right mouse button to look around<br/>
          Use left mouse button and swiping gestures to move or
          use the keyboard for this (cursor keys or ASDW).
        </Entry>
        <Entry number={4} header="How to setup the video chat">
          Well, it's a bit complicated. Best you get a token from me currently.<br/>
          Go to agora and get a license
        </Entry>
        <Entry number={5} header="Bugs">
          This program was developed by a professional and is thus -by definition-
          bug-free. However, if you messed up and want to blame that on
          the developer of this fine piece of software go to
          <Link href="https://github.com/btdevel/btvc/issues"/> and do so.
        </Entry>
      </Entries>
    </>
  )
}


export default function Help({initialShow = true}) {
  const [show, setShow] = useState(initialShow);
  const close = () => setShow(false);
  const open = () => setShow(true);

  return (
    <>
      <Button onClick={open} variant="info" id='help-button'>Help</Button>
      <PopupBox header="Bards's Tale Video Chat Client" show={show} close={close}>
        <HelpText />
      </PopupBox>
    </>
  )
}
