import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useShop } from "../contexts/GlobalContext";



import "./DetailPage.css";

export default function DetailPage() {
    const { name, color } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [selectedSize, setSelectedSize] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const { cartList, setCartList } = useShop();
    const [recommended, setRecommended] = useState([]);
    const [quantity, setQuantity] = useState(1);

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
        <div className="container">

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
                                setSelectedSize(q.size);
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
        </div>
    );
}
