import * as React from 'react'

import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom'

export interface HoleNavigationProps {
  currentHole: number;
  lastHole: number;
  gameId: string;
}

const HoleNavigation: React.FC<HoleNavigationProps> = ({
  currentHole,
  lastHole,
  gameId
}) => {

  return (
    <div className="row center">
      <Link to={`/game/${gameId}/${currentHole-1}`}>
        <Button disabled={currentHole === 1}>Previous</Button>
      </Link>
      <span>{currentHole}</span>
      <Link to={`/game/${gameId}/${currentHole+1}`}>
        <Button disabled={currentHole === 1}>Previous</Button>
      </Link>
    </div>
  )
}


export default HoleNavigation;