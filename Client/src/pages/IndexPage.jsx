import { useState } from "react";
import Header from "../Header";

export default function IndexPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);

  const itemListings = [
    {
      id: 1,
      title: "iPhone 13 Pro",
      description: "Brand new iPhone 13 Pro, never been used",
      price: 999,
      condition: "brand new",
      category: "electronics",
      photos: ["iphone-13-pro-1.jpg", "iphone-13-pro-2.jpg"],
    },
    {
      id: 2,
      title: "MacBook Pro",
      description: "Used MacBook Pro in excellent condition",
      price: 1499,
      condition: "like new",
      category: "electronics",
      photos: ["macbook-pro-1.jpg", "macbook-pro-2.jpg", "macbook-pro-3.jpg"],
    },
    {
      id: 3,
      title: "Canon EOS R5",
      description: "Professional grade camera in excellent condition",
      price: 3299,
      condition: "used",
      category: "photography",
      photos: ["canon-eos-r5-1.jpg", "canon-eos-r5-2.jpg"],
    },
  ];

  const filteredListings = itemListings.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "all" || item.category === selectedCategory)
  );

  const categories = [...new Set(itemListings.map(item => item.category))];

  const handleAddToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  }

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
      <div className="item-list">
        {filteredListings.map((item) => (
          <div key={item.id} className="listing-item">
            <img
              src={`http://localhost:4000/uploads/${item.photos[0]}`}
              alt=""
              className="listing-image"
            />
            <div>
              <h3 className="item-name">{item.title}</h3>
              <p className="item-description">{item.description}</p>
              <p className="item-price">{`Price: $${item.price}`}</p>
              <button
                className="add-to-cart-button"
                onClick={() => handleAddToCart(item)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
