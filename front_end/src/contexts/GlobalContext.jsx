import { createContext, useContext, useState, useEffect } from "react";
/* create context */
const GlobalContext = createContext();

function ShopProvider({ children }) {

  const [loader, setLoader] = useState(false);

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


  return (
    <GlobalContext.Provider
      value={{
        loader,
        setLoader,
        cartList,
        setCartList,
        genre,
        setGenre,

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