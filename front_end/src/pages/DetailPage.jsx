import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useShop } from "../contexts/GlobalContext";



import "./DetailPage.css";

export default function DetailPage() {
    const { name, color } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [selectedSize, setSelectedSize] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const { cartList, setCartList } = useShop();
    const [recommended, setRecommended] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [openShipping, setOpenShipping] = useState(null);

    const shippingInfo = [
        {
            id: "standard",
            icon: "bi bi-box-seam",
            title: "Spedizione Standard",
            detail: "Consegna in 2-4 giorni lavorativi. Tracciamento incluso."
        },
        {
            id: "express",
            icon: "bi bi-lightning",
            title: "Spedizione Express",
            detail: "Consegna il giorno successivo se ordinato entro le 12:00. Disponibile per le principali città italiane."
        },
        {
            id: "returns",
            icon: "bi bi-arrow-return-left",
            title: "Resi & Rimborsi",
            detail: "Resi gratuiti entro 30 giorni dall'acquisto. Il rimborso viene elaborato in 3-5 giorni lavorativi."
        }
    ];

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };
 //funzione per normalizzare i nomi composti da più parole, es: "dark blue" -> "Dark blue"
    function capitalizeWords(str) {
        return str
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }


    function addToCart() {
        if (!selectedSize) {
            alert("Seleziona una taglia prima di aggiungere al carrello.");
            return;
        }

        const cartItem = {
            id: product.id,
            name: product.name,
            color: product.color,
            image: product.image.main_image_url,
            price: product.price,
            size: selectedSize,
            quantity: quantity,
        };
        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

        // 2. Controlla se lo stesso prodotto con la stessa taglia è già nel carrello
        const existingItem = existingCart.find(
            item => item.id === cartItem.id && item.size === cartItem.size
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            existingCart.push(cartItem);
        }

        // 3. Salva nel localStorage
        localStorage.setItem("cart", JSON.stringify(existingCart));

        alert("Prodotto aggiunto al carrello!");
        console.log("Aggiunto al carrello:", cartItem);
    }

    // Fetch prodotto
    useEffect(() => {
        fetch(`http://127.0.0.1:3000/product/${name}/${color}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setMainImage(data.image.main_image_url);
                setLoading(false);
            });
    }, [name, color]);

    // Fetch prodotti consigliati
    useEffect(() => {
        if (!product) return;

        fetch("http://127.0.0.1:3000/index")
            .then(res => res.json())
            .then(allProducts => {
                const filtered = allProducts
                    .filter(p => p.category === product.category)
                    .filter(p => p.genre === product.genre)
                    .filter(p => p.id !== product.id)
                    .slice(0, 4);

                setRecommended(filtered);
            });
    }, [product]);

    if (!product) return <p>Prodotto non trovato.</p>;

    /* Declare cartItem */
    const cartItem = {
        id: product.id,
        name: product.name,
        color: product.color,
        image: product.image.main_image_url,
        price: product.price,
        size: selectedSize,
    };


    const selectedStock = selectedSize
        ? product.quantity.find(q => q.size === selectedSize)?.stock || 0
        : 0;

    return (
        <>
            {/* Back button */}
            <button
                onClick={handleBack}
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    paddingLeft: "3rem",
                    marginTop: "1rem",
                }}
            >
                <i className="bi bi-arrow-left"></i>
            </button>
        <div className="product-page">
            
            {/* LEFT: IMMAGINI */}
            <div className="imagesWrapper">

                {/* THUMBNAILS */}
                <div className="thumbnailsColumn">
                    {[
                        product.image.main_image_url,
                        product.image.top_view_url,
                        product.image.secondary_image_url,
                        product.image.model_image_url
                    ]
                        .filter(img => img)
                        .map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt="thumb"
                                className="thumbnailVertical"
                                style={{
                                    border: mainImage === img ? "2px solid black" : "1px solid #ccc"
                                }}
                                onClick={() => setMainImage(img)}
                            />
                        ))}
                </div>

                {/* IMMAGINE PRINCIPALE */}
                <img src={mainImage} alt={product.name} className="mainImage" />
            </div>

            {/* RIGHT: INFO PRODOTTO */}
            <div className="infoColumn">
                <h1>{product.name}</h1>
                <p className="category">{product.category} · {product.genre}</p>
                <p className="price">{product.price} €</p>

                {/* ACCORDION */}
                <div className="accordion">
                    <button
                        className="accordionHeader"
                        onClick={() => setShowDetails(prev => !prev)}
                    >
                        Dettagli prodotto
                        <span>{showDetails ? "−" : "+"}</span>
                    </button>

                    {showDetails && (
                        <div className="accordionContent">
                            <p>{product.details}</p>
                            <p><span style={{ color: "#000", fontWeight: 550 }}>Colore:</span> {capitalizeWords(product.color)}</p>
                        </div>
                    )}
                </div>

                {/* TAGLIE */}
                <h3>Taglie disponibili</h3>
                <div className="sizesRow">
                    {product.quantity.map(q => (
                        <button
                            key={q.id}
                            disabled={q.stock === 0}
                            onClick={() => {
                                setSelectedSize(prev => prev === q.size ? null : q.size);
                                setQuantity(1);
                            }}
                            className="sizeButton"
                            style={{
                                background: selectedSize === q.size ? "black" : "white",
                                color: selectedSize === q.size ? "white" : "black",
                                opacity: q.stock === 0 ? 0.4 : 1
                            }}
                        >
                            {q.size}
                        </button>
                    ))}
                </div>

                {/* QUANTITÀ */}
                {selectedSize && (
                    <div style={{ marginTop: "1rem" }}>
                        <label style={{ fontWeight: "bold" }}>Quantità:</label>
                        <select
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
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

                    <button className="wishlistButton">
                        <i className="bi bi-heart"></i>
                    </button>
                </div>
            </div>

            {/* PRODOTTI CONSIGLIATI */}
            {recommended.length > 0 && (
                <div style={{ marginTop: "3rem" }}>
                    <h2>Prodotti consigliati</h2>

                    <div className="recommendedRow">
                        {recommended.map(item => (
                            <Link
                                key={item.id}
                                to={`/products/${item.name}/${item.color}`}
                                className="recommendedItem"
                            >
                                <img
                                    src={item.image.main_image_url}
                                    alt={item.name}
                                    className="recommendedImage"
                                />
                                <p className="recommendedName">{item.name}</p>
                                <p className="recommendedPrice">{item.price} €</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            {/*informazioni sulla spedizione*/}
            <div>
                <div className="shipping-section">
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

        </div>
        </>
    );
}
