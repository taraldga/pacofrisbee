import * as React from 'react'

import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'

const HomeScreen : React.FC = () => {
    return (
        <div>
            <Link to="/create-game">
                <Button variant="contained" color="primary" size="large">Start new round</Button>
            </Link>
            <Link to="/view-games">
                <Button variant="contained" color="primary" size="large">View my games</Button>
            </Link>
        </div>
    );
}


export default HomeScreen