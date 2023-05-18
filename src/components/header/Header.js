import './HeaderStyle.css';
import { Link } from 'react-router-dom';
import userIcon from '../../res/icons/user-icon.png';

export default function Headers() {
    return (
        <div id="Header">
            <div id='header-layer1'>
                <a href='/'>
                    <h1>
                        IDK
                    </h1>
                </a>
                <Link id='header-login-btn' to='/login'>
                    <img src={userIcon} />
                </Link>
            </div>
            {/* <div id='header-layer2'>
                <div className='categ'>HOME</div>
                <div className='categ'>GLOBAL</div>
                <div className='categ'>FRIENDS</div>
            </div> */}
        </div>
    )
}