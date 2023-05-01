import Header from "../Header";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function CheckoutPage() {
  const [cartItems, setCart] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [listings, setListing] = useState([]);
  const [payment, setPayment] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

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

async function getTotal(){
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
}

useEffect(() => {
  getTotal();
},[]);

async function removeFromCart(ev, listing) {
    ev.preventDefault();
    if (listings.length !== 1){
      const data = {listing}
      await axios.patch('/carts',{
          data : listing
      }).then(async response => {
        const data = response;
        setListing(data.data);
      })
    } else {
      await axios.delete("/carts").
      then(async response => {
        setListing([])});
    }
    getTotal();
  }

    async function removeListing(ev, listing) {
      ev.preventDefault();
      const data = {listing};
      console.log("data to be deleted " + listing);
      await axios.delete('/user-listings', {
        data
      });
    }

    async function checkout(ev) {
        ev.preventDefault();
        const listingData = {title, description, price,
                condition, category, addedPhotos,
        }
        if (listings.length>1) {
            await axios.put('/purchases',{
                id,
                ...listingData
            });
            alert("Succesfully listed item");
            setRedirect(true)
            
        } else {
            return;
    }
}


  return (
    <div className="mt-4 grid gap-x-20 gap-y-8 grid-cols-2">
        <div className="grid pt-10">
            <h1 className="text-2xl font-bold px-4">Items in Cart</h1>
              {listings.length > 0 && listings.map(listing => (
                <Link to={'/listings/'+listing._id} className="flex cursor-pointer gap-4 m-4 bg-gray-100 p-4 rounded-2xl">
                  <div className="flex w-32 h-32 bg-gray-300 grow-0 shrink-0">
                       <img  className ="object-cover" src = {'http://localhost:4000/uploads/' + listing.addedPhotos[0]}></img>
                  </div>
                  <div className="grow-0 shrink">
                    <h2 className="text-xl">{listing.title}</h2>
                    <p className="text-sm mt-2">${listing.price}</p>
                    <button className ="cursor-default" onClick={(ev) => removeFromCart(ev, listing._id)}> Remove from Cart</button>
                  </div>
                </Link>
              ))}
              {listings.length > 0 && (
                <div className="grid text-center max-w-lg mx-auto">
                      <h1>Total Price: ${totalPrice}</h1>
                </div>
            )}
            </div>
            <div className="grid">
            <form onSubmit={checkout} className="flex-row pt-12">
                <h2 className = "pt-4">First Name</h2>
                <input 
                    type = "text" 
                    value = {firstName} 
                    onChange = {ev => setFirstName(ev.target.value)} 
                    className="w-full border rounded -mt-10" 
                />
                <h2 className = "text-l pt-2">Last Name</h2>
                <input 
                    type = "text" 
                    value = {lastName} 
                    onChange = {ev => setLastName(ev.target.value)}
                    placeholder = "" 
                />
                <div className=" bg-indigo-900 mt-4 p-1 rounded-2xl">
                <h2 className = "text-l p-4 pb-4 text-white">Payment Information</h2>
                <div className="border rounded-xl m-2 p-1  bg-neutral-300">
                <h2 className = "text-l p-3">Card Number</h2>
                <input
                    type = "text" 
                    value = {payment} 
                    onChange = {ev => setPayment(ev.target.value)} 
                    placeholder = "XXXX XXXX XXXX XXXX"
                />
                <div className="flex justify-between">
                <div>
                <h2 className = "text-l p-3">Card Expiration</h2>
                <input
                    type = "text" 
                    value = {expirationDate} 
                    onChange = {ev => setExpirationDate(ev.target.value)} 
                    placeholder = "MM/YY"
                />
                </div>
                <div>
                <h2 className = "text-l p-3">Security Code</h2>
                <input
                    type = "text" 
                    value = {expirationDate} 
                    onChange = {ev => setExpirationDate(ev.target.value)} 
                    placeholder = "123"
                />
                </div>
                </div>
                </div>
                </div>
                <button className="mt-4 primary"> Checkout</button>
            </form>

            </div>
            </div>
  )
}
