import React, {useId} from "react"
import RBForm from "react-bootstrap/Form"
import styled from "styled-components"

export const Form = RBForm
function Group({children}) {
  const id = useId()
  return (
    <Form.Group className="mb-3" controlId={id}>
      {children}
    </Form.Group>
  )
}

Form.Check = styled(Form.Check)`
  input {
    border: 2px solid var(--amiga-wb-color-black);
    border-radius: 0;
    &:focus {
      border: 2px solid var(--amiga-wb-color-black);
      box-shadow: none;
    }
    &:checked: {
      color: var(--amiga-wb-color-black);
      background-color: var(--amiga-wb-color-white);
      border-color: var(--amiga-wb-color-black);
    }
  }
`

export function Checkbox({label, value, onChange}) {
  return (
    <Group>
      <Form.Check type="checkbox" label={label} checked={value} onChange={ev => onChange(ev.target.checked)}/>
    </Group>
  )
}

Form.Control = styled(Form.Control)`
  border: 2px solid var(--amiga-wb-color-black);
  border-radius: 0;
  &:focus{
    border: 2px solid var(--amiga-wb-color-black);
    box-shadow: none;
  }
`
Form.Text = styled(Form.Text)`
  margin-left: 1rem;
`
export function TextInput({label, placeholder, value, onChange, comment}) {
  return (
    <Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control type="text" placeholder={placeholder} value={value} onChange={ev => onChange(ev.target.value)}/>
      {comment && <Form.Text className="text-muted">{comment}</Form.Text>}
    </Group>
  )
}

export function NumberInput({label, placeholder, value, onChange, comment}) {
  return (
    <Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control type="number" placeholder={placeholder} value={value} onChange={ev => onChange(ev.target.value)}/>
      {comment && <Form.Text className="text-muted">{comment}</Form.Text>}
    </Group>
  )
}
export function RangeInput({label, placeholder, value, onChange, comment, ...props}) {
  return (
    <Group>
      <Form.Label>{label}</Form.Label>
      <Form.Range value={value} tooltip="on" {...props} onChange={ev => onChange(ev.target.value)}/>
      {comment && <Form.Text className="text-muted">{comment}</Form.Text>}
    </Group>
  )
}