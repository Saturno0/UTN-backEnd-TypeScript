import CartPage from "./pages/CartPage"
import CheckoutPage from "./pages/CheckoutPage"
import FormPage from "./pages/FormPage"
import LoginPage from "./pages/LoginPage"
import NewInPage from "./pages/NewInPage"
import PrincipalPage from "./pages/PrincipalPage"
import ProductPage from "./pages/ProductPage"
import ProfilePage from "./pages/ProfilePage"
import { Route, Routes } from "react-router-dom";

function App() {

  return (
    <Routes>
      <Route path="/" element={<PrincipalPage />} />
      <Route path="/producto/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path='/form' element={<FormPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/checkout' element={<CheckoutPage />}/>
      <Route path='/newIn' element={<NewInPage />}/>
      <Route path='/profile' element={<ProfilePage />}/>
    </Routes>
  )
}

export default App
