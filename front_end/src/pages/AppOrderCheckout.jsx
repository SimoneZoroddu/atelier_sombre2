/* Import hooks */
import { useState, useEffect } from "react";
/* Import context */
import { useShop } from "../contexts/GlobalContext";

export default function AppOrderCheckout() {

  function HandleSubmit(e) {
    e.preventDefault();

    /* send data to backend */
    /* get
    - vat_number
    - is_billing
    - status
    */

    /* ⚠️ call here */

    /* redirect to order details page */ /* ⚠️ todo */

  }

  return (
    <>
      <h1>Checkout page</h1>
      <div className="container">
        <form onSubmit={HandleSubmit}>
          <div className="row row-cols-2">

            <div className="mb-3">
              <label htmlFor="firstname_field" className="form-label">Nome</label>
              <input type="text" className="form-control" id="firstname_field"
                name="firstname" value=""
                onChange={e => console.log(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="lastname_field" className="form-label">Cognome</label>
              <input type="text" className="form-control" id="lastname_field"
                name="lastname" value=""
                onChange={e => console.log(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="email_field" className="form-label">Email</label>
              <input type="email" className="form-control" id="email_field" aria-describedby="emailHelp"
                name="email" value=""
                onChange={e => console.log(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="telephone_number_field" className="form-label">Telefono</label>
              <input type="text" className="form-control" id="telephone_number_field"
                name="telephone_number" value=""
                onChange={e => console.log(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="fiscal_code_field" className="form-label">Codice Fiscale</label>
              <input type="text" className="form-control" id="fiscal_code_field"
                name="fiscal_code" value=""
                onChange={e => console.log(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="country_field" className="form-label">Paese</label>
              <input type="text" className="form-control" id="country_field"
                name="country" value=""
                onChange={e => console.log(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="region_field" className="form-label">Regione</label>
              <input type="text" className="form-control" id="region_field"
                name="region" value=""
                onChange={e => console.log(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="city_field" className="form-label">Città</label>
              <input type="text" className="form-control" id="city_field"
                name="city" value=""
                onChange={e => console.log(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="street_field" className="form-label">Indirizzo</label>
              <input type="text" className="form-control" id="street_field"
                name="street" value=""
                onChange={e => console.log(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="zip_code_field" className="form-label">CAP</label>
              <input type="text" className="form-control" id="zip_code_field"
                name="zip_code" value=""
                onChange={e => console.log(e.target.value)} />
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="Terms_and_Privacy_Check" />
              <label className="form-check-label" htmlFor="Terms_and_Privacy_Check">Procedendo con l'ordine, accetti la Privacy Policy e i Termini e Condizioni</label>
            </div>
            <button type="submit" className="btn btn-dark">Conferma e Procedi con l'ordine</button>
          </div>
        </form>

      </div>

    </>
  )
}