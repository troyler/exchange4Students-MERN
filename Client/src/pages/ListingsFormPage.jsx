import PhotosUploader from "../PhotosUploader";
import axios from "axios";
import {useState, useEffect} from 'react';
import { Navigate, useParams} from "react-router-dom";


export default function ListingsFormPage(){

    const {id} = useParams();
    console.log(id);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [condition, setCondition] = useState('Used - like new');
    const [category, setCategory] = useState('Home Goods');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!id){
            return;
        }
        axios.get('/listings/'+id)
        .then(response => {
            const {data} = response;
            setTitle(data.title);
            setDescription(data.description);
            setPrice(data.price);
            setCondition(data.condition);
            setCategory(data.category);
            setAddedPhotos(data.addedPhotos);
        })
    }, [id]);



    async function publishListing(ev) {
        ev.preventDefault();
        const listingData = {title, description, price,
                condition, category, addedPhotos,
        }
        if (id) {
            await axios.put('/listings',{
                id,
                ...listingData
            });
            alert("Succesfully listed item");
            setRedirect(true)
            
        } else {
            await axios.post('/listings',{
                title,
                description,
                price,
                condition,
                category,
                addedPhotos,
            });
            alert("Succesfully listed item");
            setRedirect(true);
    }
}

    if(redirect) {
        return <Navigate to = {'/profile/listings'} />
    }


    return (
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
                    className="w-full border rounded-xl" 
                />
                <h2 className = "text-l mt-4">Price</h2>
                <input 
                    type = "number" 
                    value = {price} 
                    onChange = {ev => setPrice(ev.target.value)}
                    placeholder = "$" 
                    className="border rounded"
                />
                <h2 className = "text-xl mt-4 mb-2">Condition</h2>
                <label>Pick Condition:        &nbsp;    </label>
                    <select value = {condition} onChange = {ev => setCondition(ev.target.value)} id="condition">
                        <optgroup label="Conditions">
                        <option value="Brand New"> Brand New</option>
                        <option value="Used - like new"> Used - like new</option>
                        <option value="Used"> Used</option>
                        <option value="Damaged"> Damaged</option>
                        </optgroup>
                    </select>
                <label>Choose Catgeory:        &nbsp;    </label>
                    <select value = {category} onChange = {ev => setCategory(ev.target.value)} id="category">
                        <optgroup label="Conditions">
                        <option value="Home Goods"> Home Goods</option>
                        <option value="Bicycles"> Bicycles </option>
                        <option value="Clothing"> Clothing</option>
                        <option value="Mobile Technology"> Mobile Technology </option>
                        </optgroup>
                    </select>
                <h2 className = "text-xl mt-4">Photos</h2>
                <PhotosUploader  addedPhotos = {addedPhotos} onChange ={setAddedPhotos}/>
                <button className="primary mt- 8">Publish Listing</button>
            </form>
        </div>
    );
    }