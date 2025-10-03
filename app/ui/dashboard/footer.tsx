import "./footer.css";
export default function Footer(){
    return(
<footer className="footer">
        <div className="div-conteiner">
            {/* Tailwind Classes for Layout and Spacing */}
            <div className="footer-section izquierda flex flex-col space-y-2">
                <img src="fotos/image.png" alt="" className="footer-logo"/>
                <p>Radio Empresaria es una emisora online</p>
                <p>creada por la Fundación Pro Buenos Aires</p>
                <p>con el objetivo de acompañar y difundir a pymes</p>
                <p>comercios, emprendedores y</p>
                <p>grandes empresas de nuestra región.</p>
                <div className="redes mt-4">
                    <h4 className="mb-2">Redes</h4>
                    <ul className="flex space-x-4">
                        <li><a href="https://www.youtube.com/@fprobaires" target="_blank"><i className="fa-brands fa-youtube text-3xl"></i></a></li>
                        <li><a href="https://www.facebook.com/RadioEmpresaria" target="_blank"><i className="fa-brands fa-facebook text-3xl"></i></a></li>
                        <li><a href="#" target="_blank"><i className="fa-brands fa-instagram instagram-gradient text-3xl"></i></a></li>
                        <li><a href="#" target="_blank"><i className="fa-brands fa-x-twitter text-3xl"></i></a></li>
                        <li><a href="https://t.me/radioempresaria" target="_blank" ><i className="fa-brands fa-telegram text-3xl"></i></a></li>
                    </ul>
                </div>
            </div>

            {/* Tailwind Classes for Spacing and Alignment */}
            <div className="footer-brand centro">
                <h4 className="mb-3">Secciones</h4>
                <ul className="footer-ul space-y-1">
                    <li className="footer-ul-li"><a href="categorias/politica.html">Politica</a></li>
                    <li className="footer-ul-li"><a href="#">Economia</a></li>
                    <li className="footer-ul-li"><a href="#">PYMES</a></li>
                    <li className="footer-ul-li"><a href="#">Interes general</a></li>
                </ul>
            </div>

            {/* Tailwind Classes for Layout and Spacing */}
            <div className="footer-section derecha flex flex-col space-y-2">
                <h4 className="mb-3">Contacto</h4>
                <p className="footer-section-p flex items-center space-x-2"><i className="fa-solid fa-circle-info text-2xl"></i > <span>Cuit 30-69894716-7</span></p>
                <p className="footer-section-p flex items-center space-x-2"><i className="fa-brands fa-whatsapp text-2xl"></i> <span>11 4189-9250</span></p>
                <p className="footer-section-p flex items-center space-x-2"><i className="fa-solid fa-square-phone text-2xl"></i> <span>15 5258-0226</span></p>
                <p className="footer-section-p flex items-center space-x-2"><i className="fa-solid fa-envelope text-2xl"></i> <span>info@radioempresaria.cosm.ar</span></p>
                <p className="footer-section-p flex items-center space-x-2"><i className="fa-solid fa-envelope text-2xl"></i> <span>radioempresaria92.5@gmail.com</span></p>
                <p className="footer-section-p flex items-center space-x-2"><i className="fa-solid fa-location-dot text-2xl"></i> <span>Ruta 36 N°1354</span></p>
                <a href="https://www.linkedin.com/company/fundacion-pro-buenos-aires/?viewAsMember=true" className="footer-a-contacto flex items-center space-x-2 mt-2"><i className="fa-brands fa-linkedin text-2xl"></i> <span>Linkedin</span></a>
            </div>
        </div>

        {/* Tailwind Classes for Layout and Spacing */}
        <div className="footer-bottom flex flex-col md:flex-row md:justify-between items-center py-3">
            <ul className="footer-bottom-ul flex space-x-4 mb-2 md:mb-0">
                <li><a href="">Terminos y condiciones</a></li>
                <li><a href="">Politica privacidad</a></li>
            </ul>
            <p className="footer-bottom-p mb-1">&copy; Copyright 2025 Radio Empresaria. Todos los derechos reservados.</p>
            <p className="footer-bottom-p">&copy; Este sitio fue desarrollado por <a href="contacto.html" className="text-blue-500 hover:text-blue-700">Click aqui</a></p>
        </div>
    </footer>
    )
    };