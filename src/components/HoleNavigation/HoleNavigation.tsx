import * as React from 'react'
import Button from 'react-bootstrap/Button';

export interface HoleNavigationProps {
  currentHole: number;
  lastHole: number;
  updateCurrentHole: (nextHoleNumber: number) => void;
}

const HoleNavigation: React.FC<HoleNavigationProps> = ({
  currentHole,
  lastHole,
  updateCurrentHole
}) => {

  return (
    <div className="row center">
      <Button disabled={currentHole === 1} onClick={() => updateCurrentHole(currentHole-1)}>Previous</Button>
      <span>{currentHole}</span>
      <Button disabled={currentHole === lastHole } onClick={() => updateCurrentHole(currentHole+1)}>Next</Button>
    </div>
  )
}


export default HoleNavigation;