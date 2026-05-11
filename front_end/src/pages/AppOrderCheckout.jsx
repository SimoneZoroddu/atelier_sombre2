/* Import hooks */
import { useState, useEffect } from "react";
/* Import context */
import { useShop } from "../contexts/GlobalContext";
import axios from "axios";

export default function AppOrderCheckout() {

  //console.log(localStorage);
  const total_price = localStorage.getItem("total_price");
  const storedCartList = JSON.parse(localStorage.getItem('cart'));
  const [cartList, setCartList] = useState(storedCartList);
let vatNumb = `IT${Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join('')}`

  const [order, setOrder] = useState({
    firstname: "",
    lastname: "",
    email: "",
    telephone_number: "",
    fiscal_code: "",
    vat_number: "vatNumb",
    country: "",
    region: "",
    city: "",
    street: "",
    zip_code: "",
    total_price: `${total_price}`,
  });
   
  const [productsData, setProductsData] = useState([]);

  const { loading, setLoading } = useShop();

  const orderUrl = import.meta.env.VITE_API_ADDRESS + 'add-order';
  const productsDataUrl = import.meta.env.VITE_API_ADDRESS + 'add-order';



  useEffect(() => {
    setProductsData(
      cartList.map(item => (
        {
          variant_id: Number(item.id),
          quantity: Number(item.quantity),
          price: Number(item.price),
        }
      )
      )
    )
  }, [cartList])
  //console.log(productsData);

  /* get user data from localStorage (if any) */
  useEffect(() => {
    const savedOrderData = localStorage.getItem('order');
    if (savedOrderData) {
      /* keep total price updated */
      setOrder(JSON.parse(savedOrderData));
      //console.log(order);
    }
  }, [total_price])

  /* update user data */
  function handleInputChange(e) {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
    //console.log(order);
  }
  /* save updated user data to localStorage */
  useEffect(() => {
    localStorage.setItem('order', JSON.stringify(order));
  }, [order]);


  function handleOrderSubmit(e) {
    /* prevent default */
    e.preventDefault();
    /* Validate data */
    // ⚠️ todo
    /* Build req body */
    const body = {
      order: { ...order, total_price: Number(order.total_price) },
      items: productsData
    };
    console.log(body);
    /* Set loader */
    setLoading(true);
    /* Submit data */
    axios.post(orderUrl, body)
      .then(res => {
        console.log(res.data);
      })
      /* Handle server error */
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
        console.log("Order request completed");
        //clear cart and total price from local Storage
        // ⚠️ todo
        //clear form
        // ⚠️ todo
        //navigate to confirmation/order page
        // ⚠️ todo
      });
      /* Handle success */
      // ⚠️ todo
      /* Handle error */
      // ⚠️ todo
  }

  return (
    <>
      <div className="container">
        {/* Get user data */} {/* ⚠️ todo: ?? visibility on/off or collapse or tabs to navigate between forms, ?? componentize */}
        <form className="user_data" onSubmit={handleOrderSubmit}>
          <div className="m-3">
            <h2>Dati personali</h2>
          </div>
          <div className="row row-cols-2 m-3">
            <div className="mb-3">
              <label htmlFor="firstname_field" className="form-label">Nome</label>
              <input type="text" className="form-control" id="firstname_field"
                name="firstname" value={order.firstname}
                onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="lastname_field" className="form-label">Cognome</label>
              <input type="text" className="form-control" id="lastname_field"
                name="lastname" value={order.lastname}
                onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="email_field" className="form-label">Email</label>
              <input type="email" className="form-control" id="email_field" aria-describedby="emailHelp"
                name="email" value={order.email}
                onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="telephone_number_field" className="form-label">Telefono</label>
              <input type="text" className="form-control" id="telephone_number_field"
                name="telephone_number" value={order.telephone_number}
                onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="fiscal_code_field" className="form-label">Codice Fiscale</label>
              <input type="text" className="form-control" id="fiscal_code_field"
                name="fiscal_code" value={order.fiscal_code}
                onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="country_field" className="form-label">Paese</label>
              <input type="text" className="form-control" id="country_field"
                name="country" value={order.country}
                onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="region_field" className="form-label">Regione</label>
              <input type="text" className="form-control" id="region_field"
                name="region" value={order.region}
                onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="city_field" className="form-label">Città</label>
              <input type="text" className="form-control" id="city_field"
                name="city" value={order.city}
                onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="street_field" className="form-label">Indirizzo</label>
              <input type="text" className="form-control" id="street_field"
                name="street" value={order.street}
                onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="zip_code_field" className="form-label">CAP</label>
              <input type="text" className="form-control" id="zip_code_field"
                name="zip_code" value={order.zip_code}
                onChange={handleInputChange} />
            </div>
          </div>
          <div className="jw-100 d-flex justify-content-end">
            <button type="submit" className="btn btn-dark">Salva e Procedi con l'ordine</button>
          </div>
        </form>

        {/* Payment placeholder */}
        <div className="m-3">
          <h3>Seleziona il metodo di pagamento</h3>
          <div className="m-3">
            {/* credit card option */}
            <div className="form-check">
              <input className="form-check-input" type="radio" name="radioDefault" id="radioDefault1" />
              <label className="form-check-label" htmlFor="radioDefault1">
                <i className="bi bi-credit-card-fill"></i> Carta di credito
              </label>
            </div>
            {/* apple pay option */}
            <div className="form-check">
              <input className="form-check-input" type="radio" name="radioDefault" id="radioDefault2" />
              <label className="form-check-label" htmlFor="radioDefault2">
                <i className="bi bi-apple"></i> Apple Pay
              </label>
            </div>
            {/* google pay option */}
            <div className="form-check">
              <input className="form-check-input" type="radio" name="radioDefault" id="radioDefault2" />
              <label className="form-check-label" htmlFor="radioDefault2">
                <i className="payment-icon g-pay-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg></i> Google Pay
              </label>
            </div>
            {/* paypal option */}
            <div className="form-check">
              <input className="form-check-input" type="radio" name="radioDefault" id="radioDefault2" />
              <label className="form-check-label" htmlFor="radioDefault2">
                <i className="bi bi-paypal"></i> PayPal
              </label>
            </div>
          </div>
        </div>

      </div>
    </>
  )

}
