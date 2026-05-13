import { useEffect } from "react";
import { Link } from "react-router-dom"
import { useShop } from "../contexts/GlobalContext"



export default function AppSideBarCart() {

    const { cartList, setCartList, isInitialLoading, setIsInitialLoading, cartTotal, normalizedName, normalizedColor } = useShop()


    return (
        <div className="col-1 cart_sidebar">
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
                                <button className="qty_btn" disabled={item.quantity === 1}
                                    onClick={() => {
                                        /* Decrement quantity if >= 2 */
                                        setCartList(cartList.map(i => i.name === item.name && i.color === item.color && i.size === item.size
                                            ?
                                            { ...i, quantity: i.quantity - 1 }
                                            :
                                            i))
                                    }
                                    }>
                                    —
                                </button>
                                {/* Show quantity */}
                                <span>{item.quantity}</span>
                                {/* Increment quantity */}
                                <button className="qty_btn"
                                    onClick={() => setCartList(cartList.map(i => i.name === item.name && i.color === item.color && i.size === item.size ? { ...i, quantity: i.quantity + 1 } : i))}>
                                    +
                                </button>
                            </div>

                            {/* RIMUOVI */}
                            <button className="remove_btn" onClick={() => setCartList(cartList.filter(i =>
                                !(i.name === item.name && i.color === item.color && i.size === item.size)))}>Rimuovi</button>
                        </div>
                    </div>
                ))
            }
            <div className="sidebar_row pt-3">
                <span>Subtotale</span>
                <strong>€ {cartTotal}</strong>
            </div>
            <Link to="/cart" className="fs-5 text-black underline_hover">
                Procedi al Carrello
            </Link>
        </div>
    )
}