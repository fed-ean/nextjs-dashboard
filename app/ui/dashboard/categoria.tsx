

import "./style-noticias.css";


export default function CategoriasCard(){
    return(
        <div className="w-full sm:w-1/2 px-2 noticia-box">
  <div className="flex flex-wrap gap-2 img-noticia">
    <button>
      <h4>
        <a href="" className="text-blue-600 font-semibold hover:underline">
          {" "}
          PyME{" "}
        </a>
      </h4>
    </button>
    <button>
      <h4>
        <a href="" className="text-blue-600 font-semibold hover:underline">
          {" "}
          Política{" "}
        </a>
      </h4>
    </button>
    <button>
      <h4>
        <a href="" className="text-blue-600 font-semibold hover:underline">
          {" "}
          Local{" "}
        </a>
      </h4>
    </button>
  </div>
  <div className="mt-4 text-noticia">
    <a
      href="../Noticias"
      className="text-gray-800 hover:underline"
    >
      Mirtha Legrand se retirará a la edad de los 97 años dejando atrás un
      legado del programa más visto de las familias argentinas
    </a>
  </div>
</div>

  )
};