import NavBar from "../ui/Page_Index/navbar";
import SideNav from "../ui/Page_Index/sidenav";
import NoticiaEncabezado from "../ui/Page_Index/noticia-encabezado";
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