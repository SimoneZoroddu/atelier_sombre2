import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useShop } from "../contexts/GlobalContext";



import "./AppDetail.css";

export default function DetailPage() {
    const { name, color } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [selectedSize, setSelectedSize] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const { cartList, setCartList, genre, setGenre } = useShop();
    const [recommended, setRecommended] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [openShipping, setOpenShipping] = useState(null);
    const location = useLocation();
//zoom references
    const lensRef = useRef(null);
    const resultRef = useRef(null);
    const imgRef = useRef(null);
    const wrapperRef = useRef(null);
    
    const handleZoom = (e) => { //funzione che parte quanto il mouse si muove sull'immaigine principale
        const wrapper = e.currentTarget;
        const img = imgRef.current;
        const lens = lensRef.current;
        const result = resultRef.current;

        if (!img) return; // evita errori se l'immagine non è ancora pronta

        
        result.style.display = "block";//mostra il risultato dello zoom

        const x = e.nativeEvent.offsetX; //salva le coordinate del mouse rispetto all'immagine
        const y = e.nativeEvent.offsetY;

        const lensSize = 100;
        //centra la lente sul mouse
        lens.style.left = `${x - lensSize / 2}px`;
        lens.style.top = `${y - lensSize / 2}px`;
        //definiamo uno zoom
        const zoomLevel = 2.5;
        //zoomma l'immagine che è lo sfondo del div result
        const imgWidth = img.width * zoomLevel;
        const imgHeight = img.height * zoomLevel;
        
        const resultWidth = result.offsetWidth;
        const resultHeight = result.offsetHeight;
        // sposta lo sfondo in modo che corrisponda alla posizione della lente
        const bgX = -(x * zoomLevel - resultWidth / 2);
        const bgY = -(y * zoomLevel - resultHeight); 
        result.style.backgroundImage = `url(${mainImage})`;
        result.style.backgroundSize = `${imgWidth}px ${imgHeight}px`;
        result.style.backgroundPosition = `${bgX}px ${bgY}px`;
    };



    console.log(lensRef.current);
    const handleLeave = () => {//funzione che nasconde il risultato dello zoom quando il mouse esce dall'immagine
        
        resultRef.current.style.display = "none";
    };
    
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

    const handleBack = () => {//naviga indietro alla pagina precedente o alla home se non c'è una pagina precedente
        setGenre(product.genre); // Aggiorna il contesto con il genere del prodotto visualizzato
        if (location.key !== "default") {
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
        if (!selectedSize) {//controlla se è stata selezionata una taglia
            alert("Seleziona una taglia prima di aggiungere al carrello.");
            return;
        }

        const cartItem = {// crea l'oggetto da aggiungere al carrello
            id: product.id,
            name: product.name,
            color: product.color,
            image: product.image.main_image_url,
            price: product.price,
            size: selectedSize,
            quantity: quantity,
        };
        //recupera il carrello esistente dal localStorage o inizzializza un carrello vuoto
        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

        // Controlla se lo stesso prodotto con la stessa taglia è già nel carrello
        const existingItem = existingCart.find(
            item => item.id === cartItem.id && item.size === cartItem.size
        );

        if (existingItem) {//Se il prodotto esiste già aggiorna la quantità
            existingItem.quantity += quantity;
        } else {// Altrimenti aggiungi il nuovo prodotto al carrello
            existingCart.push(cartItem);
        }

        // Salva il carrello aggiornato nel localStorage
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

    //normalizza dettagli del prodotto
    const normalizedDetails = product.details
        .split('.')
        .map(item => item.trim())
        .filter(item => item.length > 0);

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
            {/* Home button */}

            <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                <i className="bi bi-house-door-fill" style={{ padding: "0.5rem" }}></i>
            </Link>
            {/* Search button */}

            <Link to="/shoes" style={{ textDecoration: "none", color: "black" }}>
                <i className="bi bi-search" style={{ padding: "0.5rem" }}></i>
            </Link>
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
                            .map((img, i) => (//renderizza solo le immagini che esistono, alcune potrebbero essere null
                                <img
                                    key={i}
                                    src={img}
                                    alt="thumb"
                                    className="thumbnailVertical"
                                    style={{
                                        border: mainImage === img ? "2px solid black" : "1px solid #ccc"
                                    }}
                                    onMouseEnter={() => setMainImage(img)}//al passaggio del mouse cambia l'immagine principale
                                    onClick={() => setMainImage(img)}//al click cambia l'immagine principale
                                />
                            ))}
                    </div>

                    {/* IMMAGINE PRINCIPALE */}
                    <div className="mainImageWrapper">
                        <img
                            ref={imgRef}
                            src={mainImage}
                            alt={product.name}
                            className="mainImage"
                            onMouseMove={handleZoom}
                            onMouseLeave={handleLeave}
                        />
                        <div className="zoomLens" ref={lensRef}></div>
                        <div className="zoomResult" ref={resultRef}></div>
                    </div>
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

                        <div className={`accordionContent ${showDetails ? "open" : ""}`}>
                            {normalizedDetails.map((detail, index) => (
                                <div key={index}>{detail}</div>
                            ))}
                            <p>
                                <span style={{ color: "#000", fontWeight: 550, paddingTop : "1rem" }}>Colore:</span>
                                {" "}{capitalizeWords(product.color)}
                            </p>
                        </div>
                    </div>


                    {/* TAGLIE */}
                    <h3>Taglie disponibili</h3>
                    <div className="sizesRow">
                        {product.quantity.map(q => (//renderizza un pulsante per ogni taglia esistente nel db, disabilitandolo se la stock è 0
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

                    {selectedSize && (// Mostra selettore quantità solo se è stata selezionata una taglia
                        <div style={{ marginTop: "1rem" }}>
                            <label style={{ fontWeight: 550 }}>Quantità:</label>
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
                                {Array.from({ length: selectedStock }, (_, i) => i + 1).map(num => (// Crea un array con n elementi dove n=selectedStock e renderizza un'opzione per ogni elemento dell'array
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
