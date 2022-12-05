import {Accordion, Button as RSButton, Modal} from "react-bootstrap";
import React from "react";
import styled from "styled-components";

const HelpBox = styled.div`
  width: 640px;
  height: 400px;
  position: absolute;
  left: 0;
  top: 0;
  padding: 50px;
`

export function PopupBox({header, subheader, children, show, close}) {
  return (
    <>
      <Modal show={show} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>
            {header}
            <br/>{subheader}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
      </Modal>
    </>
  );
}

export const Button = styled(RSButton)`
  margin: 10px;
  --bs-btn-padding-y: 0.25rem;
  --bs-btn-padding-x: 0.5rem;
  --bs-btn-font-size: 0.875rem;
  --bs-btn-border-radius: 0.25rem;
`

export function Entries({children}) {
  return (<Accordion alwaysOpen={false} defaultActiveKey={1}>{children}</Accordion>)
}

export function Entry({number, header, children}) {
  return (
    <Accordion.Item eventKey={number}>
      <Accordion.Header>{header}</Accordion.Header>
      <Accordion.Body>{children}</Accordion.Body>
    </Accordion.Item>
  )
}

export function Link({href}) {
  return (<> <a href={href} target="_blank" rel={"noreferrer"}>{href}</a> </>)
}