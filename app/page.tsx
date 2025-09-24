import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import NavBar from './ui/dashboard/navbar';
import EnVivo from './ui/dashboard/envivo';
import RadioPlayer from './ui/Reproductor';
import NoticiaPrincipalDerecha from './ui/dashboard/not-principal-derecha';
import NoticiaPrincipalIzquierda from './ui/dashboard/not-principal-izquierda';
import NoticiasVarias from './ui/dashboard/noticias-varias';
import Footer from './ui/dashboard/footer';
import './global.css';
import './ui/dashboard/style-index.css';
import Tarjetas from './ui/dashboard/tarjetas'

export default function Page() {
  return(
    <>
      <article className="mx-1">
      <h1 className="mt-14">Difusion y analisis de las empresas PYMES</h1>
      <RadioPlayer/>

      <h2>Noticias Principales</h2>

      <div className="flex">
      <NoticiaPrincipalIzquierda />
      <NoticiaPrincipalDerecha />
      </div>
    
      </article>
      <article className="">
        <h2>Noticias Varias</h2>
        <div className="flex flex-wrap justify-center text-center noticias-varias">
      <NoticiasVarias/>
      <NoticiasVarias/>
      <NoticiasVarias/>
      <NoticiasVarias/>
      <NoticiasVarias/>
      <NoticiasVarias/>
      <NoticiasVarias/>
    </div>
      </article>
      <hr/>
      < Tarjetas/>
    </>
  );
}
