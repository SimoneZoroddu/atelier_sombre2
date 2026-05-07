import { Link } from "react-router-dom"




export default function AppFooter() {


    return (
        <div className="container p-4">
            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-5">
                <div className="col">
                    <h4 className="pb-4">Resta aggiornato!</h4>
                    <form action="">
                        <div>
                            <input className="rounded-pill border-1 p-1 px-2" name="emailNewsletter" type="email" placeholder="Inserisci l'email" required />
                            <button className="bg-white border-0">Invia</button>
                        </div>
                    </form>
                </div>
                <div className="col">
                    <ul className="list-unstyled">
                        <li className="fw-medium">Servizio Clienti</li>
                        <li><Link href="" className="text-black underline_hover">Contattaci</Link></li>
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
                        <li className="fw-medium">Store</li>
                        <li><a href="" className="text-black underline_hover">Boutiques</a></li>

                    </ul>
                </div>
                <div className="col">
                    <ul className="list-unstyled">
                        <li className="fw-medium">Informazioni aziendali</li>
                        <li><a href="" className="text-black underline_hover">Tods Group</a></li>
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
                        <li className="fw-medium">Seguici</li>
                        <li><a href="" className="text-black underline_hover">Instagram</a></li>
                        <li><a href="" className="text-black underline_hover">Facebook</a></li>
                        <li><a href="" className="text-black underline_hover">TikTok</a></li>
                        <li><a href="" className="text-black underline_hover">Youtube</a></li>
                        <li><a href="" className="text-black underline_hover">Pinterest</a></li>
                        <li><a href="" className="text-black underline_hover">LinkedIn</a></li>
                        <li><a href="" className="text-black underline_hover">Twitter</a></li>
                    </ul>
                </div>
            </div>
        </div>

    )
}