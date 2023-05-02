import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import axios from "axios";


export default function ListingViewerPage() {
    const {id} = useParams();
    const [hasCart, setHasCart] = useState(false);

    const [listing, setListing] = useState('');
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);


    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/listings/'+ id)
        .then(response => {
        setListing(response.data);
        })
    },[id]);

    useEffect(() => {
    axios.get('/carts')
    .then(response => {
        const data = response;
        console.log("incoming data" +[data]);
        setHasCart([data]);
        console.log(data.data);
    })
},[]);


    async function addToCart() {
        if (!hasCart){
            const data = {listing}
            console.log("data from listing viewer page " + data);
            await axios.post('/carts',{
                data: id
            }).then(response => {
                const data = response;
                if (response !== "Added to Cart") {
                    return;
                } else {
                    setAddedToCart(true);
                }
            });
            } else {
                await axios.put('/carts', {
                    data: id  
                }).then(response => {
                    const data = response;
                    if (response !== "Added to Cart") {
                        return;
                    } else {
                        setAddedToCart(true);
                    }
                });

            }
    }

  

  if (!listing) return '';

  if (showAllPhotos) {
    return (
        <div className="absolute inset-0 bg-white min-w-full min-h-screen">
            <div className="p-8 grid gap-4">
                <div>
                    <h2>Photos of {listing.title}</h2>
                    <button onClick = {() => setShowAllPhotos(false)}className="fixed right-10 top-6 flex gap-1 py-2 px-4 rounded-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Close
                    </button>
                </div>
                {listing?.addedPhotos?.length > 0 && listing.addedPhotos.map(listing => (
                    <div>
                        <img src={'http://localhost:4000/uploads/' + listing} alt ="" />
                    </div>
                ))}
            </div>
        </div>
    )
  }



    return(
        <div className="mt-4 bg-gray-100 -mx-8 px-8 py-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl">{listing.title}</h1>
                <h2 className="font-extrabold text-xl">$ {listing.price}</h2>
            </div>
            <div className="relative">
                <div className="grid gap-2 grid-cols-[2fr_1fr] overflow-hidden rounded-2xl">
                    <div className="grid gap-2">
                        {listing.addedPhotos?.[0] && (
                            <img onClick = { () => setShowAllPhotos(true)} className="aspect-square object-cover" src ={"http://localhost:4000/uploads/" + listing.addedPhotos[0]} />
                        )}
                    </div>
                    <div className="grid">
                        {listing.addedPhotos?.[1] && (
                                <img onClick = { () => setShowAllPhotos(true)} className="aspect-square object-cover" src ={"http://localhost:4000/uploads/" + listing.addedPhotos[1]} />
                        )}
                        <div className="overflow-hidden">
                        {listing.addedPhotos?.[2] && (
                                <img onClick = { () => setShowAllPhotos(true)} className="aspect-square object-cover relative top-2" src ={"http://localhost:4000/uploads/" + listing.addedPhotos[2]} />
                        )}
                        </div>
                    </div>
                </div>
                <button onClick = { () => setShowAllPhotos(true)} className="flex gap-2 absolute bottom-2 right-2 p-y-2 px-4 bg-white bg-opacity-40 rounded-2xl border-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Show More Photos
                </button>
                <div>
                {addedToCart? 
                <button onClick = {removeFromCart}> Remove From Cart </button> :
                <button className= "primary max-w-sm mt-2" onClick = {addToCart}> Add to Cart </button>
                }
                </div>

            </div>
            <div className="mt-4">
                <h2 className="font-semibold"> Description:</h2>
                <p>{listing.description}</p>
                <h2 className="py-4">Condition: {listing.condition}</h2>
            </div>
        </div>
    );
}