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
      <ButtonGroup color="primary" variant="contained" aria-label="outlined primary button group">
        <Button>-</Button>
        <TextField variant="outlined"  value="3" />
        <Button color="primary" variant="contained">+</Button>
      </ButtonGroup>
    </div>
  )
}

export default NumberInput;