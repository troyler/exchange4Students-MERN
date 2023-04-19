import { useState } from "react";
import axios from "axios";

export default function PhotosUploader({addedPhotos, onChange}){
   
    const [photoLink, setPhotoLink] = useState('');


    async function addPhotoByLink(ev) {
        ev.preventDefault();
        const {data:filename} = await axios.post('/upload-by-link', {link: photoLink});
        onChange(prev => {
            return [...prev, filename];
        });
        setPhotoLink('');
    }

    function uploadPhoto(ev) {
        const files = ev.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        axios.post('/upload', data, { 
            headers: {
                'Content-type' : 'multipart/form-data'
            }
        }).then(response => {
            const {data: filenames} = response;
            onChange(prev => {
                return [...prev, ...filenames];
            });
        });
    }



    return(
        <>
        <div className = "flex gap-2">
            <input 
                type="text"
                value = {photoLink} 
                onChange = {ev => setPhotoLink(ev.target.value)} 
                placeholder={"Add using a link....jpg"} 
            />
            <button onClick = {addPhotoByLink}className="bg-gray-200 px-4 rounded-2xl">Add&nbsp; Photo</button>
        </div>
        <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {addedPhotos.length > 0 && addedPhotos.map(link => (
                <div className="h-32 flex relative">
                    <img className ="rounded-2xl w-full object-cover" src={'http://localhost:4000/uploads/'+link} alt="" />
                </div>
            ))}
            <label className="flex gap-1 items-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                <input multiple type ="file" className = "hidden" onChange = {uploadPhoto}/>
                + Upload from device
            </label>
        </div>
        </>
);
}