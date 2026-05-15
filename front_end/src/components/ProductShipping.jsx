import { useDetail } from "../contexts/DetailContext";

export default function ProductShipping() {
    const { shippingInfo, openShipping, setOpenShipping } = useDetail();

    return (
        <div className="shipping-section">
            <div>
                <p className="shipping-label">Spedizione & Resi</p>
                <div className="shipping-items">
                    {shippingInfo.map(item => (
                        <div key={item.id} className="shipping-item">
                            <button
                                className="shipping-item-header"
                                onClick={() => setOpenShipping(prev => prev === item.id ? null : item.id)}
                            >
                                <span className="shipping-item-left">
                                    <i className={item.icon}></i>
                                    {item.title}
                                </span>
                                <i className={`bi ${openShipping === item.id ? "bi-dash" : "bi-plus"}`}></i>
                            </button>
                            {openShipping === item.id && (
                                <p className="shipping-item-detail">{item.detail}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="eco-box">
                <span className="eco-icon"><i className="bi bi-leaf"></i></span>
                <div className="eco-text">
                    <p className="eco-title">Il nostro impegno per il pianeta</p>
                    <p className="eco-body">
                        Ogni scelta che facciamo è guidata dal rispetto per l'ambiente.
                        Utilizziamo materiali certificati e confezioni in carta riciclata,
                        e lavoriamo con corrieri che adottano pratiche di consegna a basse emissioni.
                        Perché il lusso non dovrebbe avere un costo per la terra.
                    </p>
                </div>
            </div>
        </div>
    );
}
