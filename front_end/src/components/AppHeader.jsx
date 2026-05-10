import { Link } from "react-router-dom"
import img_logo from "../img/logo_basic_atelier_sombre.png"
import { useShop } from "../contexts/GlobalContext"
import { useNavigate } from "react-router";

export default function AppHeader() {

    const { searchValue, setSearchValue, category, setGenre } = useShop()

    let navigate = useNavigate();

    return (
        <header>
            <nav className="navbar navbar-expand-lg background_color_basic mb-2">
                <div className="container-fluid mx-2">
                    <Link className="navbar-brand" to="/">
                        <img src={img_logo} alt="logo_atelier_sombre" style={{ width: "4rem" }}  />
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            {/* da eliminare... possiamo lasciarlo solo sul logo, ma rimane mezzo vuoto sarebbe bello trovare qualche link da associare */}
                            <li className="nav-item">
                                <Link className="nav-link active underline_hover" aria-current="page" to="/">HomePage</Link>
                            </li>
                            <li className="nav-item underline_hover">
                                <Link className="nav-link" to="/shoes" >Vedi le nostre collezioni</Link>
                            </li>
                            <li className="nav-item underline_hover">
                                <Link className="nav-link" >Informazioni</Link>
                            </li>
                        </ul>
                    </div>
                    <Link className="nav-link" to="/cart">
                        <i className="bi bi-bag-fill"></i>
                    </Link>
                    <button className="btn" data-bs-toggle="offcanvas" data-bs-target="#searchPanel">
                        <i className="bi bi-search"></i>
                    </button>
                </div>
            </nav>

            {/* sidebar */}
            <div className="offcanvas offcanvas-end" id="searchPanel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Ricerca</h5>
                    <button className="btn-close" data-bs-dismiss="offcanvas"></button>
                </div>

                <div className="offcanvas-body">
                    <input className="form-control mb-3" type="search" placeholder="Che tipo di scarpa cerchi?" value={searchValue} onChange={(e) => { setSearchValue(e.target.value), setGenre("") }} onKeyDown={(e) => {
                        if (e.key === "Enter")
                            navigate("/shoes")
                    }} />

                    {
                        category?.map((item, index) => (
                            <div className=" ms-1 mb-2" data-bs-dismiss="offcanvas" key={index}>
                                <Link to="/shoes" className="text-black underline_hover " onClick={() => { setSearchValue(item), setGenre("") }} >
                                    {item}
                                </Link>
                            </div>
                        ))
                    }
                    <hr />

                </div>
            </div>
        </header>

    )
}