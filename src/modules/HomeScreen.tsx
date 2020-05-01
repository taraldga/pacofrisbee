import * as React from 'react'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'


const HomeScreen : React.FC = () => {
    return (
        <div>
            <Link to="/new-game">
                <Button variant="primary" size="lg">Start ny runde</Button>
            </Link>
        </div>
    );
}


export default HomeScreen