import "./footer.css";
import '../../fonts.css';
import { PiMapPinBold } from "react-icons/pi";
import { IoMdMail } from "react-icons/io";
import { BsWhatsapp } from "react-icons/bs";
import { FaIdCard } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { Youtube, Linkedin, Instagram, Facebook, Telegram} from './iconos';
import { FaInstagram } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa";


export default function Footer(){
    return(
<footer className="footer">
        <div className="div-conteiner">
            {/* Tailwind Classes for Layout and Spacing */}
            <div className="footer-section izquierda flex flex-col space-y-2 titillium-web-regular">
                <img src="#" alt="imagen" className="footer-logo"/>
                <p>Radio Empresaria es una emisora online</p>
                <p>creada por la Fundación Pro Buenos Aires</p>
                <p>con el objetivo de acompañar y difundir a pymes</p>
                <p>comercios, emprendedores y</p>
                <p>grandes empresas de nuestra región.</p>
                <div className="mt-4">
                    <h4 className="mb-2 text-center">Redes</h4>
                    <div className="flex justify-around w-full">
                        <a className="w-[3rem] h-[3rem]" href="https://www.youtube.com/@fprobaires" target="_blank"><FaYoutube className="w-[2.5rem] h-[2.5rem]"/></a>
                        <a className="w-[3rem] h-[3rem]" href="https://www.facebook.com/RadioEmpresaria" target="_blank"><FaFacebookSquare className="w-[2.5rem] h-[2.5rem]"/></a>
                        <a className="w-[3rem] h-[3rem]" href="#" target="_blank"><FaInstagram className="w-[2.5rem] h-[2.5rem]"/></a>
                        <a className="w-[3rem] h-[3rem]" href="https://x.com/RadioEmpresaria" target="_blank"><FaXTwitter className="w-[2.5rem] h-[2.5rem] block"/></a>
                        <a className="w-[3rem] h-[3rem] block" href="#" target="_blank"><FaTelegram className="w-[2.5rem] h-[2.5rem] block"/></a>
                    </div>
                </div>
            </div>

            {/* Tailwind Classes for Spacing and Alignment */}
            <div className="footer-brand centro titillium-web-regular">
                <h4 className="mb-3">Secciones</h4> 
                <ul className="footer-ul space-y-1">
                    <li className="footer-ul-li"><a href="categorias/politica.html">Politica</a></li>
                    <li className="footer-ul-li"><a href="#">Economia</a></li>
                    <li className="footer-ul-li"><a href="#">PYMES</a></li>
                    <li className="footer-ul-li"><a href="#">Interes general</a></li>
                </ul>
            </div>

            {/* Tailwind Classes for Layout and Spacing */}
            <div className="footer-section derecha flex flex-col space-y-2 titillium-web-regular">
                <h4 className="mb-3">Contacto</h4>
                <p className="footer-section-p flex items-center space-x-2"><i className="fa-circle-info text-2xl"><FaIdCard/></i > <span>Cuit 30-69894716-7</span></p>
                <p className="footer-section-p flex items-center space-x-2"><i className="fa-whatsapp text-2xl"><BsWhatsapp/></i> <span>11 4189-9250</span></p>
                <p className="footer-section-p flex items-center space-x-2"><i className="fa-square-phone text-2xl"><BsWhatsapp/></i> <span>15 5258-0226</span></p>
                <p className="footer-section-p flex items-center space-x-2"><i className="fa-envelope text-2xl"><IoMdMail/></i> <span>info@radioempresaria.cosm.ar</span></p>
                <p className="footer-section-p flex items-center space-x-2"><i className="fa-envelope text-2xl"><IoMdMail/></i> <span>radioempresaria92.5@gmail.com</span></p>
                <p className="footer-section-p flex items-center space-x-2"><i className="fa-location-dot text-2xl"><PiMapPinBold/></i> <span>Ruta 36 N°1354</span></p>
                <p className="footer-section-p flex items-center space-x-2"><i className="fa-linkedin text-2xl"><FaLinkedin/></i><span>Linkedin</span></p>
            </div>
        </div>

        {/* Tailwind Classes for Layout and Spacing */}
        <div className="footer-bottom flex flex-col md:flex-row md:justify-between items-center py-3 titillium-web-regular">
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