import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
/* create context */
const GlobalContext = createContext();
function ShopProvider({ children }) {

  // Variabili di stato


  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState([])
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0)
  const [isVisibleCart, setIsVisibleCart] = useState(false)
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [storeWishlist, setStoreWishlist] = useState()


  //VARIABILI DI TESTO SEMPLICE
  const STORAGE_KEY = "newsletter_popup_seen";

  // URL DI BASE
  const url = import.meta.env.VITE_API_ADDRESS + "products/index?page=1&limit=100";

  //Per navigare
  const navigate = useNavigate();
  const location = useLocation()


  const handleBack = () => {

    if (location.key !== "default") {

      navigate(-1);

    } else {

      navigate("/");

    }
  };

  // Regola precisa per normalizzare nome e colore
  const normalizedName = (name) => name.toLowerCase().replace(/\s+/g, "-");
  const normalizedColor = (color) => color.toLowerCase().replace(/\s+/g, "-");


  /* slugify url function  RENDERE SLUG OVVERO SENZA CARATTERI STRANI E SPAZI */
  function slugify(str) {
    return str
      .toLowerCase()                 // convert to lowercase
      .trim()                        // remove leading/trailing spaces  
      .replace(/[^\w\s-]/g, '')      // remove special chars that are not alphanumeric, spaces, or hyphens
      .replace(/[\s_]+/g, '-')       // convert spaces to hyphens
      .replace(/^-+|-+$/g, '');      // remove leading/trailing hyphens
  }

  //CHIAMATA AXIOS PER TUTTE LE SCARPE

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(url);

        const result = res.data.results
        setCategory([...new Set(result.map(shoe => shoe.category))]);

      } catch (err) {
        setError("Impossibile caricare le categorie. Riprova più tardi.");
      } finally {
        setLoading(false);
      }
    };

    fetchShoes();
  }, []);




  // TUTTO IL LOCALSTORAGE

  /* Initialize localStorage */
  const [cartList, setCartList] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  /* Save changes to localStorage */
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartList));
  }, [cartList]);



  /* get cart data from localStorage */
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


  /* keep updated cart data in localStorage */
  useEffect(() => {
    if (!isInitialLoading) {
      localStorage.setItem('cart', JSON.stringify(cartList));
    }
  }, [cartList, isInitialLoading]);

  /* get cart total */
  useEffect(() => {
    setCartTotal(cartList.map(item => Number(item.finalPrice ?? item.price) * Number(item.quantity)).reduce((a, b) => a + b, 0));
  }, [cartList]);



  /* CONSEGNA GRATUITA */
  useEffect(() => {
    setShippingCost(cartTotal >= 200 ? 0 : 60);
  }, [cartTotal]);



  // TUTTO SULL EMAIL

  //CONTROLLO EMAIL VALIDA
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // AXIOS POST PER EMAIL
  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Inserisci la tua email.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Indirizzo email non valida.");
      return;
    }
    setError("");

    try {
      const res = await fetch("http://localhost:3000/newsletter/add-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Errore del server");

      setSubmitted(true);
      localStorage.setItem(STORAGE_KEY, "true");
    } catch (err) {
      setError("Qualcosa è andato storto. Riprova.");
    }
  };


  //funzioni per la wishlist aggiunta togliere e cambio cuore e no tgra pieno e no

  function isInWishlist(id) {

    return storeWishlist.some(
      item => item.id === id
    );
  }

  useEffect(() => {

    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setStoreWishlist(savedWishlist);

  }, []);

  function addWishlist(shoe) {

    axios.get(`http://127.0.0.1:3000/products/${normalizedName(shoe.name)}/${normalizedColor(shoe.color)}`)
      .then(datas => {

        const product = datas.data;

        // QUI let e non const
        let currentWishlist =
          JSON.parse(localStorage.getItem('wishlist')) || [];

        const alreadyExists = currentWishlist.some(
          item => item.id === product.id
        );

        if (alreadyExists) {

          // rimuove
          currentWishlist = currentWishlist.filter(
            item => item.id !== product.id
          );

        } else {

          // aggiunge
          currentWishlist.push(product);
        }

        localStorage.setItem(
          'wishlist',
          JSON.stringify(currentWishlist)
        );

        setStoreWishlist(currentWishlist);

      })
  }



  return (
    <GlobalContext.Provider
      value={{
        loading, setLoading,
        cartList, setCartList,
        searchValue, setSearchValue,
        isInitialLoading, setIsInitialLoading,
        cartTotal, setCartTotal,
        shippingCost, setShippingCost,
        submitted, setSubmitted,
        storeWishlist, setStoreWishlist,
        isVisibleCart, setIsVisibleCart,
        email, setEmail,
        error, setError,
        category, setCategory,
        slugify,
        handleSubmit,
        STORAGE_KEY,
        normalizedName,
        normalizedColor,
        addWishlist,
        isInWishlist,
        handleBack,
      }}>
      {children}
    </GlobalContext.Provider>
  );
}

function useShop() {
  const context = useContext(GlobalContext);
  return context;
}

export {
  ShopProvider,
  useShop
};