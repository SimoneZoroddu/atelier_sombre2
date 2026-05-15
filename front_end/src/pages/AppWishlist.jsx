/* Import hooks and functionalities */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
/* Import context */
import { useShop } from "../contexts/GlobalContext";


export default function AppWishlist() {

    const {
        storeWishlist,
        setStoreWishlist,
        normalizedName,
        normalizedColor,
        handleBack
    } = useShop()


    function calculateFinalPrice(item) {

        const originalPrice = Number(item.price);
        const discount = Number(item.on_sale);

        if (discount > 0) {
            return (originalPrice * (1 - discount / 100)).toFixed(2);
        }

        return originalPrice.toFixed(2);
    }

    function removeFromWishlist(indexToRemove) {

        const updatedWishlist = storeWishlist.filter(
            (_, index) => index !== indexToRemove
        );

        localStorage.setItem(
            'wishlist',
            JSON.stringify(updatedWishlist)
        );

        setStoreWishlist(updatedWishlist);
    }

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
            <div className="cart_container">

                {/* HEADER */}
                <header className="cart_header">
                    <h2>Wishlist</h2>
                    <span className="cart_count">({storeWishlist?.length}) prodotti</span>
                </header>

                {storeWishlist?.length === 0 ? (
                    <div className="cart_empty">
                        <p>La tua Wishlist è vuota</p>
                        <Link to="/shoes" >
                            <button className="btn_continue">Continua lo shopping</button>
                        </Link>
                    </div>
                ) : (
                    <div className="cart_content">


                        <section className="cart_body">
                            <ul className="cart_list">
                                {storeWishlist?.map((item, index) => (
                                    <li className="cart_item" key={index}>


                                        <div className="item_image_wrapper">
                                            <img src={item.image.main_image_url} alt={item.name} className="item_image" />
                                        </div>


                                        <div className="item_info">
                                            <Link to={`/products/${normalizedName(item.name)}/${normalizedColor(item.color)}`}>
                                                <h3 className="item_name">{item.name}</h3>
                                            </Link>
                                            <div className="item_meta">
                                                <p>Colore: <strong>{item.color}</strong></p>
                                            </div>

                                            {item.on_sale > 0 ? (

                                                <p className="price">
                                                    <span style={{ textDecoration: "line-through", color: "#8a8888", marginRight: "0.5rem" }}     >
                                                        {item.price} €
                                                    </span>
                                                    <span style={{ fontWeight: 550 }}>
                                                        {calculateFinalPrice(item)} €
                                                    </span>
                                                </p>

                                            ) : (

                                                <p className="price">
                                                    {item.price} €
                                                </p>

                                            )}
                                            <button className="remove_btn" onClick={() => removeFromWishlist(index)} >
                                                Rimuovi
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                    </div>
                )}

            </div>

        </>
    )
}
