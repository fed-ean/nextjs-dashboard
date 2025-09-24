import Head from "next/head";
import CategoriasCard from '../ui/dashboard/categoria'
import "../global.css";
import '../ui/dashboard/style-categoria.css';

export default function InvoicesPage() {
  return(
    <>
      <h1 className="mt-4">
        (Acá va el nombre de la etiqueta)
      </h1>
      <div className="container text-center">
        <div className="row">
          <CategoriasCard />
          <CategoriasCard />
          <CategoriasCard />
          <CategoriasCard />
          <CategoriasCard />
          <CategoriasCard />
        </div>
      </div>
    </>
  );
}