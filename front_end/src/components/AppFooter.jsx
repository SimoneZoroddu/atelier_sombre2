import { Link } from "react-router-dom"
import { useShop } from "../contexts/GlobalContext";



export default function AppFooter() {

    const { handleSubmit, email, setEmail, error, setError } = useShop()

    return (
        <footer className="container-fluid p-4 mt-4 background_color_basic"  >
            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-5">
                <div className="col">
                    <h4 className="pb-4">Resta aggiornato!</h4>
                    <form action="">
                        <div>
                            <input className="rounded-pill border-1 p-1 px-2" name="emailNewsletter" required type="email" placeholder="La tua email" value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError("");
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                autoFocus />
                            <button className="border-0 background_color_basic ms-3" onClick={handleSubmit}>
                                Invia
                            </button>
                        </div>
                    </form>
                </div>
                <div className="col">
                    <ul className="list-unstyled">
                        <li className="fw-medium fs-4">Servizio Clienti</li>
                        <li><Link href="" className="text-black underline_hover"  >Contattaci</Link></li>
                        <li><a href="" className="text-black underline_hover">Servizi Premium</a></li>
                        <li><a href="" className="text-black underline_hover">Traccia il mio ordine</a></li>
                        <li><a href="" className="text-black underline_hover">Richiedi un reso</a></li>
                        <li><a href="" className="text-black underline_hover">Dichiarazione di accessibilitá</a></li>
                        <li><a href="" className="text-black underline_hover">Cura del Prodotto</a></li>
                        <li><a href="" className="text-black underline_hover">Gift Card</a></li>
                    </ul>
                </div>
                <div className="col">
                    <ul className="list-unstyled">
                        <li className="fw-medium fs-4">Store</li>
                        <li><a href="" className="text-black underline_hover">Boutiques</a></li>

                    </ul>
                </div>
                <div className="col">
                    <ul className="list-unstyled">
                        <li className="fw-medium fs-4">Informazioni aziendali</li>
                        <li><a href="" className="text-black underline_hover">Angelo Ren Group</a></li>
                        <li><a href="" className="text-black underline_hover">Note legali</a></li>
                        <li><a href="" className="text-black underline_hover">Termini e Condizioni di utilizzo</a></li>
                        <li><a href="" className="text-black underline_hover">Informativa Privacy</a></li>
                        <li><a href="" className="text-black underline_hover">Lavora con noi</a></li>
                        <li><a href="" className="text-black underline_hover">Termini e Condizioni di utilizzo della Gift Card</a></li>
                        <li><a href="" className="text-black underline_hover">Informativa ai clienti sulla sicurezza dei prodotti</a></li>
                        <li><a href="" className="text-black underline_hover">Cookie Policy - Impostazioni Cookie</a></li>
                    </ul>
                </div>
                <div className="col">
                    <ul className="list-unstyled">
                        <li className="fw-medium fs-4">Seguici</li>
                        <li><a href="" className="text-black underline_hover"><i className="bi bi-instagram pe-2"></i>Instagram</a></li>
                        <li><a href="" className="text-black underline_hover"><i className="bi bi-facebook pe-2"></i>Facebook</a></li>
                        <li><a href="" className="text-black underline_hover"><i className="bi bi-tiktok pe-2"></i>TikTok</a></li>
                        <li><a href="" className="text-black underline_hover"><i className="bi bi-youtube pe-2"></i>Youtube</a></li>
                        <li><a href="" className="text-black underline_hover"><i className="bi bi-pinterest pe-2"></i>Pinterest</a></li>
                        <li><a href="" className="text-black underline_hover"><i className="bi bi-linkedin pe-2"></i>LinkedIn</a></li>
                        <li><a href="" className="text-black underline_hover"><i className="bi bi-twitter-x pe-2"></i>Twitter</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}