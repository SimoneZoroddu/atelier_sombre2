import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

/* assets */
import shop_shoes from "../img/shop_shoes2.png"
import hero_img from "../img/hero_space.jpg"
import hero_img2 from "../img/hero_space2.webp"
import hero_img3 from "../img/hero_space3.webp"
const image = [hero_img, hero_img2, hero_img3];

/* context */
import { useShop } from "../contexts/GlobalContext"
import AppSideBarCart from "../components/AppSideBarCart"



export default function HomePage() {
    const { setGenre, setSearchValue, shoes, setShoes, cartList } = useShop()

    //creazione indice per ciclare le immagini
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIndex((prev) => (prev + 1) % image.length);
        }, 10000);

        return () => clearTimeout(timeout);
    }, [index]);


    const today = new Date();
    const newArrivals = shoes.filter(shoe => {
        const shoe_created_at = new Date(shoe.created_at);
        const expiry = new Date(shoe_created_at);
        expiry.setMonth(expiry.getMonth() + 3);

        return today <= expiry;
    })

    const newArrivalsWoman = newArrivals.filter(shoe => shoe.genre == "Donna")
    const newArrivalsMan = newArrivals.filter(shoe => shoe.genre == "Uomo")

    function FilterWoman() {
        window.scrollTo({ top: 0 })
        setGenre("Donna")
        setSearchValue("")
    }

    function FilterMan() {
        window.scrollTo({ top: 0 })
        setGenre("Uomo")
        setSearchValue("")
    }

    function ResetFilter() {
        window.scrollTo({ top: 0 })
        setGenre("")
        setSearchValue("")
    }




    return (
        <>
            <div>
                <div className="container-fluid">
                    <Link className="nav-link active" aria-current="page" to="/shoes" onClick={ResetFilter}>
                        <img src={image[index]} alt="tods-hp-summerselection" className="img-fluid w-100" />
                    </Link>
                    <div className="text-center fs-2 py-4">Nuovi arrivi di Atelier Sombre</div>
                    <div className="text-center mb-5">
                        <Link to="/shoes" className="fs-5 text-black underline_hover" onClick={ResetFilter}>
                            Acquista ora
                        </Link>
                    </div>
                    <div className="container-fluid">
                        <div className="row row-cols-1 row-cols-md-2 g-4 text-center">
                            <div className="col px-0">
                                {
                                    <div className="d-flex justify-content-start flex-wrap py-4" key={newArrivalsWoman[0]?.ID}  >
                                        <Link to="/shoes" onClick={FilterWoman}>
                                            <img src={newArrivalsWoman[0]?.images.model_image_url} className="img-fluid" alt={newArrivalsWoman[0]?.name} style={{ width: "120rem" }} />
                                        </Link>
                                    </div>
                                }
                                <Link to="/shoes" className="fs-5 text-black underline_hover" onClick={FilterWoman}>
                                    Nuovi Arrivi Donna
                                </Link>
                            </div>
                            <div className="col px-0">
                                {
                                    <div className="d-flex justify-content-start flex-wrap py-4" key={newArrivalsMan[0]?.ID}  >
                                        <Link to="/shoes" onClick={FilterMan}>
                                            <img src={newArrivalsMan[0]?.images.model_image_url} className="img-fluid" alt={newArrivalsMan[0]?.name} style={{ width: "120rem" }} />
                                        </Link>
                                    </div>
                                }
                                <Link to="/shoes" className="fs-5 text-black underline_hover" onClick={FilterMan}>
                                    Nuova Arrivi Uomo
                                </Link>
                            </div>
                        </div>
                    </div>
                </div >
                <div className="container-fluid px-0 mt-5">
                    <div className="row g-0 min-vh-50">
                        <div className="col-12 col-lg-6">
                            <img src={shop_shoes} alt="Boutique" className="img-fluid w-100 h-100 object-fit-cover" style={{ minHeight: "650px", objectFit: "cover" }} />
                        </div>
                        <div className="col-12 col-lg-6 d-flex align-items-center background_color_basic" >
                            <div className="px-5 px-lg-7 py-5 w-100">
                                <p className="text-uppercase mb-3" style={{ letterSpacing: "3px", fontSize: "0.8rem", color: "#7a7a7a" }} >
                                    Boutique
                                </p>
                                <h2 className="mb-5" style={{ fontSize: "3rem", fontWeight: "300", lineHeight: "1.2", color: "#1f1f1f" }}>
                                    La tua boutique
                                    <br />
                                    più vicina
                                </h2>
                                <div className="row gy-5">
                                    <div className="col-12 col-md-6">
                                        <p className="fw-semibold mb-2">
                                            Collegiove 02020
                                        </p>
                                        <p className="mb-4 text-secondary">
                                            Via Umberto I<br />
                                            135, Collegiove
                                        </p>
                                        <p className="fw-semibold mb-2">
                                            Contatti
                                        </p>
                                        <ul className="list-unstyled text-secondary lh-lg">
                                            <li>milanocortina2026@ateliersombre.com</li>
                                            <li>+39 02 9304 9501</li>
                                            <li>WhatsApp: 02 9304 9501</li>
                                        </ul>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <p className="fw-semibold mb-2">
                                            Orari di Apertura
                                        </p>
                                        <ul className="list-unstyled text-secondary lh-lg">
                                            <li>Lunedì -- Sabato · 10:00 -- 19:30</li>
                                            <li>Domenica · 10:00 -- 19:00</li>
                                        </ul>
                                        <button className="btn mt-4 px-0 border-0" style={{ fontWeight: "500", letterSpacing: "1px", borderBottom: "1px solid black", borderRadius: "0" }} >
                                            TROVA UN'ALTRA BOUTIQUE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="div">
                {

                    cartList.length == 0
                        ?
                        <></>
                        :
                        <AppSideBarCart />

                }
            </div>
        </>
    )
}