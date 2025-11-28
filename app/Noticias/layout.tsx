
import SidenavServer from "@/app/ui/Page_Index/SidenavServer";

export default function NoticiasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Columna Izquierda: Sidenav */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="sticky top-24">
            <SidenavServer />
          </div>
        </aside>

        {/* Columna Derecha: Contenido de la página (ej. el post) */}
        <main className="lg:col-span-9">
          {children}
        </main>

      </div>
    </div>
  );
}
