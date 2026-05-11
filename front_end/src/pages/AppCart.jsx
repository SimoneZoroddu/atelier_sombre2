/* Import hooks and functionalities */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
/* Import context */
import { useShop } from "../contexts/GlobalContext";
/* Import css */
import "./AppCart.css";
export default function AppCart() {
  /* declare support variables */
  const { cartList, setCartList } = useShop();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [cartTotal, setCartTotal] = useState(0);
  const navigate = useNavigate();

  /* get data from localStorage */
  useEffect(() => {
    let storedCartList = localStorage.getItem('cart');

    if (storedCartList) {
      /* get and parse data */
      setCartList(JSON.parse(storedCartList)); /* ⚠️ should be checked if no parsing error */

    } else {
      setCartList([])
    }
    setIsInitialLoading(false);

  }, [setCartList]);
  //console.log(cartList);

  /* keep update data in localStorage */
  useEffect(() => {

    if (!isInitialLoading) {
      localStorage.setItem('cart', JSON.stringify(cartList));
    }
  }, [cartList, isInitialLoading]);

  /* get cart total */
  /* ⚠️ to be implemented, add if discount */
  useEffect(() => {
    setCartTotal(cartList.map(item => item.price * item.quantity).reduce((a, b) => a + b, 0));
  }, [cartList]);

  /* handle checkout */
  function handleCheckout() {
    /* save data to localStorage */
    localStorage.setItem('total_price', String(cartTotal));

    /* redirect to checkout */
    navigate('/checkout')
  }
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
          <button className="btn_continue">Continua lo shopping</button>
        </div>
      ) : (
        <div className="cart_content">

          {/* ── SINISTRA: lista prodotti ── */}
          <section className="cart_body">
            <ul className="cart_list">
              {cartList.map((item) => (
                <li className="cart_item" key={item.name + item.color}>

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

                    <p className="item_price">€ {item.price}</p>

                    {/* QUANTITÀ */}
                    <div className="item_quantity">
                      {/* Decrement quantity or delete item */}
                      <button className="qty_btn"
                        onClick={() => {
                          /* Delete if quantity = 1 */
                          if (item.quantity === 1) {
                            setCartList(cartList.filter(i =>
                              !(i.name === item.name && i.color === item.color)))
                          } else { /* Decrement quantity if >= 2 */
                            setCartList(cartList.map(i => i.name === item.name && i.color === item.color ? { ...i, quantity: i.quantity - 1 } : i))
                          }
                        }}>
                        {item.quantity === 1 ? <i className="bi bi-trash3"></i> : "−"}
                      </button>
                      {/* Show quantity */}
                      <span>{item.quantity}</span>
                      {/* Increment quantity */}
                      <button className="qty_btn"
                        onClick={() => setCartList(cartList.map(i => i.name === item.name && i.color === item.color ? { ...i, quantity: i.quantity + 1 } : i))}>
                        +
                      </button>
                    </div>

                    {/* RIMUOVI */}
                    <button className="remove_btn">Rimuovi</button>
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




{/* nella card mostra quantità (modificabile) e cestino */ }
{/* mostra totale */ }
{/* OPZIONALE: mostra in basso wishlist con possibilità di aggiunta diretta */ }