import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import CartPage from "./CartPage";
import axios from "axios";
import { list } from "postcss";


export default function IndexPage() {










  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    axios.get('/listings')
    .then(response => {
      setListings([...response.data]);
    })
  },[]);


  const filteredListings = listings.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "all" || item.category === selectedCategory)
  );

  const categories = [...new Set(listings.map(item => item.category))];

  const handleAddToCart = (item) => {
    setCartItems([...cartItems, { name: item.title, price: item.price}]);
    setItemCount(itemCount + 1);
    console.log(cartItems);
  };



  return (
    <div>
      <h1>Homepage - Browse Items</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="cart-count">
          {itemCount > 0 ? `Items in Cart: ${itemCount}` : ""}
          <CartPage cartItems={cartItems} />
        </div>
        <div className = "mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredListings.length > 0 && filteredListings.map(listing => (
          <Link to = {'/listings/' + listing._id}>
            <h2 className="text-md p-1 font-semibold truncate">{listing.title}</h2>
            <div className = "bg-gray-500 mb-2 rounded-2xl flex">
              {listing.addedPhotos?.[0] && (
              <img className = "rounded-2xl object-cover aspect-square"src = {"http://localhost:4000/uploads/" + listing.addedPhotos?.[0]} alt ="" />
              )}
            </div>
            <div className ="justify-between flex">
              <h3 className = "text-sm truncate">Condition: {listing.condition}</h3>
              <h3 className="-mt-0.5 font-semibold">${listing.price}</h3>
            </div>
            <button
            className="add-to-cart-button"
            onClick={() => handleAddToCart(item)}>
            Add to Cart
          </button>
          </Link>
          ))}
      </div>
      </div>
  );
}
