import { Link } from "react-router-dom"
import img_logo from "../img/logo_basic_atelier_sombre.png"
import AppSideBarSearch from "./AppSideBarSearch";
import { useShop } from "../contexts/GlobalContext";

export default function AppHeader() {

    const { cartList } = useShop()

    return (
        <header>
            <nav className="navbar navbar-expand-lg background_color_basic mb-2">
                <div className="container-fluid mx-2">
                    <Link className="navbar-brand" to="/">
                        <img src={img_logo} alt="logo_atelier_sombre" style={{ width: "4rem" }} />
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
                            {
                                /* 
                                <li className="nav-item underline_hover">
                                    <Link className="nav-link" >Informazioni</Link>
                                </li> 
                                */
                            }
                        </ul>
                    </div>
                    <Link to="/wishlist">
                        🦴
                    </Link>
                    <Link className="nav-link" to="/cart">
                        {
                            cartList.length === 0
                                ?
                                <i className="bi bi-bag"></i>
                                :
                                <div className="cart-icon">
                                    <i className="bi bi-bag-fill"></i>
                                    <div className="cart-badge" >
                                        {cartList.length}
                                    </div>
                                </div>
                        }
                    </Link>
                    <button className="btn" data-bs-toggle="offcanvas" data-bs-target="#searchPanel">
                        <i className="bi bi-search"></i>
                    </button>
                </div>
            </nav>
            <AppSideBarSearch />
        </header>

    )
}