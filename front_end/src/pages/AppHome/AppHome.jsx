import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import "./home.css";

/* assets */
import shop_shoes from "../../img/shop_shoes2.png"
import hero_img from "../../img/hero_space.jpg"
import hero_img2 from "../../img/hero_space2.webp"
import hero_img3 from "../../img/hero_space3.webp"
import hero_img4 from "../../img/hero_space4.jpg"
import hero_img5 from "../../img/hero_space5.jpg"
import hero_img6 from "../../img/hero_space6.jpg"


const image = [hero_img6, hero_img, hero_img6, hero_img2, hero_img6, hero_img3, hero_img6, hero_img4, hero_img6, hero_img5];

/* context */
import { useShop } from "../../contexts/GlobalContext"
import AppSideBarCart from "../../components/AppSideBarCart"



export default function HomePage() {
    const { setGenre, setSearchValue, shoes, setShoes, cartList } = useShop()

    //creazione indice per ciclare le immagini
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIndex((prev) => (prev + 1) % image.length);
        }, 3000);

        return () => clearTimeout(timeout);
    }, [index]);


    /*  
    
    
    const today = new Date();
     const newArrivals = shoes.filter(shoe => {
         const shoe_created_at = new Date(shoe.created_at);
         const expiry = new Date(shoe_created_at);
         expiry.setMonth(expiry.getMonth() + 3);
 
         return today <= expiry;
     })



  */

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <div>
                            <div className="container-fluid">
                                <Link className="nav-link active" aria-current="page" to="/shoes/1"  state={{ scrollPosition: window.scrollY }}>
                                    <div className="hero-wrapper">
                                        <img src={image[0]} alt="placeholder" className="hero-placeholder" />
                                        {image.map((imgSrc, i) => (
                                            <img
                                                key={i}
                                                src={imgSrc}
                                                className={`hero-img-crossfade ${i === index ? 'active' : ''}`}
                                                alt="tods-hp-summerselection"
                                            />
                                        ))}
                                    </div>
                                </Link>
                                <div className="text-center fs-2 py-4">Nuovi arrivi di Atelier Sombre</div>
                                <div className="text-center mb-5">
                                    <Link to="/shoes/1" className="fs-5 text-black underline_hover"  state={{ scrollPosition: window.scrollY }}>
                                        Acquista ora
                                    </Link>
                                </div>
                                <div className="container-fluid">
                                    <div className="row row-cols-1 row-cols-md-2 g-4 text-center">
                                        <div className="col px-0">

                                            <div className="d-flex justify-content-start flex-wrap py-4"  >
                                                <Link to="/shoes/donna/1"  state={{ scrollPosition: window.scrollY }}>
                                                    <img src='https://saint-laurent.dam.kering.com/asset/2c520417-2c46-42ed-af79-70af55178751/Medium2/8671811TVAN3085_Y.jpg?v=1' className="img-fluid" alt='donna' style={{ width: "120rem" }} />
                                                </Link>
                                            </div>

                                            <Link to="/shoes/donna/1" className="fs-5 text-black underline_hover"  state={{ scrollPosition: window.scrollY }} >
                                                Nuovi Arrivi Donna
                                            </Link>
                                        </div>
                                        <div className="col px-0">

                                            <div className="d-flex justify-content-start flex-wrap py-4"   >
                                                <Link to="/shoes/uomo/1"   state={{ scrollPosition: window.scrollY }}>
                                                    <img src='https://saint-laurent.dam.kering.com/asset/e19f8190-9263-4078-8447-995e16fe36f8/Original-Ecom/860499AAAPI1000_Y.jpg?v=1' className="img-fluid" alt='uomo' style={{ width: "120rem" }} />
                                                </Link>
                                            </div>

                                            <Link to="/shoes/uomo/1" className="fs-5 text-black underline_hover"   state={{ scrollPosition: window.scrollY }}>
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
                    </div>
                    {

                        cartList.length != 0 && <AppSideBarCart />

                    }
                </div>
            </div>
        </>
    )
}