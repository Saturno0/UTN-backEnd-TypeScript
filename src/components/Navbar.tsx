import {  useState  } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import '../styles/Navbar.css';
import logo from '../assets/img/logo_creado_250x125_centrado.png';
import type { RootState } from '../hooks/store';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const totalItems = useSelector((state: RootState) => state.cart.totalItems);
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    const handleNavigation = () => {
        if(user.activo) {
            navigate('/profile'); //La idea es que en un futuro pueda acceder a su perfil
        } else {
            navigate('/login');
        }
    }
    
    return(
        <header>
            <nav className="navbar">
                <div className="nav-container">


                    <div className="header-inner flex-row container">
                        <LeftMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} handleNavigation={handleNavigation} user={user} />

                        <div className="logo">
                            <Link to="/">
                                <img src={logo} alt="Logo" id="logo" />
                            </Link>
                        </div>

                        <RightMenu user={user} totalItems={totalItems} handleNavigation={handleNavigation} />
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
