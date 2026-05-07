import { createContext, useContext, useState } from "react";
/* create context */
const GlobalContext = createContext();

function ShopProvider({ children }) {

  const [cartItems, setCartItems] = useState([]);
  const [loader, setLoader] = useState(false);

  const [genre, setGenre] = useState("")

  return (
    <GlobalContext.Provider
      value={{
        cartItems,
        setCartItems,
        loader,
        setLoader,
        genre,
        setGenre
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