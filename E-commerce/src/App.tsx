import { Route, Routes } from 'react-router-dom';
import NavBar from './Components/NavBar';
import HomePage from './Components/HomePage';
import ProductsList from './Components/ProductsList';
import CustomerList from './Components/CustomerList';
import NotFound from './Components/NotFound';
import AddCustomer from './Components/AddCustomer';
import AddProduct from './Components/AddProduct';
import Login from './Components/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import ShoppingCart from './Components/ShoppingCart';
import { useAuth0 } from "@auth0/auth0-react"; 

function App() {
  const { isAuthenticated } = useAuth0(); 

  return (
    <>
      {isAuthenticated && <NavBar />}
      <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/customers' element={<CustomerList />} />
          <Route path='/products' element={<ProductsList />} />
          <Route path='/addcustomers' element={<AddCustomer />} />
          <Route path='/addproduct' element={<AddProduct />} />
          <Route path='/shopping_cart' element={<ShoppingCart />} />
          <Route path='*' element={<NotFound />} />       
      </Routes>
    </>
  );
}

export default App