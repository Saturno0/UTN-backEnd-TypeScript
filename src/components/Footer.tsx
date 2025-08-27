import { Link } from "react-router-dom";
import '../styles/Footer.css';
import facebook from '../assets/Icons/facebook-brands-.svg';
import instagram from '../assets/Icons/instagram-brands-.svg';
import twitter from '../assets/Icons/square-twitter-brands-solid.svg';

function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <div className="footer-section">
                    <h2>Navegación</h2>
                    <ul className="footer-links">
                        <Link to="/"> <li>Inicio</li> </Link>
                        <Link to={{
                            pathname: "/",
                            hash: "#products"
                        }}> <li>Productos</li> 
                        </Link>
                        <li>Nuevo Ingreso</li>
                        <li>Más Vendidos</li>
                    </ul>
                </div>
            
                <div className="footer-section">
                    <h2>Ayuda</h2>
                    <ul className="footer-links">
                        <li><a href="#">Preguntas Frecuentes</a></li>
                        <li><a href="#">Envíos y Devoluciones</a></li>
                        <li><a href="#">Métodos de Pago</a></li>
                        <li><a href="#">Términos y Condiciones</a></li>
                    </ul>
                </div>
            
                <div className="contact">
                    <h2>Contacto</h2>
                    <div className="contact-info">
                        <p>¿Tienes alguna pregunta? Contáctanos por correo o completa nuestro formulario.</p>
                        <Link to="/form"> Formulario de Contacto </Link>
                    </div>

                    <p>Redes sociales:</p>
                    <div className="social-media">
                        <a href="#"><img src={facebook} alt="Facebook" /></a>
                        <a href="#"><img src={instagram} alt="Instagram" /></a>
                        <a href="#"><img src={twitter} alt="Twitter" /></a>
                    </div>
                </div>
            </div>
        
            <div className="copyright">
                <p>&copy; 2023 E-commerce. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;