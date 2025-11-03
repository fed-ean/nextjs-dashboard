// components/NoticiasSecundariasContainer.js
"use client"
import NoticiaSecundariaCard from './not-principal-derecha'; 

export default function NoticiasSecundariasContainer({ noticiasSecundarias }){
    // Si no hay datos, retorna null (esto es correcto, pero debe haber datos para renderizar)
    if (!noticiasSecundarias || noticiasSecundarias.length === 0) return null;

    return(
        // Este contenedor debe ser la columna derecha.
        // **w-full md:w-5/12 es crucial para que se coloque al lado de la principal.**
        // **flex flex-col gap-4 es crucial para apilar las dos tarjetas.**
        <div className="w-full md:w-5/12 p-4 flex flex-col gap-4"> 
            
            {/* El mapeo debe iterar sobre el array y pasar el objeto 'noticia' a la card */}
            {noticiasSecundarias.slice(0, 2).map((noticia, index) => (
                <NoticiaSecundariaCard 
                    key={noticia.id || index} 
                    noticia={noticia} 
                />
            ))}
            
        </div>
    );
};