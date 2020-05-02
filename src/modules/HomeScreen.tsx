import * as React from 'react'

import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'

const HomeScreen : React.FC = () => {
    return (
        <div>
            <Link to="/create-game">
                <Button variant="contained" color="primary" size="large">Start ny runde</Button>
            </Link>
        </div>
    );
}


export default HomeScreen