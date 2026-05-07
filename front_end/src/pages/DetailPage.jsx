import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useShop } from "../contexts/GlobalContext";



export default function DetailPage() {
    const { name, color } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [selectedSize, setSelectedSize] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const { cartList, setCartList } = useShop();

    useEffect(() => {
        fetch(`http://127.0.0.1:3000/product/${name}/${color}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setMainImage(data.image.main_image_url);
                setLoading(false);
            });
    }, [name, color]);

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
    
    const addToCart = (item) => {

        if (!selectedSize) {
            alert("Seleziona una taglia prima di aggiungere al carrello.")
            return;
        }
        setCartList((prev) => [...prev, cartItem]);
        console.log(cartItem, cartList);
    };

    return (
        <div style={styles.container}>

            {/* LEFT: IMMAGINI */}
            <div style={styles.imagesWrapper}>

                {/* COLONNA THUMBNAILS */}
                <div style={styles.thumbnailsColumn}>
                    {[product.image.main_image_url,
                    product.image.top_view_url,
                    product.image.secondary_image_url,
                    product.image.model_image_url].map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt="thumb"
                            style={{
                                ...styles.thumbnailVertical,
                                border: mainImage === img ? "2px solid black" : "1px solid #ccc"
                            }}
                            onClick={() => setMainImage(img)}
                        />
                    ))}
                </div>

                {/* IMMAGINE PRINCIPALE */}
                <img src={mainImage} alt={product.name} style={styles.mainImage} />

            </div>


            {/* RIGHT: INFO PRODOTTO */}
            <div style={styles.infoColumn}>
                <h1>{product.name}</h1>
                <p style={styles.category}>{product.category} · {product.genre}</p>
                <p style={styles.price}>{product.price} €</p>
                <div style={styles.accordion}>
                    <button
                        style={styles.accordionHeader}
                        onClick={() => setShowDetails(prev => !prev)}
                    >
                        Dettagli prodotto
                        <span>{showDetails ? "−" : "+"}</span>
                    </button>

                    {showDetails && (
                        <div style={styles.accordionContent}>
                            <p>{product.details}</p>
                        </div>
                    )}
                </div>


                {/* TAGLIE */}
                <h3>Taglie disponibili</h3>
                <div style={styles.sizesRow}>
                    {product.quantity.map(q => (
                        <button
                            key={q.id}
                            disabled={q.stock === 0}
                            onClick={() => setSelectedSize(q.size)}
                            style={{
                                ...styles.sizeButton,
                                background: selectedSize === q.size ? "black" : "white",
                                color: selectedSize === q.size ? "white" : "black",
                                opacity: q.stock === 0 ? 0.4 : 1
                            }}
                        >
                            {q.size}
                        </button>
                    ))}
                </div>

                {/* BOTTONI */}
                <div style={styles.buttonsRow}>
                    <button style={styles.cartButton} onClick={addToCart}>
                        <span className="cart-text">Aggiungi al carrello</span>
                        <span className="cart-icon"><i className="bi bi-cart-fill"></i></span>
                    </button>

                    <button style={styles.wishlistButton}><i className="bi bi-heart"></i></button>
                </div>
            </div>
        </div>
    );
}
const styles = {
    container: {
        display: "flex",
        gap: "3rem",
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        flexWrap: "wrap"
    },

    /* IMMAGINI */
    imagesWrapper: {
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
        flex: 1,
        minWidth: "300px"
    },

    thumbnailsColumn: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
    },

    thumbnailVertical: {
        width: "70px",
        height: "70px",
        objectFit: "cover",
        cursor: "pointer",

    },

    mainImage: {
        width: "450px",
        maxWidth: "100%",

    },

    /* INFO PRODOTTO */
    infoColumn: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        minWidth: "300px"
    },

    category: {
        color: "#555",
        fontSize: "0.9rem"
    },

    price: {
        fontSize: "1.4rem",
        fontWeight: "bold"
    },

    /* ACCORDION */
    accordion: {
        borderTop: "1px solid #ddd",
        paddingTop: "1rem",
        marginTop: "1rem"
    },

    accordionHeader: {
        width: "100%",
        background: "none",
        border: "none",
        padding: "1rem 0",
        fontSize: "1.1rem",
        fontWeight: "bold",
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer"
    },

    accordionContent: {
        padding: "0.5rem 0",
        color: "#444",
        lineHeight: "1.5"
    },

    /* TAGLIE */
    sizesRow: {
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap"
    },

    sizeButton: {
        padding: "0.6rem 1rem",
        border: "1px solid black",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "0.9rem"
    },

    /* BOTTONI */
    buttonsRow: {
        display: "flex",
        gap: "1rem",
        marginTop: "1rem"
    },

    cartButton: {
        flex: 1,
        padding: "1rem",
        background: "black",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.5rem"
    },

    wishlistButton: {
        padding: "1rem",
        background: "white",
        border: "1px solid black",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "1.2rem",
        width: "60px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
};
