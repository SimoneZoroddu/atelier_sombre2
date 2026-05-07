
import { BrowserRouter, Routes, Route } from "react-router-dom";
/* Import context */
import { ShopProvider } from "./contexts/GlobalContext";
/* Import default layout */
import DefaultLayout from "./layout/DefaultLayout";
/* Import pages */
import HomePage from "./pages/HomePage";
import AppCart from "./pages/AppCart";
import AppSearch from "./pages/AppSearch";
import DetailPage from "./pages/DetailPage";


function App() {


  return (
    <BrowserRouter>
      <ShopProvider>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<AppCart />} />
            <Route path="/shoes" element={<AppSearch />} />
            <Route path="/products/:name/:color" element={<DetailPage />} />

          </Route>
        </Routes>
      </ShopProvider>
    </BrowserRouter>
  )
}

export default App