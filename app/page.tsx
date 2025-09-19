import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import NavBar from './ui/dashboard/navbar';
import NoticiaPrincipalIzquierda from './ui/dashboard/not-principal-izquierda';
import NoticiaPrincipalDerecha from './ui/dashboard/not-principal-derecha';
import EnVivo from './ui/dashboard/envivo';
import RadioPlayer from './ui/Reproductor';
import NoticiasVarias from './ui/dashboard/noticias-varias';
import Footer from './ui/dashboard/footer';
import "./global.css";
import React from 'react';

export default function Page() {
  return(
    <>
      <article className="mx-3 mt-14">
      <h1>DIFUSIÓN y ANÁLISIS de las EMPRESAS PYMES</h1>
      <RadioPlayer/>
      <h2>Noticias Principales</h2>
      <div className="flex flex-wrap">
      <NoticiaPrincipalIzquierda />
      <NoticiaPrincipalDerecha /> 
      </div>
    
      </article>
      <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 noticias-varias">
  <h2 className="col-span-full">Noticias Varias</h2>
  <NoticiasVarias />
  <NoticiasVarias />
  <NoticiasVarias />
  <NoticiasVarias />
  <NoticiasVarias />
  <NoticiasVarias />
  <NoticiasVarias />
  <NoticiasVarias />
  <NoticiasVarias />
</article>
      <Footer/>
    </>
  );
}
