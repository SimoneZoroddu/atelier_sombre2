
import { BrowserRouter, Routes, Route } from "react-router-dom";
/* Import context */
import { ShopProvider } from "./contexts/GlobalContext";
/* Import default layout */
import DefaultLayout from "./layout/DefaultLayout";
/* Import pages */
import AppHome from "./pages/AppHome/AppHome";
import AppResults from "./pages/AppResults";
import AppDetail from "./pages/AppDetail/AppDetail";
import AppCart from "./pages/AppCart/AppCart";
import AppOrderCheckout from "./pages/AppCart/AppOrderCheckout";
import AppWishlist from "./pages/AppWishlist";
import ErrorMessage from "./components/ErrorMessage";
function App() {


  return (
    <BrowserRouter>
      <ShopProvider>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<AppHome />} />
            <Route path="/shoes/:genre/:page" element={<AppResults />} />
            <Route path="/shoes/:pages" element={<AppResults />} />
            <Route path="/products/:name/:color" element={<AppDetail />} />
            <Route path="/cart" element={<AppCart />} />
            <Route path="/checkout" element={<AppOrderCheckout />} />
            <Route path="/wishlist" element={<AppWishlist />} />

            {/* la rotta dell'errore 404 deve stare sotto le altre rotte */}
            <Route path="*" element={<ErrorMessage message={"La pagina che stai cercando non esiste."} />} />
          </Route>
        </Routes>
      </ShopProvider>
    </BrowserRouter>
  )
}

export default App