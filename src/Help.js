import React, { useState } from 'react';
import {Carousel, Modal, Button, Accordion} from "react-bootstrap";
import styled from 'styled-components'


const HelpBox = styled.div`
  width: 640px;
  height: 400px;
  position: absolute;
  left: 0;
  top: 0;
  padding: 50px;
`

function PopupBox({ header, children, show, close }) {
  return (
    <>
      <Modal show={show} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>{header}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function HelpText() {
  return (
    <>
      Welcome to the BARDS'S TALE VIDEO CHAT CLIENT v0.1<br/>
      Press ? to get location information<br/>
      Use right mouse button to look around<br/>
      Use left mouse button and swiping gestures to move or
      use the keyboard for this (cursor keys or ASDW).
    </>
  )
}

function Entries({children}) {
  return (<Accordion alwaysOpen={false} defaultActiveKey={1}>{children}</Accordion>)
}

function Entry({number, header, children}) {
  return (
  <Accordion.Item eventKey={number}>
    <Accordion.Header ><b>{header}</b></Accordion.Header>
    <Accordion.Body>{children}</Accordion.Body>
  </Accordion.Item>
  )
}

function HelpText2() {
  return (
    <>
      <Entries alwaysOpen={false} defaultActiveKey={1}>
        <Entry number={1} header="Welcome to the BARDS'S TALE VIDEO CHAT CLIENT v0.1">
            Press ? to get location information<br/>
            Use right mouse button to look around<br/>
            Use left mouse button and swiping gestures to move or
            use the keyboard for this (cursor keys or ASDW).
        </Entry>
        <Entry number={2} header="How to setup the video chat">
            Go to agora and get a license<br/>
            Bla bla bla...
        </Entry>
      </Entries>
    </>
  )
}


export default function Help() {
  const [show, setShow] = useState(false);
  const close = () => setShow(false);

  return (
    <>
      {!show &&
        <Button
          onClick={() => setShow(true) }
          id='help-button'
          variant='secondary'
          size='sm'
          style={{margin: '10px'}}
        >
          Show Help
        </Button>
      }
      <PopupBox header='BTVC - Help' show={show} close={close}>
        <HelpText2 />
      </PopupBox>
    </>
  )
}
