/* Import hooks and functionalities */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
/* Import context */
import { useShop } from "../../contexts/GlobalContext";
/* Import css */
import "./AppCart.css";

export default function AppCart() {
  /* declare support variables */
  const { cartList, setCartList, isInitialLoading, setIsInitialLoading, cartTotal } = useShop();
  const navigate = useNavigate();
  
  
  //console.log(cartList);
  

  /* handle checkout */
  function handleCheckout() {
    /* save data to localStorage */
    localStorage.setItem('total_price', String(cartTotal));

    /* redirect to checkout */
    navigate('/checkout')
  }



  //console.log(cartList);



  return (
    <div className="cart_container">

      {/* HEADER */}
      <header className="cart_header">
        <h2>Shopping bag</h2>
        <span className="cart_count">({cartList.length}) prodotti</span>
      </header>

      {cartList.length === 0 ? (
        <div className="cart_empty">
          <p>La tua Shopping bag è vuota</p>
          <Link to="/shoes" >
            <button className="btn_continue">Continua lo shopping</button>
          </Link>
        </div>
      ) : (
        <div className="cart_content">

          {/* ── SINISTRA: lista prodotti ── */}
          <section className="cart_body">
            <ul className="cart_list">
              {cartList.map((item, index) => (
                <li className="cart_item" key={index}>

                  {/* IMMAGINE — nascosta su mobile via CSS */}
                  <div className="item_image_wrapper">
                    <img src={item.image} alt={item.name} className="item_image" />
                  </div>

                  {/* INFO */}
                  <div className="item_info">
                    <Link to={`/products/${item.name}/${item.color}`}>
                      <h3 className="item_name">{item.name}</h3>
                    </Link>

                    <div className="item_meta">
                      <p>Taglia: <strong>{item.size}</strong></p>
                      <p>Colore: <strong>{item.color}</strong></p>
                    </div>

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

                </li>
              ))}
            </ul>
          </section>

          {/* ── DESTRA: riepilogo ordine ── */}
          <aside className="cart_sidebar">

            <h3 className="sidebar_title">Riepilogo ordine</h3>

            <div className="sidebar_row">
              <span>Subtotale</span>
              <strong>€ {cartTotal}</strong>
            </div>

            <div className="sidebar_row">
              <span>Spedizione</span>
              <span className="shipping_placeholder">Calcolata al checkout</span>
            </div>

            <div className="sidebar_divider" />

            <div className="sidebar_row sidebar_total">
              <span>Totale stimato</span>
              <strong>€ {cartTotal}</strong>
            </div>

            <button className="btn_checkout" onClick={handleCheckout}>
              Procedi all'acquisto
            </button>

            {/* ECO BOX */}
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

          </aside>

        </div>
      )}

    </div>

  )
}


{/* ⚠️ ToDo:
  - OPZIONALE: mostra in basso wishlist con possibilità di aggiunta diretta al carrello
  - 
  */ }