/* Import hooks and functionalities */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
/* Import context */
import { useShop } from "../../contexts/GlobalContext";
/* Import css */
import "./AppCart.css";
/* import Loader */
import Loader from "../../components/Loader";
/* import ErrorMessage */
import ErrorMessage from "../../components/ErrorMessage";
export default function AppCart() {
  /* declare support variables */
<<<<<<< HEAD
  const { cartList, setCartList, isInitialLoading, setIsInitialLoading, cartTotal, shippingCost, setShippingCost, normalizedName, normalizedColor, loading, error } = useShop();
/*   const [shippingCost, setShippingCost] = useState(0) */
=======
  const { cartList, setCartList, isInitialLoading, setIsInitialLoading, cartTotal, normalizedName, normalizedColor, loading, error, handleBack } = useShop();
>>>>>>> develop
  const navigate = useNavigate();


  /* Handle free shipping */
/*   useEffect(() => {
    setShippingCost(cartTotal >= 200 ? 0 : 60);
  }, [cartTotal]); */

  /* handle checkout */
  function handleCheckout() {
    /* save data to localStorage */
    localStorage.setItem('total_price', String(cartTotal));

    /* redirect to checkout */
    navigate('/checkout')
  }

  /* Handle early return if error or no data */
  if (error) return <ErrorMessage message={error} />;
  if (loading) return <Loader />;

  console.log(localStorage);

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
          <h2>Shopping bag</h2>
          <span className="cart_count">({cartList.length}) prodotti</span>
        </header>

        {cartList.length === 0 ? (
          <div className="cart_empty">
            <p>La tua Shopping bag è vuota</p>
            <Link to="/shoes" state={{ scrollPosition: window.scrollY }} >
              <button className="btn_continue">Continua lo shopping</button>
            </Link>
          </div>
        ) : (
          <div className="cart_content">

<<<<<<< HEAD
          {/* ── SINISTRA: lista prodotti ── */}
          <section className="cart_body">
            <ul className="cart_list">
              {cartList.map((item) => (
                <li className="cart_item" key={`${item.name}-${item.color}-${item.size}`}>
=======
            {/* ── SINISTRA: lista prodotti ── */}
            <section className="cart_body">
              <ul className="cart_list">
                {cartList.map((item, index) => (
                  <li className="cart_item" key={index}>
>>>>>>> develop

                    {/* IMMAGINE — nascosta su mobile via CSS */}
                    <div className="item_image_wrapper">
                      <img src={item.image} alt={item.name} className="item_image" />
                    </div>

<<<<<<< HEAD
                    {Number(item.price) !== Number(item.finalPrice) ? (
                      <p className="price">
                        <span style={{ textDecoration: "line-through", color: "#8a8888", marginRight: "0.5rem" }}>
                          {Number(item.price).toFixed(2)} €
                        </span>
                        <span style={{ fontWeight: 550, }}>
                          {Number(item.finalPrice).toFixed(2)} €
                        </span>
=======
                    {/* INFO */}
                    <div className="item_info">
                      <Link to={`/products/${normalizedName(item.name)}/${normalizedColor(item.color)}`}  state={{ scrollPosition: window.scrollY }}>
                        <h3 className="item_name">{item.name}</h3>
                      </Link>
>>>>>>> develop

                      <div className="item_meta">
                        <p>Taglia: <strong>{item.size}</strong></p>
                        <p>Colore: <strong>{item.color}</strong></p>
                      </div>

<<<<<<< HEAD
                    {/* QUANTITÀ */}
                    <div className="item_quantity">
                      {/* Decrement quantity or delete item */}
                      <button className="qty_btn" disabled={item.quantity === 1}
                        onClick={() => {
                          setCartList(cartList.map(i =>
                            i.name === item.name &&
                              i.color === item.color &&
                              i.size === item.size
                              ?
                              { ...i, quantity: i.quantity - 1 }
                              :
                              i
                          ));
                        }}
                      >
                        —
                      </button>
                      {/* Show quantity */}
                      <span>{item.quantity}</span>
                      {/* Increment quantity */}
=======
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
>>>>>>> develop
                      <button
                        className="remove_btn"
                        onClick={() => {
<<<<<<< HEAD
                          setCartList(cartList.map(i =>
                            i.name === item.name &&
                              i.color === item.color &&
                              i.size === item.size
                              ?
                              { ...i, quantity: i.quantity + 1 }
                              :
                              i
                          ));
=======
                          const updatedCart = cartList.filter(i =>
                            !(
                              i.name === item.name &&
                              i.color === item.color &&
                              i.size === item.size
                            )
                          );

                          updateCart(updatedCart);
>>>>>>> develop
                        }}
                      >
                        Rimuovi
                      </button>

                    </div>

<<<<<<< HEAD
                    {/* RIMUOVI */}
                    <button
                      className="remove_btn"
                      onClick={() => {
                        setCartList(cartList.filter(i =>
                          !(
                            i.name === item.name &&
                            i.color === item.color &&
                            i.size === item.size
                          )
                        ));
                      }}
                    >
                      Rimuovi
                    </button>
=======
                  </li>
                ))}
              </ul>
            </section>

            {/* ── DESTRA: riepilogo ordine ── */}
            <aside className="cart_sidebar">
>>>>>>> develop

              <h3 className="sidebar_title">Riepilogo ordine</h3>
              <div className="sidebar_row text-success">
                <span>Spedizione Gratuita sopra i 200€</span>
              </div>
              <div className="sidebar_row">
                <span>Subtotale</span>
                <strong>€ {cartTotal}</strong>
              </div>

              {(cartTotal >= 200)
                ?
                <div className="sidebar_row">
                  <span>Spedizione</span>
                  <span className="shipping_placeholder text-success">Gratis</span>
                </div>
                :
                <div className="sidebar_row">
                  <span>Spedizione</span>
                  <span className="shipping_placeholder">{shippingCost}</span>
                </div>
              }



              <div className="sidebar_row sidebar_total">
                <span>Totale stimato</span>
                <strong>€ {cartTotal + shippingCost}</strong>
              </div>

              <button className="btn_checkout" onClick={handleCheckout}>
                Procedi all'acquisto
              </button>


            </aside>

          </div>
        )}

      </div>

    </>
  )
}


{/* ⚠️ ToDo:
  - OPZIONALE: mostra in basso wishlist con possibilità di aggiunta diretta al carrello
  - 
  */ }