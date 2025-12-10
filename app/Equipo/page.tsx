import Image from "next/image";

export const metadata = {
  title: "Equipo - Radio Empresarial",
  description: "Conocé al equipo de Radio Empresarial",
};

type Member = {
  name: string;
  role: string;
  image?: string;
};

function Section({
  title,
  icon,
  members,
}: {
  title: string;
  icon: string;
  members: Member[];
}) {
  return (
    <section className="mb-24">
      {/* Título con ícono */}
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 flex items-center justify-center gap-3">
        <span className="text-4xl">{icon}</span> {title}
      </h2>

      {/* Grid de miembros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 place-items-center">
        {members.map((m) => (
          <div
            key={m.name}
            className="flex flex-col items-center bg-white shadow-lg rounded-xl p-4 w-full max-w-xs border border-gray-100 hover:shadow-xl transition"
          >
            {/* Imagen */}
            <div className="w-full h-56 relative bg-gray-200 rounded-md overflow-hidden shadow">
              {m.image ? (
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Sin foto
                </div>
              )}
            </div>

            {/* Rol */}
            <p className="mt-4 text-center text-lg font-semibold text-gray-900">
              {m.role}
            </p>

            {/* Nombre */}
            <p className="text-center text-gray-700 text-sm">{m.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function EquipoPage() {
  return (
    <main className="max-w-7xl mx-auto p-6">

      {/* Fondo suave */}
      <div className="bg-gray-50 p-10 rounded-3xl shadow-inner">

        {/* -------- DIRECCIÓN -------- */}
        <Section
          title="Dirección"
          icon="💼"
          members={[
            {
              name: "Facundo Galdós",
              role: "Dir Contenido PYME",
              image: "/equipo/facundo.jpg",
            },
            {
              name: "Claudio Blanco",
              role: "Director Periodístico",
              image: "/equipo/claudio.jpg",
            },
            {
              name: "Practicantes de la EEST N°4",
              role: "Diseño & Web Master",
              image: "/equipo/practicantes.jpg",
            },
          ]}
        />

        {/* -------- LOCUTORES -------- */}
        <Section
          title="Locutores Nacionales"
          icon="🎤"
          members={[
            {
              name: "Esteban Díaz Romero",
              role: "Locutor Nacional",
              image: "/equipo/esteban.jpg",
            },
            {
              name: "Laura Farías",
              role: "Locutora Nacional",
              image: "/equipo/laura.jpg",
            },
          ]}
        />

        {/* -------- OPERADORES -------- */}
        <Section
          title="Operadores Técnicos"
          icon="🎧"
          members={[
            {
              name: "Rober Páez",
              role: "Operador Técnico",
              image: "/equipo/rober.jpg",
            },
            {
              name: "Eliana Herrera",
              role: "Operadora Técnica",
              image: "/equipo/eliana.jpg",
            },
            {
              name: "Nahuel Cravero",
              role: "Operador Técnico",
              image: "/equipo/nahuel.jpg",
            },
          ]}
        />

        {/* -------- PERIODISTAS -------- */}
        <Section
          title="Periodistas"
          icon="📰"
          members={[
            {
              name: "Claudio Blanco",
              role: "Director Periodístico",
              image: "/equipo/claudio.jpg",
            },
            {
              name: "Juan Larroza",
              role: "Periodista y productor",
              image: "/equipo/juan-larroza.jpg",
            },
          ]}
        />

        {/* -------- TEXTO LEGAL -------- */}
        <div className="mt-16 text-center text-gray-600 text-sm leading-relaxed max-w-3xl mx-auto px-4">
          La Dirección y los Propietarios Asociados no son responsables de los
          contenidos y opiniones vertidos por cada una de las producciones
          independientes, periodistas, colaboradores y entrevistados realizadas
          tanto en la emisora como en este Portal de Noticias.
        </div>
      </div>

    </main>
  );
}
