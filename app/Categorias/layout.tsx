import NavBar from "../ui/Page_Index/navbar";
import SideNav from "../ui/Page_Index/sidenav";
import "../global.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-auto w-auto flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
            <SideNav />
        </div>
        <div className="p-2 md:p-6">
            {children}
        </div>
    </div>
  );
}