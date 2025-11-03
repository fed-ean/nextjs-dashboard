export default function CategoriasCard() {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 flex flex-col h-full">
      {/* Imagen */}
      <img
        alt="Imagen Noticia"
        className="w-full h-auto rounded-md mb-3 object-cover"
      />

      {/* Texto de la noticia */}
      <div className="mt-auto">
        <a href="../Noticias" className="text-gray-800 font-medium hover:underline">
          Mirtha Legrand se retirará a la edad de los 97 años dejando atrás un
          legado del programa más visto de las familias argentinas
        </a>
      </div>
    </div>
  );
}