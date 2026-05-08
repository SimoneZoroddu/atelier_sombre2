/* Import hooks */
import { useState, useEffect } from "react";
/* Import context */
import { useShop } from "../contexts/GlobalContext";

export default function AppCart() {
  const { cartList, setCartList } = useShop();
  const [cartTotal, setCartTotal] = useState(0); /* ⚠️ static, to be implemented */
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  /* get data from localStorage */
  useEffect(() => {
    let storedCartList = localStorage.getItem('cart');

    if (storedCartList) {
      /* check the parsing */
      setCartList(JSON.parse(storedCartList)) /* ⚠️ should be checked if no parsing error */
    } else {
      setCartList([])
    }
    setIsInitialLoading(false);
  }, []);
  console.log(cartList);

  /* keep update data in localStorage */
  useEffect(() => {
    if (!isInitialLoading) {
      localStorage.setItem('cart', JSON.stringify(cartList))
    }
  }, [cartList, isInitialLoading]);

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
                  <img src={item.image} alt={item.name} className="item_image" height="200px" />
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




{/* nella card mostra quantità (modificabile) e cestino */ }
{/* mostra totale */ }
{/* OPZIONALE: mostra in basso wishlist con possibilità di aggiunta diretta */ }