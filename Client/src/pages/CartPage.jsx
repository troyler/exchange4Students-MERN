import Header from "../Header";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function CartPage() {
  const [cartItems, setCart] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [listings, setListing] = useState([]);

  useEffect(() => {
    axios.get('/carts')
    .then(response => {
        const data = response;
        console.log("incoming data" +[data]);
        setListing(data.data);
        console.log("listings" + listings)
        console.log(data.data);
    })
},[]);

useEffect(() => {
  let total = 0;
  axios.get('/carts')
  .then(response => {
      const data = response;
      console.log("incoming data" +[data]);
      for (const listing of data.data) {
        total += listing.price;
    }
      setTotalPrice(total);
      console.log(totalPrice)
  })
},[]);

  return (
    <div className="mt-4">
              {listings.length > 0 && (
                <div className="text-center max-w-lg mx-auto">
                      <h1>Total Price: ${totalPrice}</h1>
                </div>
            )}
              {listings.length > 0 && listings.map(listing => (
                <Link to={'/listings/'+listing._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
                  <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
                       <img  className ="object-cover" src = {'http://localhost:4000/uploads/' + listing.addedPhotos[0]}></img>
                  </div>
                  <div className="grow-0 shrink">
                    <h2 className="text-xl">{listing.title}</h2>
                    <p className="text-sm mt-2">{listing.description}</p>
                    <p className="text-sm mt-2">${listing.price}</p>
                    <button> Remove from Cart</button>
                  </div>
                </Link>
              ))}
            </div>
  )
}
