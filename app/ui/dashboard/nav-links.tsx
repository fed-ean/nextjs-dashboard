import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import "./style-index.css";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { 
    name: 'Inicio', 
    href: '/' 
  },

  {
    name: 'Politica', 
    href: "/Categorias"
  },
  {
    name: 'Economia',
    href: '/Categorias',
  },
  {
    name: 'PYMES',
    href: '/Categorias',
  },
  {
    name: 'Interes general',
    href: '/Categorias',
  },
];

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex h-[18%] grow items-center border-b-black transition duration-300 justify-center gap-1 p-2 pl-[3rem] hover:bg-blue-100 md:flex-none md:justify-start md:p-2 md:pl-[3rem] md: md:px-3 hover:text-black"
          >
            {link.name}
          </Link>
        );
      })}
    </>
  );
}
