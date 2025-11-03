import Head from "next/head";
import NavBar from "../ui/Page_Index/navbar";
import SideNav from "../ui/Page_Index/sidenav";
import NoticiaEncabezado from "../ui/Page_Index/noticia-encabezado";
import NoticiasCategorias from "../ui/Page_Index/noticia-categorias-izquierda";
import NoticiasTexto from "../ui/Page_Index/noticia-derecha-texto";
import "../ui/Page_Index/style-noticias.css";

export default function InvoicesPage() {
  return(
    <>

    <section>
        <NoticiasTexto />
    </section>
    </>
  );
}