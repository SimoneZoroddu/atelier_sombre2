/* Import hooks */
import { useState, useEffect } from "react";
/* Import context */
//import { useShop } from "../contexts/GlobalContext";

/* Andrà sostituito con l'array fetchato dal DB */
const cartItems = [
  {
    id: 1,
    user_id: 1,
    name: "Mocassino Gommino in Pelle",
    image: "https://placehold.co/100x130",
    color: "Marrone",
    size: 41,
    quantity: 1,
    price: 790,
  },
  {
    id: 2,
    user_id: 1,
    name: "Derby Stringato in Suede",
    image: "https://placehold.co/100x130",
    color: "Nero",
    size: 42,
    quantity: 1,
    price: 650,
  },
  {
    id: 3,
    user_id: 2,
    name: "Chelsea Boot in Vitello",
    image: "https://placehold.co/100x130",
    color: "Cognac",
    size: 43,
    quantity: 2,
    price: 920,
  },
  {
    id: 4,
    user_id: 1,
    name: "Sneaker in Pelle Traforata",
    image: "https://placehold.co/100x130",
    color: "Bianco",
    size: 40,
    quantity: 1,
    price: 480,
  },
  {
    id: 5,
    user_id: 2,
    name: "Sandalo Infradito in Cuoio",
    image: "https://placehold.co/100x130",
    color: "Cuoio",
    size: 41,
    quantity: 1,
    price: 390,
  },
  {
    id: 6,
    user_id: 2,
    name: "Oxford Brogue in Pelle Piena",
    image: "https://placehold.co/100x130",
    color: "Bordeaux",
    size: 44,
    quantity: 1,
    price: 710,
  },
];

export default function AppCart() {
  const [cartTotal, setCartTotal] = useState(0);

  function renderCart() {
    /* Declare support variables */
    //const { cartItems, setCartItems } = useShop();

    if (cartItems.length === 0) {
      return (
        <>
          <div>La tua Shopping bag è vuota</div>
          <div>Continua lo shopping</div>
        </>
      )
    } else {
      return (
        <div className="container cart_list_container">
          <section className="cart_list">
            <div className="row row-cols-1">

              {cartItems.map((item) => (
                <div className="col cart_list_item d-flex gap-3" key={item.id}>
                  <img src={item.image} alt={item.name} className="item_image" />
                  <div className="item_info ">
                    <div className="item_name">{item.name}</div>
                    <div className="item_details">
                      <div className="item_color">
                        Color
                        <span> {item.color}</span>
                      </div>
                      <div className="item_size">
                        Taglia
                        <span> {item.size}</span>
                      </div>
                      <div className="item_amount">
                        Quantità
                        <span> {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="item_price">
                      € {item.price}
                  </div>
                </div>
              ))}

            </div>
          </section>
        </div>
      )
    }
  }
  return (
    <>
      <div className="cart_container">

        <div className="cart_header">
          <h2>
            Shopping bag
          </h2>
          <div>
            {(cartItems.length === 0) ? <span>(0)</span> : <span>({cartItems.length}) </span>}
            prodotti
          </div>
        </div>

        <div className="cart_body">
          {renderCart()}
        </div >

        <div className="cart_footer">
          <div className="cart_total">
            Subtotale:
            <span> € {cartTotal}</span>
          </div>
          <div className="cart_checkout">
            <button type="submit">
              Procedi all'acquisto
            </button>
          </div >
        </div >

      </div >
    </>
  )
}




{/* nella card mostra immagine, nome, prezzo, quantità (modificabile) e cestino */ }
{/* mostra totale */ }
{/* OPZIONALE: mostra in basso wishlist con possibilità di aggiunta diretta */ }