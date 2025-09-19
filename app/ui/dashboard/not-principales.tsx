import "./style-index.css";


export default function NoticiaPrincipal(){
    return(
        <div className="flex flex-wrap">
  <div className="w-full md:w-5/12">
    <a href="Noticias/noticia.html">
      <img className="noticia w-full noticia-principal" src="fotos/mirtha.jpg" />
    </a>
  </div>
  <div className="w-full md:w-7/12">
    <div className="stacked-cards full-height grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <div className="col-span-1">
        <a className="noticia-principal-mini">
          <img src="fotos/mirtha.jpg" />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis id
            aut hic asperiores, cum, error laudantium sit facere ullam adipisci
            eius dolorem, porro esse nesciunt. Corrupti voluptatem iste dolore
            quae!
          </p>
        </a>
      </div>
      <div className="col-span-1">
        <a className="noticia-principal-mini">
          <img src="fotos/mirtha.jpg" />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis id
            aut hic asperiores, cum, error laudantium sit facere ullam adipisci
            eius dolorem, porro esse nesciunt. Corrupti voluptatem iste dolore
            quae!
          </p>
        </a>
      </div>
      <div className="col-span-1 hidden 2xl:block">
        <a className="noticia-principal-mini">
          <img src="fotos/mirtha.jpg" />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis id
            aut hic asperiores, cum, error laudantium sit facere ullam adipisci
            eius dolorem, porro esse nesciunt. Corrupti voluptatem iste dolore
            quae!
          </p>
        </a>
      </div>
    </div>
  </div>
</div>
    )
};