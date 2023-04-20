import Header from "../Header";
import React from "react";

export default function CartPage({ cartItems }) {
  return (
    <div>
      <h2>Your Cart:</h2>
      {cartItems && cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}
