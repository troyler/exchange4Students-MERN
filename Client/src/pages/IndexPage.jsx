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
    setCartItems([...cartItems, { name: item.title, price: item.price }]);
    setItemCount(itemCount + 1);
    console.log(cartItems);
  };



  return (
    <div className = "mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {listings.length > 0 && listings.map(listing => (
        <Link to = {'/listings/' + listing._id}>
          <div className = "bg-gray-500 mb-2 rounded-2xl flex">
            {listing.addedPhotos?.[0] && (
            <img className = "rounded-2xl object-cover aspect-square"src = {"http://localhost:4000/uploads/" + listing.addedPhotos?.[0]} alt ="" />
            )}
            </div>
          <h2 className="text-md font-semibold truncate">{listing.title}</h2>
          <div className ="justify-between flex">
            <h2 className = "text-sm">Condition: {listing.condition}</h2>
            <h3 className="font-bold">${listing.price}</h3>
          </div>
        </Link>
        ))}
    </div>
  );
}
