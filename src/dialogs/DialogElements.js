import React from "react";
import {Accordion, Button as RSButton, Modal} from "react-bootstrap";
import styled from "styled-components";


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
`

export function Entries({children, ...params}) {
  return (<Accordion {...params}>{children}</Accordion>)
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