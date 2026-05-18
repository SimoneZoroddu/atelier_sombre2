import { Link } from "react-router-dom"
import img_logo from "../img/logo_basic_atelier_sombre.png"
import AppSideBarSearch from "./AppSideBarSearch";
import { useShop } from "../contexts/GlobalContext";

export default function AppHeader() {

    const { cartList, storeWishlist, setIsVisibleCart, isVisibleCart, setSearchValue } = useShop()

    return (
        <header>
            <nav className="navbar navbar-expand-lg background_color_basic mb-2">
                <div className="container-fluid mx-2">
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item underline_hover fw-bolder">
                                <Link className="nav-link" to="/shoes/1" onClick={() => setSearchValue("")}>Vedi tutte le nostre collezioni</Link>
                            </li>
                            <li className="nav-item underline_hover fw-bolder">
                                <Link className="nav-link" aria-current="page" to="/shoes/uomo/1" onClick={() => setSearchValue("")} >Uomo</Link>
                            </li>
                            <li className="nav-item underline_hover fw-bolder">
                                <Link className="nav-link" aria-current="page" to="/shoes/donna/1" onClick={() => setSearchValue("")} >Donna</Link>
                            </li>
                            <li className="nav-item underline_hover fw-bolder">
                                <Link className="nav-link" to="/info" onClick={() => setSearchValue("")}>Informazioni</Link>
                            </li>
                            <li className="nav-item underline_hover fw-bolder">
                                <Link className="nav-link text-danger" aria-current="page" to="/shoes/discounted/1" onClick={() => setSearchValue("")} >In Sconto</Link>
                            </li>

                        </ul>
                    </div>
                    <Link className="navbar-brand position-absolute start-50 me-auto" to="/"  >
                        <img src={img_logo} alt="logo_atelier_sombre" style={{ width: "4rem" }} />
                    </Link>
                    <Link to="/wishlist" className="nav-link px-3 ms-auto " >
                        {storeWishlist?.length
                            ?
                            <div className="cart-icon">
                                <i className="bi bi-suit-heart-fill"></i>
                                <div className="cart-badge" >
                                    {storeWishlist?.length}
                                </div>
                            </div>
                            :
                            <i className="bi bi-suit-heart"></i>
                        }
                    </Link>
                    <Link className="nav-link d-md-none" to="/cart" >
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
                    <button className="nav-link d-none d-md-inline" onClick={() => setIsVisibleCart(!isVisibleCart)} >
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
                    </button>
                    <button className="btn" data-bs-toggle="offcanvas" data-bs-target="#searchPanel">
                        <i className="bi bi-search"></i>
                    </button>
                </div>
            </nav>
            <AppSideBarSearch />
        </header>

    )
}