export default function NavBar(){
    return(
        <nav className="navbar navbar fixed barra-navegacion border-bottom">
            <button
                className="btn btn-nav-bar"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasWithBothOptions"
                aria-controls="offcanvasWithBothOptions"
            >
                <img src="fotos/list.svg" />
            </button>
            <div
                className="offcanvas offcanvas-start btn-nav-completo"
                data-bs-scroll="true"
                tabIndex={-1}
                id="offcanvasWithBothOptions"
                aria-labelledby="offcanvasWithBothOptionsLabel"
            >
                <div className="offcanvas-body categorias-nav">
                <h4 className="sticky-top">Categorias</h4>
                <div className="">
                    <a href="categorias/categoria.html" id="politica">
                    Politica
                    </a>
                </div>
                <div>
                    <a href="categorias/categoria.html" id="economia">
                    Economia
                    </a>
                </div>
                <div>
                    <a href="categorias/categoria.html" id="pymes">
                    PYMES
                    </a>
                </div>
                <div>
                    <a href="categorias/categoria.html" id="interesGeneral">
                    Interes general
                    </a>
                </div>
                </div>
                <div className="offcanvas-body contactos-nav">
                    <a href="https://www.youtube.com/@fprobaires" target="_blank">
                        <i className="fa-brands fa-youtube fa-3x youtube-menu" />
                    </a>
                    <a href="https://www.facebook.com/RadioEmpresaria" target="_blank">
                        <i className="fa-brands fa-facebook fa-3x" />
                    </a>
                    <a href="#" target="_blank">
                        <i className="fa-brands fa-instagram instagram-gradient" />
                    </a>
                    <a href="#" target="_blank">
                        <i className="fa-brands fa-x-twitter fa-3x" />
                    </a>
                    <a href="https://t.me/radioempresaria" target="_blank">
                        <i className="fa-brands fa-telegram fa-3x" />
                    </a>
                </div>
            </div>
            <a className="navbar-brand" href="#">
                <img src="fotos/radio blanco (1) (1).png" className="logo" />
            </a>
            <a href="login.html" className="btn-nav-bar">
                <i className="fa-solid fa-circle-user img-a-nav fa-2x" />
            </a>
        </nav>
    )
}