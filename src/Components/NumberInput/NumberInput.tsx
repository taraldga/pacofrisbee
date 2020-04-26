import * as React from 'react'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import './NumberInput.css'


export interface NumberInputProps {
  value: number;
  onChange: (newValue: number) => void;
}

const NumberInput : React.FC<NumberInputProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="col-sm">
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <Button variant="outline-secondary" onClick={() => onChange(value-1)}>-</Button>
        </InputGroup.Prepend>
      <FormControl  className="number-input" aria-describedby="basic-addon1" value={value} onChange={(e) => onChange(e.target.value.length > 0 ? parseInt(e.target.value): 0)} />
      <InputGroup.Append>
        <Button variant="outline-secondary" onClick={() => onChange(value+1)}>+</Button>
      </InputGroup.Append>
    </InputGroup>
    </div>
  )
}

export default NumberInput;