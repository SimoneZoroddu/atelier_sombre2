/* Import hooks */
import { useState, useEffect } from "react";
/* Import context */
//import { useShop } from "../contexts/GlobalContext";

/* Andrà sostituito con l'array fetchato dal DB */
/* const cartList = [
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
]; */



/* function addToCart() {
  if (!selectedSize) {
    alert("Seleziona una taglia prima di aggiungere al carrello.");
    return;

  }
  const cartItem = {
    Id: product.id,
    name: product.name,
    color: product.color,
    image: product.image.main_image_url,
    price: product.price,
    size: selectedSize,

  }
} */

const cartItem = {/* qui i dati recuperati dalla pagina dettaglio */};
function AddToCartList() {
  /* Initialize localStorage */
  const [cartList, setCartList] = useState(() => {
    const saved = localStorage.setItem('cartList');
    return saved ? JSON.parse(saved) : [];
  });
  /* Save changes to localStorage */
useEffect(() => {
  localStorage.setItem('cartList', JSON.stringify(cartList));
}, [cartList]);

return (
  <button onClick={() => setCartList([...cartList, cartItem])}>
    Bottone
  </button>
)
}



export default function AppCart() {
  const [cartTotal, setCartTotal] = useState(0); /* ⚠️ static, to be implemented */

  function AddCartList() {
    const [cartList, setcartList] = useState([]);

    useEffect(() => {
      const saved = localStorage.getItem('');
      if (saved) setcartList(saved);
    }, []);

    useEffect(() => {
      localStorage.setItem('cartList', cartList);
    }, [cartList]);

    return (
      <button onClick={() => setcartList(t => t === 'light' ? 'dark' : 'light')}>
        cartList: {cartList}
      </button>
    );
  }

  function renderCart() {
    /* Declare support variables */
    //const { cartList, setCartList } = useShop();

    if (cartList.length === 0) {
      return (
        <>
          <div>La tua Shopping bag è vuota</div>
          <div>Continua lo shopping</div>
        </>
      )
    } else {
      return (
        <div className="container cart_list_container">
          <div className="cart_list">

            {cartList.map((item) => (
              <div className="row row-cols-2d-flex justify-content-between bg-light my-1 gx-0 cart_list_item" key={item.name + item.color}>
                <div className="col-6 d-flex item_info">
                  <img src={item.image} alt={item.name} className="item_image" height="150px" />
                  <div className="mx-3">
                    <div className="fs-5 my-2 item_name">{item.name}</div>
                    <div className="item_details">
                      <div className="item_size">
                        Taglia
                        <span className="fw-semibold"> {item.size}</span>
                      </div>
                      <div className="item_color">
                        Color
                        <span className="fw-semibold"> {item.color}</span>
                      </div>
                      <div className="my-2 item_price">
                        € {item.price}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col item_amount">
                  <ul className="list-group list-group-horizontal small">
                    <li className="list-group-item p-2 bg-light">+</li>
                    <li className="list-group-item p-2">{item.quantity}</li>
                    <li className="list-group-item p-2 bg-light">-</li>
                  </ul>
                </div>
                <div className="col ">Rimuovi</div>
              </div>
            ))}

          </div>
        </div>
      )
    }
  }
  return (
    <>
      <div className="container cart_container d-flex flex-column">

        {AddCartList()}{/* ⚠️ it's a test, to be removed */}

        <div className="cart_header ">
          <h2>
            Shopping bag
          </h2>
          <div>
            {(cartList.length === 0) ? <span>(0)</span> : <span>({cartList.length}) </span>}
            prodotti
          </div>
        </div>

        <div className="cart_body">
          {renderCart()}
        </div >

        <div className="cart_footer text-end my-3">
          <div className="d-flex justify-content-between fs-5 my-3 cart_total">
            <div className="fw-semibold">Subtotale:</div>
            <div> € {cartTotal}</div>
          </div>
          <div className="cart_checkout">
            <button type="submit" className="btn btn-dark">
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