import './NumberInput.css'

import * as React from 'react'

import Button from '@material-ui/core/Button'
import Add from '@material-ui/icons/Add'
import Remove from '@material-ui/icons/Remove'

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
      <p className={`number-input ${isDirty && "dirty-score"}`}>{ value }</p>
      <Button variant="contained" color="primary" onClick={() => onInnerChange(value+1)}><Add /></Button>
    </div>
  )
}

export default NumberInput;