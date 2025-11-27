'use client';

import Link from 'next/link';
import {
  FaYoutube, 
  FaFacebookSquare, 
  FaInstagram, 
  FaTelegramPlane, 
  FaLinkedin, 
  FaWhatsapp
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { PiMapPinBold } from "react-icons/pi";
import { FaIdCard } from "react-icons/fa";

const socialLinks = [
  { href: "https://www.youtube.com/@fprobaires", icon: FaYoutube, label: "YouTube" },
  { href: "https://www.facebook.com/RadioEmpresaria", icon: FaFacebookSquare, label: "Facebook" },
  { href: "#", icon: FaInstagram, label: "Instagram" },
  { href: "https://x.com/RadioEmpresaria", icon: FaXTwitter, label: "Twitter" },
  { href: "#", icon: FaTelegramPlane, label: "Telegram" },
];

const contactInfo = [
    { icon: FaIdCard, text: "Cuit 30-69894716-7" },
    { icon: FaWhatsapp, text: "11 4189-9250" },
    { icon: IoMdMail, text: "info@radioempresaria.com.ar" },
    { icon: PiMapPinBold, text: "Ruta 36 N°1354" },
    { icon: FaLinkedin, text: "LinkedIn" },
];

const siteSections = [
  { href: "/Categorias/politica", name: "Política" },
  { href: "/Categorias/economia", name: "Economía" },
  { href: "/Categorias/pymes", name: "PYMES" },
  { href: "/Categorias/interes-general", name: "Interés General" },
];

const legalLinks = [
  { href: "/terminos", name: "Términos y Condiciones" },
  { href: "/privacidad", name: "Política de Privacidad" },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 pt-20 pb-8 mt-12 titillium-web-regular border-t-4 border-yellow-500">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-10">
          
          {/* Columna 1: Sobre nosotros */}
          <div className="flex flex-col lg:col-span-2 md:col-span-3">
            <img src="/RadioAColor.png" alt="Radio Empresaria Logo" className="h-16 w-auto mb-6 self-start"/>
            <p className="text-gray-400 text-sm leading-relaxed">
              Radio online de la Fundación Pro Buenos Aires, dedicada a pymes, comercios, emprendedores y grandes empresas de nuestra región.
            </p>
          </div>

          {/* Columna 2: Secciones */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white uppercase tracking-wider">Secciones</h3>
            <ul className="space-y-4">
              {siteSections.map(section => (
                <li key={section.name}>
                  <Link href={section.href} className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    {section.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          

          {/* Columna 4: Contacto */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-white uppercase tracking-wider">Contacto</h3>
            <ul className="space-y-5 text-sm">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-center group">
                  <item.icon className="text-2xl mr-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-400 group-hover:text-white">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Redes Sociales y Copyright */}
        <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-6 sm:mb-0">
            {socialLinks.map(social => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transform hover:scale-125 transition-all duration-300 text-3xl">
                <social.icon />
              </a>
            ))}
          </div>
          <p className="text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} Radio Empresaria. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
