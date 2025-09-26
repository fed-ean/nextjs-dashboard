import Head from "next/head";
import CategoriasCard from '../ui/dashboard/categoria'
import '../ui/dashboard/style-categoria.css';

export default function InvoicesPage() {
  return(
    <>
      <h1 className="mt-4">
        (Acá va el nombre de la etiqueta)
      </h1>
      
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 noticia-box text-center">
          <CategoriasCard />
          <CategoriasCard />
          <CategoriasCard />
          <CategoriasCard />
          <CategoriasCard />
          <CategoriasCard />
      </div>
    </>
  );
}