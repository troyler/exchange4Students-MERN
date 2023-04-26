import Header from "../Header";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function CartPage() {
  const [cartItems, setCart] = useState(null);

  useEffect(() => {
    axios.get('/user-carts')
    .then(response => {
        const {data} = response;
        console.log(data)
        setCart(data);
    })
},[]);
  return (
    <div>
      <h2>Your Cart:</h2>
      {cartItems && cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              {item.title} - ${item.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}
