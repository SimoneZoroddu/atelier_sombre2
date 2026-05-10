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
  const url = import.meta.env.VITE_API_ADDRESS + "index";
  const [shoes, setShoes] = useState([]);
  const [filteredShoes, setFilteredShoes] = useState([]);

  useEffect(() => {
    axios.get(url)
      .then(datas => {
        setShoes(datas.data);
        setFilteredShoes(datas.data);
        setCategory([...new Set(datas.data.map(shoe => shoe.category))])
      });
  }, []);


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