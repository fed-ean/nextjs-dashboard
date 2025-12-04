'use client';

import Link from 'next/link';
import Image from "next/image";
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
    <footer className="bg-gray-900 text-white pt-16 pb-6 mt-12 titillium-web-regular">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Columna 1: Sobre nosotros */}
          <div className="flex flex-col">
             <Image src="/RadioAColor1.png" alt="Logo" />
            <p className="text-gray-400 text-sm">
              Radio online de la Fundación Pro Buenos Aires, dedicada a pymes, comercios, emprendedores y grandes empresas de nuestra región.
            </p>
          </div>

          {/* Columna 2: Secciones */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Secciones</h3>
            <ul className="space-y-3">
              {siteSections.map(section => (
                <li key={section.name}>
                  <Link href={section.href} className="text-gray-400 hover:text-white transition-colors">
                    {section.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-4 text-sm">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-center">
                  <item.icon className="text-xl mr-3 text-gray-400" />
                  <span className="text-gray-400">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Redes Sociales y Copyright */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-5 mb-4 md:mb-0">
            {socialLinks.map(social => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-2xl">
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
