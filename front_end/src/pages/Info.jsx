
const infoLinks = [
    "Angelo Ren Group",
    "Note legali",
    "Termini e Condizioni di utilizzo",
    "Informativa Privacy",
    "Lavora con noi",
    "Termini e Condizioni di utilizzo della Gift Card",
    "Informativa ai clienti sulla sicurezza dei prodotti",
    "Cookie Policy - Impostazioni Cookie",
];





export default function Info() {





    return (
        <div className="container py-5">
            {/* Hero */}
            <section className="text-center mb-5">
                <h1 className="fw-bold display-4 mb-3">
                    Informazioni Ecommerce
                </h1>

                <p className="text-muted fs-5 mx-auto" style={{ maxWidth: "700px" }}>
                    Benvenuto nella sezione dedicata alle informazioni aziendali,
                    legali e alle policy del nostro ecommerce.
                    Qui puoi trovare tutti i dettagli utili relativi ai servizi,
                    alla privacy e alle condizioni di utilizzo.
                </p>
            </section>

            {/* Cards */}
            <section className="row g-4">
                {infoLinks.map((item, index) => (
                    <div className="col-md-6 col-lg-4" key={index}>
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-3 hover_card_info">
                            <div className="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <h5 className="fw-semibold mb-3">{item}</h5>

                                    <p className="text-muted small">
                                        Consulta tutte le informazioni relative a:
                                        <strong> {item}</strong>.
                                    </p>
                                </div>

                                <a
                                    href="#"
                                    className="btn btn-outline-dark rounded-pill mt-3"
                                >
                                    Scopri di più
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Extra Section */}
            <section className="mt-5 pt-5 border-top">
                <div className="row align-items-center">
                    <div className="col-lg-6 mb-4 mb-lg-0">
                        <h2 className="fw-bold mb-3">
                            Trasparenza e affidabilità
                        </h2>

                        <p className="text-muted">
                            Il nostro ecommerce mette al centro sicurezza, privacy
                            e chiarezza verso i clienti. Tutte le informazioni sono
                            sempre aggiornate e facilmente consultabili.
                        </p>
                    </div>

                    <div className="col-lg-6">
                        <div className="bg-light rounded-4 p-4 shadow-sm">
                            <ul className="list-unstyled mb-0">
                                <li className="mb-3">
                                    ✅ Pagamenti sicuri
                                </li>

                                <li className="mb-3">
                                    ✅ Protezione dati personali
                                </li>

                                <li className="mb-3">
                                    ✅ Supporto clienti dedicato
                                </li>

                                <li>
                                    ✅ Policy chiare e accessibili
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}