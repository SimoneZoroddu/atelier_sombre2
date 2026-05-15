import { createContext, useContext, useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useShop } from "./GlobalContext";

const DetailContext = createContext();

export function useDetail() {
    return useContext(DetailContext);
}

export function DetailProvider({ children }) {
    const { name, color } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { cartList, setCartList, setGenre, addWishlist, isInWishlist } = useShop();

    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [selectedSize, setSelectedSize] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [recommended, setRecommended] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [openShipping, setOpenShipping] = useState(null);

    //gestione ovelay
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    //gestione errori
    const [error, setError] = useState(null);
    const [sizeErrorr, setSizeError] = useState(false);
    const [saved, setSaved] = useState(false);

    //gestione quantità e carrello
    const [stockMap, setStockMap] = useState({});

    // gestione messaggio di conferma ordine
    const [toastMessage, setToastMessage] = useState("");

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
        if (location.key !== "default") {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    function capitalizeWords(str) {
        if (!str) return "";
        return str
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    const originalPrice = product ? Number(product.price) : 0;
    const discount = product ? product.on_sale : 0;
    const finalPrice = discount !== 0
        ? (originalPrice * (1 - discount / 100)).toFixed(2)
        : originalPrice.toFixed(2);

    function addToCart() {
        setSizeError(false);
        if (!selectedSize) {
            setTimeout(() => setSizeError(true), 1000);
            return;
        }

        const availableStock = stockMap[selectedSize] ?? 0;
        const originalStock = product.quantity.find(
            q => q.size === selectedSize
        )?.stock || 0;
        if (quantity > availableStock) {
            alert(`Disponibilità insufficiente. Stock rimanente per questa taglia: ${availableStock}`);
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
            finalPrice: finalPrice,
            maxStock: originalStock
        };

        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = existingCart.find(
            item => item.id === cartItem.id && item.size === cartItem.size
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            existingCart.push(cartItem);
        }

        localStorage.setItem("cart", JSON.stringify(existingCart));

        setStockMap(prev => ({
            ...prev,
            [selectedSize]: prev[selectedSize] - quantity
        }));

        if (availableStock - quantity === 0) {
            setSelectedSize(null);
        }

        setQuantity(1);
        setToastMessage("Prodotto aggiunto al carrello!");
        setTimeout(() => setToastMessage(""), 3000);

        setCartList(JSON.parse(localStorage.getItem("cart")));
    }

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`http://127.0.0.1:3000/products/${name}/${color}`);
                if (!res.ok) throw new Error(`Errore ${res.status}`);

                const data = await res.json();
                setProduct(data);
                setMainImage(data.image.main_image_url);

                const map = {};
                data.quantity.forEach(q => {
                    map[q.size] = q.stock;
                });
                setStockMap(map);

            } catch (err) {
                setError("Impossibile caricare il prodotto. Riprova più tardi.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [name, color]);

    useEffect(() => {
        if (!product) return;

        const fetchRecommended = async () => {
            try {
                const res = await fetch("http://127.0.0.1:3000/products/index/?page=1&limit=50");
                if (!res.ok) throw new Error(`Errore ${res.status}`);

                const allProducts = await res.json();
                const filtered = allProducts.results
                    .filter(p => p.category === product.category)
                    .filter(p => p.genre === product.genre)
                    .slice(0, 4);

                setRecommended(filtered);

            } catch (err) {
                console.warn("Prodotti consigliati non disponibili:", err.message);
            }
        };

        fetchRecommended();
    }, [product]);

    useEffect(() => {
        if (!product) return;

        const map = {};

        product.quantity.forEach(q => {
            map[q.size] = q.stock;
        });

        cartList
            .filter(item => item.id === product.id)
            .forEach(item => {
                if (map[item.size] !== undefined) {
                    map[item.size] = Math.max(
                        0,
                        map[item.size] - item.quantity
                    );
                }
            });

        setStockMap(map);

    }, [cartList, product]);

    const value = {
        product, setProduct,
        mainImage, setMainImage,
        selectedSize, setSelectedSize,
        loading, setLoading,
        showDetails, setShowDetails,
        recommended, setRecommended,
        quantity, setQuantity,
        openShipping, setOpenShipping,
        isFullscreen, setIsFullscreen,
        currentIndex, setCurrentIndex,
        error, setError,
        sizeErrorr, setSizeError,
        saved, setSaved,
        stockMap, setStockMap,
        toastMessage, setToastMessage,
        shippingInfo,
        handleBack,
        capitalizeWords,
        addToCart,
        originalPrice,
        finalPrice,
        addWishlist,
        isInWishlist,
        cartList,
        location
    };

    return (
        <DetailContext.Provider value={value}>
            {children}
        </DetailContext.Provider>
    );
}
