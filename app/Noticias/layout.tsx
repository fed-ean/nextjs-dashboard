import NavBar from "../ui/dashboard/navbar";
import SideNav from "../ui/dashboard/sidenav";
import NoticiaEncabezado from "../ui/dashboard/noticia-encabezado";
import "../global.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <NoticiaEncabezado />
    <div className="flex h-auto flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
            <SideNav/>
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
            {children}
        </div>
    </div>
    </>
  );
}