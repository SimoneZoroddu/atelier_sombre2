
import { BrowserRouter, Routes, Route } from "react-router-dom";
/* Import context */
import { ShopProvider } from "./contexts/GlobalContext";
/* Import default layout */
import DefaultLayout from "./layout/DefaultLayout";
/* Import pages */
import AppHome from "./pages/AppHome";
import AppSearch from "./pages/AppSearch";
import AppDetail from "./pages/AppDetail/AppDetail";
import AppCart from "./pages/AppCart/AppCart";
import AppOrderCheckout from "./pages/AppOrderCheckout";


function App() {


  return (
    <BrowserRouter>
      <ShopProvider>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<AppHome />} />
            <Route path="/shoes" element={<AppSearch />} />
            <Route path="/products/:name/:color" element={<AppDetail />} />
            <Route path="/cart" element={<AppCart />} />
            <Route path="/checkout" element={<AppOrderCheckout />} />

          </Route>
        </Routes>
      </ShopProvider>
    </BrowserRouter>
  )
}

export default App