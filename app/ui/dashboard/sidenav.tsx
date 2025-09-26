import ReproductorRadio from "../categorias/Reproductor";

export default function SideNav() {
  return (
    <aside className="h-auto w-100 bg-white border-r overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Radio */}
        <div>
          <h2 className="text-lg font-semibold mb-2 mt-10">Radio en Vivo</h2>
          <ReproductorRadio/>
        </div>

        {/* Latest Posts */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Últimas publicaciones</h2>
          <ul className="space-y-3">
            <li className="flex space-x-2">
              <img
                src="/img/post1.jpg"
                alt="Post 1"
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="text-sm font-medium">
                  Fundación Ágora: Dedicados al bienestar social
                </p>
                <span className="text-xs text-gray-500">septiembre 23, 2025</span>
              </div>
            </li>
            <li className="flex space-x-2">
              <img
                src="/img/post2.jpg"
                alt="Post 2"
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="text-sm font-medium">
                  Eliminación Temporal de Derechos de Exportación
                </p>
                <span className="text-xs text-gray-500">septiembre 23, 2025</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Categorías */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Categorias</h2>
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
