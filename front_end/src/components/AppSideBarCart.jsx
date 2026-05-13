import { useEffect } from "react";
import { Link } from "react-router-dom"
import { useShop } from "../contexts/GlobalContext"



export default function AppSideBarCart() {

    const { cartList, setCartList, isInitialLoading, setIsInitialLoading, cartTotal, normalizedName, normalizedColor } = useShop()

    function updateCart(updatedCart) {
        setCartList(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    return (
        <div className="col-1 border-0 cart_sidebar d-none d-lg-inline">
            <div className="sidebar_row">
                <span>Spedizione Gratuita sopra i 200€</span>
            </div>
            <div className="sidebar_row">
                <span>Subtotale</span>
                <strong>€ {cartTotal}</strong>
            </div>
            <Link to="/cart" className="fs-5 text-black underline_hover">
                Procedi al Carrello
            </Link>
            {
                cartList.map((item, index) => (
                    <div key={index}>
                        {/* IMMAGINE — nascosta su mobile via CSS */}
                        <div className="item_image_wrapper">
                            <img src={item.image} alt={item.name} className="item_image" />
                        </div>

                        {/* INFO */}
                        <div className="item_info">
                            <Link to={`/products/${normalizedName(item.name)}/${normalizedColor(item.color)}`}>
                                <h3 className="item_name">{item.name}</h3>
                            </Link>
                            {item.price !== item.finalPrice ? (
                                <p className="price">
                                    <span style={{ textDecoration: "line-through", color: "#8a8888", marginRight: "0.5rem" }}>
                                        {item.price} €
                                    </span>
                                    <span style={{ fontWeight: 550, }}>
                                        {item.finalPrice} €
                                    </span>

                                </p>
                            ) : (
                                <p className="price">{item.price} €</p>
                            )}

                            {/* QUANTITÀ */}
                            <div className="item_quantity">
                                {/* Decrement quantity or delete item */}
                                <button
                                    className="qty_btn"
                                    disabled={item.quantity === 1}

                                    onClick={() => {

                                        /* 🔵 NUOVO */
                                        const updatedCart = cartList.map(i =>
                                            i.name === item.name &&
                                                i.color === item.color &&
                                                i.size === item.size
                                                ?
                                                { ...i, quantity: i.quantity - 1 }
                                                :
                                                i
                                        );

                                        updateCart(updatedCart);
                                    }}
                                >
                                    —
                                </button>
                                {/* Show quantity */}
                                <span>{item.quantity}</span>
                                {/* Increment quantity */}
                                <button
                                    className="qty_btn"

                                    disabled={item.quantity >= item.maxStock}

                                    onClick={() => {

                                        if (item.quantity >= item.maxStock) return;

                                        const updatedCart = cartList.map(i =>
                                            i.name === item.name &&
                                                i.color === item.color &&
                                                i.size === item.size
                                                ?
                                                { ...i, quantity: i.quantity + 1 }
                                                :
                                                i
                                        );

                                        updateCart(updatedCart);
                                    }}
                                >
                                    +
                                </button>
                            </div>

                            {/* RIMUOVI */}
                            <button
                                className="remove_btn"

                                onClick={() => {

                                    /* 🔵 NUOVO */
                                    const updatedCart = cartList.filter(i =>
                                        !(
                                            i.name === item.name &&
                                            i.color === item.color &&
                                            i.size === item.size
                                        )
                                    );

                                    updateCart(updatedCart);
                                }}
                            >
                                Rimuovi
                            </button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}