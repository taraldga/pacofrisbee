import './NumberInput.css'

import * as React from 'react'

import Add from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import Remove from '@material-ui/icons/Remove'
import TextField from '@material-ui/core/TextField'

export interface NumberInputProps {
  value: number;
  onChange: (newValue: number) => void;
  isDirty: boolean;
}

const NumberInput : React.FC<NumberInputProps> = ({
  value,
  onChange,
  isDirty
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
    <div className="button-group">
      <Button variant="contained" color="primary" onClick={() => {onInnerChange(value-1)}}><Remove /></Button>
      <TextField disabled className={`number-input ${isDirty && "dirty-score"}`} variant="outlined" value={value} onChange={(e) => onInnerChange(e.target.value.length > 0 ? parseInt(e.target.value): 0)} />
      <Button variant="contained" color="primary" onClick={() => onInnerChange(value+1)}><Add /></Button>
    </div>
  )
}

export default NumberInput;