import { createContext, useContext, useState } from "react";
/* create context */
const CartContext = createContext();

function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState([]);


  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems
      }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);
  return context;
}

export { 
  CartProvider, 
  useCart };