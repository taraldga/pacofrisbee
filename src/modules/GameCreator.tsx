import * as React from 'react'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'


const GameCreator : React.FC = () => {
    return (
        <div>
            <Link to="/">
                <Button variant="primary" size="lg">Hjem</Button>
            </Link>
        </div>
    );
}


export default GameCreator