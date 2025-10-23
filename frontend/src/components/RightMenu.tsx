import { Link } from "react-router-dom";
import type { UserState } from "../types/types";

interface RightMenuProps {
    user: UserState,
    totalItems: number,
    handleNavigation: () => void
};

const RightMenu: React.FC<RightMenuProps> = ({ user, totalItems, handleNavigation }) => {
    const isAdmin = user.rol === "admin";
    return (
        <>
            <div className="right-menu">
                <ul className="nav-links">
                    <li onClick={() => handleNavigation()}>
                        <h3>{user.activo? `${user.nombre}` : "Acceder"}</h3>
                    </li>
                    {isAdmin && (
                        <li>
                            <Link to="/create-product">
                                <h3>Crear producto</h3>
                            </Link>
                        </li>
                    )}
                    <li>
                        <Link to={{
                            pathname: "/cart",
                            hash: "#"
                        }}>
                            <h3>Carrito({totalItems})</h3>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="cart-icon" id="cart-icon">
                <Link to={{
                    pathname: "/cart",
                    hash: "#"
                }}>
                    <h3>Carrito({totalItems})</h3>
                </Link>
            </div>
        </>
    );
}

export default RightMenu;
