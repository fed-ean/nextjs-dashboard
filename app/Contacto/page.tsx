//app/Contacto/page.tsx
import Image from "next/image";

export default function Contacto() {
  return (
    <main className="pt-32 pb-20">
      
      {/* TÍTULO */}
      <h1 className="text-center text-4xl font-bold text-blue-900 mb-12">
        Contacto
      </h1>

      {/* CONTENEDOR */}
      <div className="max-w-4xl mx-auto px-6">

        {/* SECCIÓN CONTACTO */}
        <section 
          className="
            bg-white border border-gray-300 rounded-2xl shadow-lg 
            p-10 mb-20 text-center animate-fadeIn
          "
        >
          <h2 className="text-2xl font-semibold text-blue-800 mb-6">
            Fundación Pro Buenos Aires
          </h2>

          <p className="text-gray-600 mb-4">CUIT 30-69894716-7</p>

          <p className="text-lg text-gray-700 font-medium mb-1">
            Teléfono 5258-0226
          </p>
          <p className="text-lg text-gray-700 font-medium mb-6">
            11 4189-9250
          </p>

          <p className="text-blue-700 font-semibold hover:underline mb-2">
            Mail: info@radioempresaria.com.ar
          </p>

          <p className="text-blue-700 font-semibold hover:underline">
            Mail: info@probuenosaires.org
          </p>
        </section>
        {/* SPONSORS */}
        <section className="animate-fadeIn">
          <h3 className="text-center text-2xl font-semibold text-blue-800 mb-10 tracking-wide">
            NOS ACOMPAÑAN
          </h3>

          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 px-4">
            {SPONSORS.map((s) => (
              <a
                key={s.alt}
                href={s.href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group w-full h-28 flex items-center justify-center 
                  bg-white border border-gray-200 rounded-xl shadow-md 
                  hover:shadow-xl transition-all duration-300 
                  hover:-translate-y-1
                "
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={250}
                  height={90}
                  className="
                    object-contain p-2 
                    transition-transform duration-300 
                    group-hover:scale-105
                  "
                />
              </a>
            ))}
          </div>
        </section>
          {/* QUIÉNES SOMOS */}
        <section className="mb-24 animate-fadeIn">
          <h2 className="text-center text-3xl font-semibold text-blue-900 mb-8">
            Quiénes Somos
          </h2>

          <div 
            className="
              bg-gray-50 border border-gray-300 rounded-2xl shadow-md 
              p-10 leading-relaxed text-gray-800 text-lg
            "
          >
            <p className="mb-4">
              En Radio Empresaria, nos enfocamos en brindarte contenido relevante para el mundo empresarial. 
              Somos una plataforma de radio online con sede en Argentina y nos hemos consolidado como un 
              referente en el ámbito de la información y la comunicación empresarial.
            </p>

            <p className="mb-4">
              En nuestra programación, podrás disfrutar de programas y podcasts especializados que abarcan 
              una amplia gama de temas relacionados con los negocios, la gestión empresarial, el 
              emprendimiento, el liderazgo y la innovación. Diseñamos nuestra programación para ofrecerte 
              consejos prácticos, entrevistas a expertos, análisis de tendencias y casos de éxito que te 
              inspirarán y brindarán herramientas útiles para tu desarrollo como empresario, emprendedor o 
              profesional.
            </p>

            <p className="mb-4">
              Nos enorgullece decir que Radio Empresaria es hecho por pymes para pymes. Comprendemos las 
              necesidades y dificultades específicas que enfrentan las pequeñas y medianas empresas, por lo 
              que nos esforzamos en proporcionar contenido relevante y aplicable, compartiendo experiencias 
              reales y estrategias exitosas de otros emprendedores y empresarios.
            </p>

            <p className="mb-4">
              Además, en Radio Empresaria ofrecemos servicios de radiodifusión a bajos costos para las 
              empresas, permitiendo que emprendedores y pymes puedan promocionar sus proyectos de manera 
              accesible y efectiva.
            </p>

            <p className="mb-4">
              Ya sea que estés buscando consejos para impulsar tu negocio, aprender de las experiencias de 
              otros empresarios, mantenerte actualizado sobre las últimas tendencias empresariales o 
              promocionar tu empresa, en Radio Empresaria somos tu aliado.
            </p>

            <p>
              Te invitamos a visitar nuestro sitio web para explorar nuestra programación, acceder a los 
              programas grabados y descubrir cómo podemos contribuir al crecimiento de tu empresa.
            </p>
          </div>
        </section>
      </div>

    </main>
  );
}

// Sponsors configurables
const SPONSORS = [
  { src: "/sponsor/fagua-audax.png", alt: "Fagua Audax", href: "https://www.tiendafagua.com.ar/" },
  { src: "/sponsor/lober.png", alt: "Lober Logística", href: "#" },
  { src: "/sponsor/jlf.jpg", alt: "JLF Materiales Eléctricos", href: "http://www.electrojf.com.ar/" },
  { src: "/sponsor/encadenar.png", alt: "Encadenar", href: "https://www.encadenar.com.ar/" },
];
