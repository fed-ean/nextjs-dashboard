import UltimasNoticiasSidenav from "../Page_Index/ultimas-noticias-sidenav";
import { fetchLatestInvoices } from "../../lib/data";

export default async function SideNav() {
  const latestInvoices = await fetchLatestInvoices();

  return (
    // Se elimina `overflow-y-auto` para un scroll más fluido a nivel de página
    <aside className="h-full w-full bg-white border-r">
      <div className="p-4 space-y-6">
        <div className="mt-8">
          <UltimasNoticiasSidenav noticias={latestInvoices} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Categorías</h2>
          <ul className="space-y-2 text-sm">
            <li>Ámbito</li>
            <li>Deportes</li>
            <li>Desayuno PyME</li>
            <li>Economía</li>
            <li>Internacional</li>
            <li>Locales</li>
            <li>Política</li>
            <li>Programas</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
