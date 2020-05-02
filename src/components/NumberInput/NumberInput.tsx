import './NumberInput.css'

import * as React from 'react'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import TextField from '@material-ui/core/TextField'

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
      <ButtonGroup style={{width: 130}} color="primary" variant="contained" aria-label="outlined primary button group">
        <Button onClick={() => {onChange(value-1)}}>-</Button>
        <TextField className="number-input" variant="outlined"  value={value} onChange={(e) => onChange(e.target.value.length > 0 ? parseInt(e.target.value): 0)} />
        <Button onClick={() => onChange(value+1)}>+</Button>
      </ButtonGroup>
    </div>
  )
}

export default NumberInput;