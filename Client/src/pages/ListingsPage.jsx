import {Link, useParams} from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import AccountNavigation from "../AccountNavigation";

export default function ListingsPage(){

    const [listings, setListings] = useState([]);
    useEffect(() => {
        axios.get('/listings').then(({data}) => {
            setListings(data);
        });
    }, []);
   
    return(
        <div>
            <AccountNavigation />
                 <div className="py-10 text-center flex justify-evenly">
                    <p className="">My Listings</p>
                    <Link className="inline-flex gap-1 bg-primary py-2 px-6 text-white rounded-full" to= {"/profile/listings/new"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Add a product
                    </Link>
                </div>
                <div>
                    {listings.length > 0 && listings.map(listing => (
                        <div>
                            {listing.title}
                        </div>
                    ))}
                </div>
        </div>
    );
}