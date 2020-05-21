import './NumberInput.css'

import * as React from 'react'

import ButtonGroup from '@material-ui/core/ButtonGroup'
import TextField from '@material-ui/core/TextField'
import { Button } from '@material-ui/core'
import Remove from '@material-ui/icons/Remove'
import Add from '@material-ui/icons/Add'

export interface NumberInputProps {
  value: number;
  onChange: (newValue: number) => void;
}

const NumberInput : React.FC<NumberInputProps> = ({
  value,
  onChange,
}) => {
  const minMax = {min: 1, max: 30}

  const getValidValue = (newVal: number) => {
    let safeValue = newVal;
    if(safeValue > minMax.max) {
      safeValue = minMax.max
    } else if(safeValue < minMax.min) {
      safeValue = minMax.min
    } 
    return safeValue
  } 
  const onInnerChange = (nextValue: number) => {
    const validValue = getValidValue(nextValue)
    onChange(validValue)
  }

  return (
    <div className="col-sm">
      <ButtonGroup className={"button-group"} color="primary" variant="contained" aria-label="outlined primary button group">
        <Button onClick={() => {onInnerChange(value-1)}}><Remove /></Button>
        {/* eslint-disable */}
        <TextField inputProps={{pattern: '\d*'}} className="number-input" variant="outlined" value={value} onChange={(e) => onInnerChange(e.target.value.length > 0 ? parseInt(e.target.value): 0)} />
        <Button onClick={() => onInnerChange(value+1)}><Add /></Button>
      </ButtonGroup>
    </div>
  )
}

export default NumberInput;