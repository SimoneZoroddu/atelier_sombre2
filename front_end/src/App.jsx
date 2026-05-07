
import { BrowserRouter, Routes, Route } from "react-router-dom";
/* Import context */
import { ShopProvider } from "./contexts/GlobalContext";
/* Import default layout */
import DefaultLayout from "./layout/DefaultLayout";
/* Import pages */
import HomePage from "./pages/HomePage";
import AppCart from "./pages/AppCart";
import AppSearch from "./pages/AppSearch";



function App() {


  return (
    <BrowserRouter>
      <ShopProvider>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<AppCart />} />
            <Route path="/shoes" element={<AppSearch />} />


          </Route>
        </Routes>
      </ShopProvider>
    </BrowserRouter>
  )
}

export default App