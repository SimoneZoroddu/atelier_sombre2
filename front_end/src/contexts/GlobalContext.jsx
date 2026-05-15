import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
/* create context */
const GlobalContext = createContext();

function ShopProvider({ children }) {

  const [loading, setLoading] = useState(false);

  /* Initialize localStorage */
  const [cartList, setCartList] = useState(() => {
    const saved = localStorage.getItem('cartList');
    return saved ? JSON.parse(saved) : [];
  });

  /* Save changes to localStorage */
  useEffect(() => {
    localStorage.setItem('cartList', JSON.stringify(cartList));
  }, [cartList]);

  /* const addToCart = (item) => {
    if (!selectedSize) {
      alert("Seleziona una taglia prima di aggiungere al carrello.")
      return;
    }
    setCartList((prev) => [...prev, CartItem]);
    console.log(CartItem, CartList);
  }; */

  const [genre, setGenre] = useState("")
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState([])
  const url = import.meta.env.VITE_API_ADDRESS + "products/index?page=1&limit=100";
  const [shoes, setShoes] = useState([]);
  const [filteredShoes, setFilteredShoes] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(url);
        setShoes(res.data.results);
        setFilteredShoes(res.data.results);
        setCategory([...new Set(res.data.results.map(shoe => shoe.category))]);

      } catch (err) {
        setError("Impossibile caricare i prodotti. Riprova più tardi.");
      } finally {
        setLoading(false);
      }
    };

    fetchShoes();
  }, []);

  /* slugify url function */
  function slugify(str) {
    return str
      .toLowerCase()                 // convert to lowercase
      .trim()                        // remove leading/trailing spaces  
      .replace(/[^\w\s-]/g, '')      // remove special chars that are not alphanumeric, spaces, or hyphens
      .replace(/[\s_]+/g, '-')       // convert spaces to hyphens
      .replace(/^-+|-+$/g, '');      // remove leading/trailing hyphens
  }

  /* keep update data in localStorage */
  useEffect(() => {

    if (!isInitialLoading) {
      localStorage.setItem('cart', JSON.stringify(cartList));
    }
  }, [cartList, isInitialLoading]);

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

  const [cartTotal, setCartTotal] = useState(0);

  /* get cart total */
  /* ⚠️ to be implemented, add if discount */
  useEffect(() => {
    setCartTotal(cartList.map(item => item.finalPrice * item.quantity).reduce((a, b) => a + b, 0));
  }, [cartList]);


  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const STORAGE_KEY = "newsletter_popup_seen";

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [storeWishlist, setStoreWishlist] = useState()

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


  const normalizedName = (name) => name.toLowerCase().replace(/\s+/g, "-");
  const normalizedColor = (color) => color.toLowerCase().replace(/\s+/g, "-");

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
        loading,
        setLoading,
        cartList,
        setCartList,
        genre,
        setGenre,
        searchValue,
        setSearchValue,
        category,
        setCategory,
        shoes,
        setShoes,
        filteredShoes,
        setFilteredShoes,
        slugify,
        isInitialLoading,
        setIsInitialLoading,
        cartTotal,
        setCartTotal,
        handleSubmit,
        STORAGE_KEY,
        email,
        setEmail,
        error,
        setError,
        submitted,
        setSubmitted,
        normalizedName,
        normalizedColor,
        storeWishlist,
        setStoreWishlist,
        addWishlist,
        isInWishlist
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