/* Import HOOKS */
import { useState, useEffect } from "react";
/* Import CONTEXT */
import { useShop } from "../../contexts/GlobalContext";
/* Import DEPENDENCIES */
import axios from "axios";
/* Import COMPONENTS */
import Loader from "../../components/Loader";

export default function AppOrderCheckout() {
  /* Declare or destructure SUPPORT VARIABLES */
  const total_price = localStorage.getItem("total_price");
  const storedCartList = JSON.parse(localStorage.getItem('cart') || '[]');
  const orderUrl = import.meta.env.VITE_API_ADDRESS + 'orders/add-order';
  /* const [cartList, setCartList] = useState(storedCartList); */
  const [productsData, setProductsData] = useState([]);
  const { loading, setLoading, cartList, setCartList, cartTotal, shippingCost } = useShop();
  // const initialTotal = Number(cartTotal) + shippingCost;
  const [orderResponse, setOrderResponse] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [order, setOrder] = useState({
    firstname: "",
    lastname: "",
    email: "",
    telephone_number: "",
    fiscal_code: "",
    vat_number: "",
    country: "",
    region: "",
    city: "",
    street: "",
    zip_code: "",
    total_price: 0
  });

  // console.log(cartList);

  /* HANDLE cart ITEMS */
  /* SET and keep ITEMS updated */
  useEffect(() => {
    setProductsData(
      cartList.map(item => (
        {
          variant_id: Number(item.variant),
          quantity: Number(item.quantity),
          price: Number(item.finalPrice ?? item.price),
        }
      ))
    )
  }, [cartList])

  /* HANDLE ORDER DATA */
  /* GET ORDER DATA from localStorage (if any) */
  useEffect(() => {
    const savedOrderData = localStorage.getItem('order');
    if (!savedOrderData) return;
    try {
      const parsedOrderData = JSON.parse(savedOrderData);
      setOrder(prev => ({ ...prev, ...parsedOrderData }));
    }
    catch (err) {
      console.log('Invalid saved order JSON', err);
    }
  }, []);
  /* UPDATE ORDER DATA */
  function handleInputChange(e) {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  }
  /* UPDATE total PRICE */
  useEffect(() => {
    setOrder(prev => ({ ...prev, total_price: Number(cartTotal || 0) + Number(shippingCost || 0) }));
  }, [cartTotal, shippingCost]);

  /* SAVE updated ORDER DATA to localStorage */
  useEffect(() => {
    localStorage.setItem('order', JSON.stringify(order));
  }, [order]);

  /* Handle PAYMENT METHOD CHANGE*/
  function handleSelectedPayment(e) {
    setSelectedPayment(e.target.value);
  }

  /* HANDLE ORDER SUBMIT */
  function handleSubmit(e) {
    /* prevent default */
    e.preventDefault();
    /* VALIDATE data */
    // ⚠️ todo  
    /* HANDLE PAYMENT */
    /* Simulate payment processing */
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowPaymentSuccess(true);
      setIsSubmitted(true);

      /* Build REQ BODY */
      const computedTotal = Number(cartTotal || 0) + Number(shippingCost || 0);
      const body = {
        order: { ...order, total_price: computedTotal },
        items: productsData
      };
      console.log('body della post request ', body); // ⚠️ To B removed

      /* SUBMIT DATA */
      axios.post(orderUrl, body)
        .then(res => {
          /* Save RESPONSE STATE */
          setOrderResponse(res.data);
        })
        .catch(err => {
          console.error(err); // ⚠️ To B implemented with visual alert/feedback UX
        })
        .finally(() => {
          console.log("Order request completed");
          /* clear cart and total price from local Storage */
          setOrder({
            firstname: "",
            lastname: "",
            email: "",
            telephone_number: "",
            fiscal_code: "",
            vat_number: "",
            country: "",
            region: "",
            city: "",
            street: "",
            zip_code: "",
            total_price: 0
          })
          setCartList([]);
          localStorage.removeItem('cart');
          localStorage.removeItem('cartList');
          localStorage.removeItem('order');
          localStorage.removeItem('total_price');
          /* clear form */
          // ⚠️ todo

        });
    }, 2000);
  }

  /* CAPITALIZE function */
  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
  }



  return (
    <>
      <div className="container p-4">

        {/* Get order data */}
        {(!isSubmitted && !orderResponse) && (
          <form className="user_data" onSubmit={handleSubmit}>
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
                <label htmlFor="vat_number_field" className="form-label">P. IVA</label>
                <input type="text" className="form-control" id="vat_number_field"
                  name="vat_number" value={order.vat_number}
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
            {/* Payment placeholder */}
            <div className="container">
              <h3>Seleziona il metodo di pagamento</h3>
              <div className="d-flex m-3 gap-3" >
                <div className="m-3">
                  {/* credit card option */}
                  <div className="form-check">
                    <input className="form-check-input" type="radio" value="Carta di credito" name="paymentMethod" id="credit-card" onChange={handleSelectedPayment} />
                    <label className="form-check-label" htmlFor="credit-card">
                      <i className="bi bi-credit-card-fill"></i> Carta di credito
                    </label>
                  </div>
                  {/* apple pay option */}
                  <div className="form-check">
                    <input className="form-check-input" type="radio" value="Apple Pay" name="paymentMethod" id="apple-pay" onChange={handleSelectedPayment} />
                    <label className="form-check-label" htmlFor="apple-pay">
                      <i className="bi bi-apple"></i> Apple Pay
                    </label>
                  </div>
                  {/* google pay option */}
                  <div className="form-check">
                    <input className="form-check-input" type="radio" value="Google Pay" name="paymentMethod" id="google-pay" onChange={handleSelectedPayment} />
                    <label className="form-check-label" htmlFor="google-pay">
                      <i className="payment-icon g-pay-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                      </svg></i> Google Pay
                    </label>
                  </div>
                  {/* paypal option */}
                  <div className="form-check">
                    <input className="form-check-input" type="radio" value="PayPal" name="paymentMethod" id="paypal" onChange={handleSelectedPayment} />
                    <label className="form-check-label" htmlFor="paypal">
                      <i className="bi bi-paypal"></i> PayPal
                    </label>
                  </div>
                </div>
                <div>
                  {(loading) && (<Loader />)}
                  {(showPaymentSuccess) && (<p>Pagamento eseguito con successo</p>)}
                </div>
              </div>
            </div>
            <div className="jw-100 d-flex justify-content-end">
              <button type="submit" className="btn btn-dark" disabled={!selectedPayment} > Conferma e procedi al pagamento</button>
            </div>
          </form>
        )}

        {/* Render ORDER OVERVIEW (if any) */}
        {(isSubmitted && !orderResponse) && (<Loader />)}
        {(isSubmitted && orderResponse) && (
          <div className="container order_overview_container">
            <div className="container">
              <div className="order_overview">
                {/* Order success message */}
                <h2>Abbiamo ricevuto il tuo ordine</h2>
                <p className="text-center fs-3">Grazie per averci scelto! &hearts;</p>
                <p>Ecco il riepilogo del tuo ordine</p>
                {/* -- Order overview -- */}
                <div className="container">
                  { /* Order overview header */}
                  <div className="d-flex order_info order_header">
                    <div>
                      <p><span>Ordine</span>  {'AS-IT000' + orderResponse[0]?.id}</p>
                      <p><span>Intestato a</span> {capitalize(orderResponse[0]?.firstname)} {capitalize(orderResponse[0]?.lastname)}</p>
                      <p><span>Stato</span> {orderResponse[0]?.status}</p>
                      <p><span>Metodo di pagamento</span> {selectedPayment}</p>
                    </div>
                    <div className="text-end ms-auto">
                      <div>
                        {/* {console.log(orderResponse)} */}
                        <p>{(orderResponse[0]?.fiscal_code) ? `C.F. ${orderResponse[0]?.fiscal_code.toUpperCase()}` : `P.IVA ${orderResponse[0]?.vat_number}`}</p>
                        <p>{orderResponse[0]?.email.toLowerCase()}</p>
                        <p>{orderResponse[0]?.telephone_number}</p>
                        <p>{orderResponse[0]?.street} — {orderResponse[0]?.zip_code}, {orderResponse[0]?.city} &#40;{orderResponse[0]?.region.toUpperCase()}&#41;, {capitalize(orderResponse[0]?.country)}</p>
                      </div>
                    </div>
                  </div>
                  {/* Order overview body */}
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Prodotto</th>
                        <th>Colore</th>
                        <th>Taglia</th>
                        <th>Quantità</th>
                        <th>Prezzo</th>
                        <th>Sconti</th>
                        <th>Subtotale</th>
                      </tr>
                    </thead>
                    <tbody>
                     {/*  {console.log(orderResponse)} */}
                      {(orderResponse[0]?.items)?.map(item => {
                        return (
                          <tr key={item.name + item.color + item.size}>
                            <td>{item.name}</td>
                            <td>{item.color}</td>
                            <td>{item.size}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price}</td>
                            <td>{item.discount == 0 ? '-' : `${item.discount}%`}</td>
                            <td>{(item.price - (item.price * item.discount / 100)) * item.quantity}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="6" className="text-end">Totale</td>
                        <td>{orderResponse[0]?.total_price}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )

}
