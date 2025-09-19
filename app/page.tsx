import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import NavBar from './ui/dashboard/navbar';
import NoticiaPrincipal from './ui/dashboard/not-principales';
import EnVivo from './ui/dashboard/envivo';
import NoticiasVarias from './ui/dashboard/noticias-varias';
import Footer from './ui/dashboard/footer';
import "./global.css";

export default function Page() {
  return(
    <>
      <article className="mx-3">
      <h1>Difusion y analisis de las empresas PYMES</h1>

      <EnVivo/>

      <h2>Noticias Principales</h2>

      <NoticiaPrincipal />
    
      </article>
      <article className="noticias-varias">
        <h2>Noticias Varias</h2>
        <div className="flex flex-wrap justify-center text-center mx-3 space-x-4">
      <NoticiasVarias/>
    </div>
      </article>
      <Footer/>
    </>
  );
}
