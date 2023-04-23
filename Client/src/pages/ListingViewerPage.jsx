import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import axios from "axios";


export default function ListingViewerPage() {
    const {id} = useParams();

    const [listing, setListing] = useState('');


    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/listings/'+ id)
        .then(response => {
        setListing(response.data);
        })
  },[id]);

  if (!listing) return '';



    return(
        <div className="mt-4 bg-gray-100 -mx-8 px-8 py-6">
            <div className="flex justify-between mb-4">
            <h1 className="text-2xl">{listing.title}</h1>
            <h2 className="font-extrabold text-xl">$ {listing.price}</h2>
            </div>
            <div className="grid gap-2 grid-cols-[2fr_1fr]">
                <div className="grid gap-2">
                    {listing.addedPhotos?.[0] && (
                        <img className="aspect-square object-cover" src ={"http://localhost:4000/uploads/" + listing.addedPhotos[0]} />
                    )}
                </div>
                <div className="grid">
                    {listing.addedPhotos?.[1] && (
                            <img className="aspect-square object-cover" src ={"http://localhost:4000/uploads/" + listing.addedPhotos[1]} />
                    )}
                    <div className="overflow-hidden">
                    {listing.addedPhotos?.[2] && (
                            <img className="aspect-square object-cover relative top-2" src ={"http://localhost:4000/uploads/" + listing.addedPhotos[2]} />
                    )}
                    </div>
                </div>
            </div>
            <h2 className="mt-4">{listing.description}</h2>
            <h2>Condition: {listing.condition}</h2>
        </div>
    );
}