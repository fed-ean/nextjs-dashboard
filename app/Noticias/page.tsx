import Head from "next/head";
import NavBar from "../ui/dashboard/navbar";
import SideNav from "../ui/dashboard/sidenav";
import NoticiaEncabezado from "../ui/dashboard/noticia-encabezado";
import NoticiasCategorias from "../ui/dashboard/noticia-categorias-izquierda";
import NoticiasTexto from "../ui/dashboard/noticia-derecha-texto";
import "../ui/dashboard/style-noticias.css";

export default function InvoicesPage() {
  return(
    <>

    <section>
        <NoticiasTexto />
    </section>
    </>
  );
}