import './App.css'
import {Route, Routes} from "react-router-dom";
import IndexPage from './pages/IndexPage.jsx';
import LoginPage from './pages/loginPage';
import Layout from './Layout';
import RegisterPage from './pages/RegisterPage';
import axios from "axios";
import { UserContextProvider} from './UserContext';
import ProfilePage from './pages/ProfilePage';
import ListingsPage from './pages/ListingsPage';
import ListingsFormPage from './pages/ListingsFormPage';
import CartPage from './pages/CartPage';
import ListingViewerPage from './pages/ListingViewerPage';

axios.defaults.baseURL = "http://localhost:4000"
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
    <Routes>
      <Route path = "/" element = {<Layout  />}>
        <Route index element = {<IndexPage  />}/>
        <Route path = "/login" element = {<LoginPage  />}/>
        <Route path = "/register" element = {<RegisterPage  />}/>
        <Route path = "/cart" element = {<CartPage  />}/>
        <Route path = "/profile" element = {<ProfilePage  />}/>
        <Route path = "/profile/listings" element = {<ListingsPage  />}/>
        <Route path = "/profile/listings/:id" element = {<ListingsFormPage  />}/>
        <Route path = "/profile/listings/new" element = {<ListingsFormPage  />}/>
        <Route path = "/listings/:id" element = {<ListingViewerPage />}/>
      </Route>
    </Routes>
    </UserContextProvider>
  )
}


export default App
