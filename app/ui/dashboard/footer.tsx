import 'bootstrap/dist/css/bootstrap.min.css';
import "../../ui/style.css";
import "https://kit.fontawesome.com/da7e5caf84.js"


export default function Footer(){
    return(
<footer className="footer">
        <div className="div-conteiner">
            <div className="footer-section izquierda">
                <img src="fotos/image.png" alt="" className="footer-logo"/>
                <p>Radio Empresaria es una emisora online</p>
                <p>creada por la Fundación Pro Buenos Aires</p>
                <p>con el objetivo de acompañar y difundir a pymes</p>
                <p>comercios, emprendedores y</p>
                <p>grandes empresas de nuestra región.</p>
                <div className="redes">
                    <h4>Redes</h4>
                    <ul>
                        <li><a href="https://www.youtube.com/@fprobaires" target="_blank"><i className="fa-brands fa-youtube fa-3x"></i></a></li>
                        <li><a href="https://www.facebook.com/RadioEmpresaria" target="_blank"><i className="fa-brands fa-facebook fa-3x"></i></a></li>
                        <li><a href="#" target="_blank"><i className="fa-brands fa-instagram instagram-gradient"></i></a></li>
                        <li><a href="#" target="_blank"><i className="fa-brands fa-x-twitter fa-3x"></i></a></li>
                        <li><a href="https://t.me/radioempresaria" target="_blank" ><i className="fa-brands fa-telegram fa-3x"></i></a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-brand centro">
                <h4>Secciones</h4>
                <ul className="footer-ul">
                    <li className="footer-ul-li"><a href="categorias/politica.html">Politica</a></li>
                    <li className="footer-ul-li"><a href="#">Economia</a></li>
                    <li className="footer-ul-li"><a href="#">PYMES</a></li>
                    <li className="footer-ul-li"><a href="#">Interes general</a></li>
                </ul>
            </div>
            <div className="footer-section derecha">
                <h4>Contacto</h4>
                <p className="footer-section-p"><i className="fa-solid fa-circle-info fa-2x"></i > Cuit 30-69894716-7</p>
                <p className="footer-section-p"><i className="fa-brands fa-whatsapp fa-2x"></i> 11 4189-9250 </p> 
                <p className="footer-section-p"><i className="fa-solid fa-square-phone fa-2x "></i> 15 5258-0226</p>
                <p className="footer-section-p"><i className="fa-solid fa-envelope fa-2x"></i> info@radioempresaria.cosm.ar</p>
                <p className="footer-section-p"><i className="fa-solid fa-envelope fa-2x"></i> radioempresaria92.5@gmail.com</p>
                <p className="footer-section-p"><i className="fa-solid fa-location-dot fa-2x"></i> Ruta 36 N°1354</p>
                <a href="https://www.linkedin.com/company/fundacion-pro-buenos-aires/?viewAsMember=true" className="footer-a-contacto"><i className="fa-brands fa-linkedin fa-2x"></i> Linkedin</a>
            </div>
        </div>
        <div className="footer-bottom">
            <ul className="footer-bottom-ul">
                <li><a href="">Terminos y condiciones</a></li> 
                <li><a href="">Politica privacidad</a></li>
            </ul>
            <p className="footer-bottom-p">&copy; Copyright 2025 Radio Empresaria. Todos los derechos reservados.</p>
            <p className="footer-bottom-p">&copy; Este sitio fue desarrollado por <a href="contacto.html">Click aqui</a></p>
        </div>
    </footer>
    )
    };