import {Link, useParams} from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ListingsPage(){
    const {action} = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [condition, setCondition] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');

    async function addPhotoByLink(ev) {
        ev.preventDefault();
        const {data:filename} = await axios.post('/upload-by-link', {link: photoLink});
        setAddedPhotos(prev => {
            return [...prev, filename];
        });
        setPhotoLink('');
    }

    async function pushListing(ev) {
        ev.preventDefault();
        try{
            await axios.post('/listing',{
                title,
                description,
                price,
                condition,
            });

            alert("Succesfully listed item");
        } catch(e) {
            alert("failed");
        }
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
                    <form>
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
                        <div className = "flex gap-2">
                            <input 
                                type="text"
                                value = {photoLink} 
                                onChange = {ev => setPhotoLink(ev.target.value)} 
                                placeholder={"Add using a link....jpg"} 
                            />
                            <button onClick = {addPhotoByLink}className="bg-gray-200 px-4 rounded-2xl">Add&nbsp; Photo</button>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg-grid-cols-6">
                            {addedPhotos.length > 0 && addedPhotos.map(link => (
                                <div>
                                    <img src={'http://localhost:4000/uploads/'+link} alt="" />
                                </div>
                            ))}
                            <button className="border bg-transparent rounded-2xl p-8 text-2xl text-gray-600">
                               + Upload from device
                            </button>
                        </div>
                        <button onClick = {pushListing} className="primary">Publish Listing</button>
                    </form>
                </div>
            )}
        </div>
    );
}