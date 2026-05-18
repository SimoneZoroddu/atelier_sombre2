import { useEffect } from "react";
import { Link } from "react-router-dom"
import { useShop } from "../contexts/GlobalContext"



export default function AppSideBarCart() {

    const { cartList, setCartList, isInitialLoading, setIsInitialLoading, cartTotal, normalizedName, normalizedColor, isVisibleCart, setIsVisibleCart } = useShop()

    function updateCart(updatedCart) {
        setCartList(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    }


    return (
        <>
            <div className="background_overlay_sidecart" onClick={(e) => setIsVisibleCart(!isVisibleCart)}>
            </div>
            <div className="cart_sidebar_overlay border-0 px-2">
                <div className="overflow-auto py-3 height_sidecartlist">
                    <div className="d-flex">
                        <h1 className="d-inline me-auto">
                            Il tuo Carrello
                        </h1>
                        <button className="btn-close" onClick={() => setIsVisibleCart(!isVisibleCart)}>

                        </button>
                    </div>
                    {
                        cartList.map((item, index) => (
                            <div key={index} className="pb-3">
                                {/* IMMAGINE — nascosta su mobile via CSS */}

                                {/* INFO */}
                                <div className="item_info text-center">
                                    <img src={item.image} alt={item.name} className="center_image_cart mx-auto" />
                                    <Link to={`/products/${normalizedName(item.name)}/${normalizedColor(item.color)}`} >
                                        <h3 className="item_name">{item.name}</h3>
                                    </Link>
                                    {item.price !== item.finalPrice ? (
                                        <div className="price d-flex justify-content-around">
                                            <div>
                                                <span style={{ textDecoration: "line-through", color: "#8a8888", marginRight: "0.5rem" }}>
                                                    {item.price} €
                                                </span>
                                                <span style={{ fontWeight: 550, }}>
                                                    {item.finalPrice} €
                                                </span>
                                            </div>
                                            <span className="" >
                                                -{item.discount}%
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="price">{item.price} €</p>
                                    )}
                                    {/* QUANTITÀ */}
                                    <div className="item_quantity">
                                        {/* Decrement quantity or delete item */}
                                        <button
                                            className="qty_btn mx-auto"
                                            disabled={item.quantity === 1}
                                            onClick={() => {
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
                                        <span className="mx-auto">{item.quantity}</span>
                                        {/* Increment quantity */}
                                        <button
                                            className="qty_btn mx-auto"
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
                                        className="remove_btn mx-auto"
                                        onClick={() => {
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
                {
                    cartList.length > 0
                        ?
                        <div className="height_sidecartpayment pt-4 bg-black text-white px-3">
                            <div className="sidebar_row ">
                                <span>Spedizione Gratuita sopra i <span className="text-success">200€</span></span>
                            </div>
                            <div className="sidebar_row">
                                <span className="fs-4">Subtotale</span>
                                <strong>€ {cartTotal}</strong>
                            </div>
                            <Link to="/cart" className="fs-3 text-white underline_hover box_shadow_cart" onClick={(e) => setIsVisibleCart(!isVisibleCart)}>
                                Procedi al Carrello
                            </Link>
                        </div>
                        :
                        <>
                            <div className="d-flex justify-content-center fs-1 pb-1">
                                Il tuo Carrello é Vuoto
                            </div>
                            <div className=" d-flex justify-content-center text-decoration-none">
                                <button className="btn_continue" onClick={() => setIsVisibleCart(!isVisibleCart)}>Continua lo shopping</button>
                            </div>
                        </>
                }
            </div>

        </>
    )
}