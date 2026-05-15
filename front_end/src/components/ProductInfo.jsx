import { Link } from "react-router-dom";
import { useDetail } from "../contexts/DetailContext";

export default function ProductInfo() {
    const {
        quantity, setQuantity,
        sizeErrorr, setSizeError,
        showDetails, setShowDetails,
        selectedSize, setSelectedSize,
        product,
        stockMap,
        toastMessage,
        addToCart,
        addWishlist,
        isInWishlist,
        originalPrice,
        finalPrice,
        capitalizeWords
    } = useDetail();

    const normalizedDetails = product.details
        .split('.')
        .map(item => item.trim())
        .filter(item => item.length > 0);

    const selectedStock = selectedSize ? (stockMap[selectedSize] ?? 0) : 0;

    return (
        <div className="infoColumn">
            <h1>{product.name}</h1>
            <p className="category">{product.category} · {product.genre}</p>
            {product.on_sale !== 0 ? (
                <p className="price">
                    <span style={{ textDecoration: "line-through", color: "#777", marginRight: "0.5rem" }}>
                        {originalPrice.toFixed(2)} €
                    </span>
                    <span style={{ fontWeight: 600 }}>
                        {finalPrice} €
                    </span>
                </p>
            ) : (
                <p className="price">{originalPrice.toFixed(2)} €</p>
            )}

            {/* ACCORDION */}
            <div className="accordion">
                <button className="accordionHeader" onClick={() => setShowDetails(prev => !prev)}       >
                    Dettagli prodotto
                    <span>{showDetails ? "−" : "+"}</span>
                </button>

                <div className={`accordionContent ${showDetails ? "open" : ""}`}>
                    {normalizedDetails.map((detail, index) => (
                        <div key={index}>{detail}</div>
                    ))}
                    <p>
                        <span style={{ color: "#000", fontWeight: 550, paddingTop: "1rem" }}>Colore:</span>
                        {" "}{capitalizeWords(product.color)}
                    </p>
                </div>
            </div>

            {/* TAGLIE */}
            <h3>Taglie disponibili</h3>
            <div className="sizesRow">
                {product.quantity.map(q => (
                    <button key={q.id} disabled={stockMap[q.size] === 0} className="sizeButton"
                        onClick={() => {
                            setSizeError(false);
                            setSelectedSize(prev => prev === q.size ? null : q.size);
                            setQuantity(1);
                        }}
                        style={{
                            background: selectedSize === q.size ? "black" : "white",
                            color: selectedSize === q.size ? "white" : "black",
                            opacity: stockMap[q.size] === 0 ? 0.4 : 1
                        }}
                    >
                        {q.size}
                    </button>
                ))}
            </div>

            {/* QUANTITÀ */}
            {selectedSize && (
                <div style={{ marginTop: "1rem" }}>
                    <label style={{ fontWeight: 550 }}>Quantità:</label>
                    <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                        style={{
                            marginLeft: "1rem",
                            padding: "0.5rem",
                            borderRadius: "4px",
                            border: "1px solid #ccc"
                        }}
                    >
                        {Array.from({ length: selectedStock }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* BOTTONI */}
            <div className="buttonsRow">
                <button className="cartButton" onClick={addToCart}>
                    <span className="cart-text">Aggiungi al carrello</span>
                    <span className="cart-icon"><i className="bi bi-cart-fill"></i></span>
                </button>

                <button onClick={(e) => addWishlist(product)} className="btn btn-sm bg-transparent border-0 p-0"
                    style={{
                        fontSize: "1.5rem",
                        lineHeight: 1,
                        color: "#555",
                    }}
                >
                    {isInWishlist(product.id) ? <i className="bi bi-suit-heart-fill"></i> : <i className="bi bi-suit-heart"></i>}
                </button>

            </div>
            <Link to='/cart' style={{ textDecoration: "none", color: "black", fontFamily: 'Jost', fontWeight: 300, textAlign: "center" }} >Vai al tuo carrello</Link>
            {sizeErrorr && (<p className="toastNotification bg-danger">Seleziona una taglia</p>)}
            {toastMessage && (
                <div className="toastNotification">
                    {toastMessage}
                </div>
            )}
        </div>
    );
}
