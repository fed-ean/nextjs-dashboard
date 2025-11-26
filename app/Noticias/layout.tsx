// app/Noticias/layout.tsx

import SideNav from "../ui/Page_Index/sidenav";
import { getAllCategories } from "../lib/data-fetcher";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getAllCategories();

  return (
    <div className="flex h-auto flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav categories={categories} />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  );
}
