import {Link, useParams} from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import PhotosUploader from "../PhotosUploader";

export default function ListingsPage(){
    const {action} = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [condition, setCondition] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [redirect, setRedirect] = useState('');

    async function publishListing(ev) {
        ev.preventDefault();
        try{
            const {data} = await axios.post('/listing',{
                title,
                description,
                price,
                condition,
                category,
                addedPhotos,
            });

            alert("Succesfully listed item");
            setRedirect('account/listing')
        } catch(e) {
            alert("failed");
        }
    }

    if (redirect){
        return <Navigate to = {redirect} />
    }


    return(
        <div>
            {action !== 'new' && (
                 <div className="py-10 text-center flex justify-evenly">
                    <p className="">My Listings</p>
                    <Link className="inline-flex gap-1 bg-primary py-2 px-6 text-white rounded-full" to= {"/account/listings/new"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Add a product
                    </Link>
                </div>
                                )}
            {action === 'new' && (
                <div>
                    <form onSubmit={publishListing}>
                        <h2 className = "text-l mt-4">Title</h2>
                        <input
                             type = "text" 
                             value = {title} 
                             onChange = {ev => setTitle(ev.target.value)} 
                             placeholder = "Item title, ex: iPhone 13 Pro"
                        />
                        <h2 className = "text-l mt-4">Product Description</h2>
                        <textarea 
                            value = {description} 
                            onChange = {ev => setDescription(ev.target.value)} 
                            className="w-full" 
                        />
                        <h2 className = "text-l mt-4">Price</h2>
                        <input 
                            type = "number" 
                            value = {price} 
                            onChange = {ev => setPrice(ev.target.value)}
                             placeholder = "$" 
                        />
                        <h2 className = "text-l mt-4">Condition</h2>
                        <label>Pick Condition:        &nbsp;    </label>
                            <select value = {condition} onChange = {ev => setCondition(ev.target.value)} id="condition">
                                <optgroup label="Conditions">
                                <option value="brand new"> Brand New</option>
                                <option value="like new"> Used - like new</option>
                                <option value="used"> Used</option>
                                <option value="damaged"> Damaged</option>
                                </optgroup>
                            </select>
                        <h2 className = "text-l mt-4">Photos</h2>
                        <PhotosUploader  addedPhotos = {addedPhotos} onChange ={setAddedPhotos}/>
                        <button className="primary">Publish Listing</button>
                    </form>
                </div>
            )}
        </div>
    );
}