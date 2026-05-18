/* Import custom CSS */
import "./AppOrderCheckout.css";
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
  const [orderError, setOrderError] = useState(null);

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
    /* VALIDATE all FIELDS */
    if (!handleAllFieldsValidation()) {
      alert('Per favore, completa correttamente tutti i campi');
      return;
    };
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

      /* SUBMIT DATA */
      axios.post(orderUrl, body)
        .then(res => {
          /* Save RESPONSE STATE */
          setOrderResponse(res.data);
          setOrderError(null);

          /* clear cart and total price from local Storage (only on success) */
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
          });
          setCartList([]);
          localStorage.removeItem('cart');
          localStorage.removeItem('cartList');
          localStorage.removeItem('order');
          localStorage.removeItem('total_price');
        })
        .catch(err => {
          console.error(err); // ⚠️ To B implemented with visual alert/feedback UX
          setOrderError('Si è verificato un errore durante l\'invio dell\'ordine. Riprova più tardi.');
          setIsSubmitted(false);
          setShowPaymentSuccess(false);
          setLoading(false);
        })
        .finally(() => {
          console.log("Order request completed");
        });
    }, 2000);
  }

  /* CAPITALIZE function */
  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
  }


  /* Form VALIDATION */
  const [formErr, setFormErr] = useState({});
  function validateForm(name, value) {
    switch (name) {
      case 'firstname':
        if (!value.trim()) return "* Nome mancante";
        if (value.length > 50) return 'Nome non valido';
        return '';

      case 'lastname':
        if (!value.trim()) return "* Cognome mancante";
        if (value.length > 50) return 'Cognome non valido';
        return '';

      case 'email': /* ⚠️ could be implemented */
        if (!value.trim()) return "* Email mancante";
        if (!value.includes('@') || !value.includes('.') || value.length > 100) return 'Email non valida';
        return '';

      case 'telephone_number':
        if (!value.trim()) return "* Telefono mancante";
        if (value.length < 7 || value.length > 15) return 'Numero di telefono non valido';
        return '';

      case 'fiscal_code':
      case 'vat_number':
        const hasFiscal = order.fiscal_code.trim();
        const hasVat = order.vat_number.trim();
        if (hasFiscal && hasVat) return "* Codice fiscale o Partita IVA (non entrambi)";
        if (!hasFiscal && !hasVat) return "* Compila Codice Fiscale o P.IVA";
        if (name === 'fiscal_code' && hasFiscal && hasFiscal.length !== 16) return 'Codice fiscale non valido';
        if (name === 'vat_number' && hasVat && hasVat.length !== 11) return 'Partita IVA non valida';
        return '';

      case 'country':
        if (!value.trim()) return "* Paese mancante";
        if (value.length <= 2 || value.length > 50) return 'Paese non valido (max 50 caratteri)';
        return '';

      case 'region':
        if (!value.trim()) return "* Provincia mancante";
        if (value.length < 2 || value.length > 2) return 'Provincia non valida';
        return '';

      case 'city':
        if (!value.trim()) return "* Città mancante";
        if (value.length < 2 || value.length > 50) return `Città non valida`
        return '';

      case 'street':
        if (!value.trim()) return "* Indirizzo mancante";
        if (value.length < 5 || value.length > 100) return 'Indirizzo non valido';
        return '';

      case 'zip_code':
        if (!value.trim()) return "* CAP mancante";
        if (value.length < 5 || value.length > 9) return 'CAP non valido';
        return '';

      default:
        return '';
    }
  }

  /* Handle single FIELD VALIDATION */
  function handleBlur(name) {
    const fieldError = validateForm(name, order[name]);
    setFormErr({ ...formErr, [name]: fieldError });
  }
  /* Handle FORM VALIDATION (all) */
  function handleAllFieldsValidation() {
    const fieldErrorS = {};
    Object.keys(order).forEach(name => {
      if (name !== 'total_price') {
        const fieldError = validateForm(name, order[name]);
        if (fieldError) fieldErrorS[name] = fieldError;
      }
    });
    setFormErr(fieldErrorS);
    return Object.keys(fieldErrorS).length === 0;
  }


  return (
    <>
      <div className="checkout_container">

        {/* Get order data */}
        {(!isSubmitted && !orderResponse) && (
          <form className="user_data" onSubmit={handleSubmit}>
            <div className="m-3">
              <h2>Dati personali</h2>
            </div>
            {orderError && (
              <div className="m-3">
                <div className="alert alert-danger" role="alert">
                  {orderError}
                </div>
              </div>
            )}
            <div className="row row-cols-2 m-3">
              <div className="mb-3">
                <label htmlFor="firstname_field" className="form-label">Nome</label>
                <input
                  type="text"
                  className={`form-control ${formErr.firstname ? 'is-invalid' : ''}`}
                  id="firstname_field"
                  name="firstname"
                  value={order.firstname}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('firstname')} />
                {formErr.firstname && <small className="form-validation-alert">{formErr.firstname}</small>}
              </div>
              <div className="mb-3">
                <label htmlFor="lastname_field" className="form-label">Cognome</label>
                <input
                  type="text"
                  className={`form-control ${formErr.lastname ? 'is-invalid' : ''}`}
                  id="lastname_field"
                  name="lastname"
                  value={order.lastname}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('lastname')} />
                {formErr.lastname && <small className="form-validation-alert">{formErr.lastname}</small>}
              </div>
              <div className="mb-3">
                <label htmlFor="email_field" className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${formErr.email ? 'is-invalid' : ''}`}
                  id="email_field"
                  aria-describedby="emailHelp"
                  name="email"
                  value={order.email}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('email')} />
                {formErr.email && <small className="form-validation-alert">{formErr.email}</small>}
              </div>
              <div className="mb-3">
                <label htmlFor="telephone_number_field" className="form-label">Telefono</label>
                <input
                  type="text"
                  className={`form-control ${formErr.telephone_number ? 'is-invalid' : ''}`}
                  id="telephone_number_field"
                  name="telephone_number"
                  value={order.telephone_number}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('telephone_number')} />
                {formErr.telephone_number && <small className="form-validation-alert">{formErr.telephone_number}</small>}
              </div>
              <div className="mb-3">
                <label htmlFor="fiscal_code_field" className="form-label">Codice Fiscale</label>
                <input
                  type="text"
                  className={`form-control ${formErr.fiscal_code ? 'is-invalid' : ''}`}
                  id="fiscal_code_field"
                  name="fiscal_code"
                  value={order.fiscal_code}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('fiscal_code')} />
                {formErr.fiscal_code && <small className="form-validation-alert">{formErr.fiscal_code}</small>}
              </div>
              <div className="mb-3">
                <label htmlFor="vat_number_field" className="form-label">P. IVA</label>
                <input
                  type="text"
                  className={`form-control ${formErr.vat_number ? 'is-invalid' : ''}`}
                  id="vat_number_field"
                  name="vat_number"
                  value={order.vat_number}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('vat_number')} />
                {formErr.vat_number && <small className="form-validation-alert">{formErr.vat_number}</small>}
              </div>
              <div className="mb-3">
                <label htmlFor="country_field" className="form-label">Paese</label>
                <input
                  type="text"
                  className={`form-control ${formErr.country ? 'is-invalid' : ''}`}
                  id="country_field"
                  name="country"
                  value={order.country}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('country')} />
                {formErr.country && <small className="form-validation-alert">{formErr.country}</small>}
              </div>
              <div className="mb-3">
                <label htmlFor="region_field" className="form-label">Provincia</label>
                <input
                  type="text"
                  className={`form-control ${formErr.region ? 'is-invalid' : ''}`}
                  id="region_field"
                  name="region"
                  value={order.region}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('region')} />
                {formErr.region && <small className="form-validation-alert">{formErr.region}</small>}
              </div>
              <div className="mb-3">
                <label htmlFor="city_field" className="form-label">Città</label>
                <input
                  type="text"
                  className={`form-control ${formErr.city ? 'is-invalid' : ''}`}
                  id="city_field"
                  name="city"
                  value={order.city}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('city')} />
                {formErr.city && <small className="form-validation-alert">{formErr.city}</small>}
              </div>
              <div className="mb-3">
                <label htmlFor="street_field" className="form-label">Indirizzo</label>
                <input
                  type="text"
                  className={`form-control ${formErr.street ? 'is-invalid' : ''}`}
                  id="street_field"
                  name="street"
                  value={order.street}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('street')} />
                {formErr.street && <small className="form-validation-alert">{formErr.street}</small>}
              </div>
              <div className="mb-3">
                <label htmlFor="zip_code_field" className="form-label">CAP</label>
                <input
                  type="text"
                  className={`form-control ${formErr.zip_code ? 'is-invalid' : ''}`}
                  id="zip_code_field"
                  name="zip_code"
                  value={order.zip_code}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('zip_code')} />
                {formErr.zip_code && <small className="form-validation-alert">{formErr.zip_code}</small>}
              </div>
            </div>
            {/* Payment placeholder */}
            <div className="container">
              <h3>Seleziona il metodo di pagamento</h3>
              <div className="d-flex m-3 gap-3" >
                <div className="m-3 pl-3">
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
                <div className="pl-5 d-flex align-items-center justify-content-center">
                  {(loading) && (<Loader />)}
                  {(showPaymentSuccess) && (<p>Pagamento eseguito con successo</p>)}
                </div>
              </div>
            </div>
            <div className="jw-100 d-flex justify-content-end">
              <button type="submit" className="btn btn-black rounded-0" id="submit_button" disabled={!selectedPayment} > Conferma e procedi al pagamento</button>
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
                <div className="container order_info">
                  { /* Order overview header */}
                  <div className="d-flex order_header">
                    <div>
                      <p><span>n°</span>  {'AS-IT000' + orderResponse[0]?.id}</p>
                      <p><span>Intestato a</span> {capitalize(orderResponse[0]?.firstname)} {capitalize(orderResponse[0]?.lastname)}</p>
                      <p><br /><span>Stato</span> {orderResponse[0]?.status}</p>
                      <p><span>Metodo di pagamento</span> {selectedPayment}</p>
                    </div>
                    <div className="text-end ms-auto">
                      <div>
                        {/* {console.log(orderResponse)} */}
                        <p>{(orderResponse[0]?.fiscal_code) && `C.F. ${orderResponse[0]?.fiscal_code.toUpperCase()}`}
                        {(orderResponse[0]?.vat_number) && `P.IVA ${orderResponse[0]?.vat_number}`}</p>
                        <p>{orderResponse[0]?.email.toLowerCase()}</p>
                        <p>{orderResponse[0]?.telephone_number}</p>
                        <p>{orderResponse[0]?.street} — {orderResponse[0]?.zip_code}, {orderResponse[0]?.city} &#40;{orderResponse[0]?.region.toUpperCase()}&#41;, {capitalize(orderResponse[0]?.country)}<br /></p>
                      </div>
                    </div>
                  </div>
                  {/* Order overview body */}
                  <div className="table_container">

                    <div className="container overview_table">
                      <div className="row table_header">
                        <div className="col-3 product_name">Prodotto</div>
                        <div className="col-2 product_color">Colore</div>
                        <div className="col-1 product_size">Taglia</div>
                        <div className="col-1 product_quantity">Quantità</div>
                        <div className="col-2 collapsable product_price">Prezzo</div>
                        <div className="col-1 collapsable product_discount">Sconti</div>
                        <div className="col-2 product_subtotal">Subtotale</div>
                      </div>
                      {/* {console.log(orderResponse)} */}
                      {(orderResponse[0]?.items)?.map(item => {
                        return (
                          <div className="row" key={item.name + item.color + item.size}>
                            <div className="col-3 text-start product_name">{item.name}</div>
                            <div className="col-2 product_color">{item.color}</div>
                            <div className="col-1 product_size">{item.size}</div>
                            <div className="col-1 product_quantity">{item.quantity}</div>
                            <div className="col-2 collapsable product_price">{(item.price)}</div>
                            <div className="col-1 collapsable discount_green product_discount">{item.discount == 0 ? '-' : `${item.discount}%`}</div>
                            <div className="col-2 product_subtotal">{(item.price - (item.price * item.discount / 100)) * item.quantity}.00</div>
                          </div>
                        )
                      })}
                      <div className="row"> {/* ⚠️ todo: fix colspan (should convert table into grid) */}
                        <div className="col-12 cart_total">tot. {orderResponse[0]?.total_price}</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )

}
