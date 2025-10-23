import { Link } from "react-router-dom";
import type { UserState } from "../types/types";

interface LeftMenuProps {
     menuOpen: boolean,
     setMenuOpen: (open: boolean) => void,
     handleNavigation: () => void,
     user: UserState
}

const LeftMenu: React.FC<LeftMenuProps> = ({ menuOpen, setMenuOpen, handleNavigation, user }) => {
    return (
        <>
        <div className="menu-icon" id="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
        </div>
        <div className="left-menu">
            <ul className={`nav-links ${menuOpen ? 'open' : ''}`} id="lista">
                <li className="links">
                    <Link to={{
                        pathname: "/",
                        hash: "#products"
                    }}>
                        <h3>Productos</h3>
                    </Link>
                </li>
                <li className="links">
                    <Link to='/newIn'>
                        <h3>Nuevo ingreso</h3>
                    </Link>
                </li>
                <li className="links"><h3>Mas vendidos</h3></li>
                {menuOpen && (
                    <li onClick={() => handleNavigation()}>
                    <h3>{user.activo? `${user.nombre}` : "Acceder"}</h3>
                    </li>
                )}
            </ul>
        </div>
        </>
    );
}

export default LeftMenu;