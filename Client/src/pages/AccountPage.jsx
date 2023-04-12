import { useContext, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import ListingsPage from "./ListingsPage";


export default function AccountPage() {
    const {ready, user, setUser} = useContext(UserContext);
    const[redirect, setRedirect] = useState(null);

    let {subpage} = useParams();
    if (subpage === undefined) {
        subpage = 'profile';
    }

    async function logout(){
        await axios.post('/logout');
        setRedirect('/')
        setUser(null);

    }

    if(!ready) {
        return 'Loading...';
    }

    if (ready && !user && !redirect) {
        return <Navigate to = {"/login"}/>
    }


    function linkClasses(type = null) {
        let classes = 'inline-flex gap-1 py-2 px-6 rounded-full ';
        if (type === subpage) {
        classes += ' bg-primary text-white '
    } else {
        classes += ' bg-gray-200 '
    }
    return classes;
    }
    

    if(redirect) {
        return <Navigate to = {redirect}  />
    }


    return (
        <div>
            <nav className= "w-full flex justify-center mt-8 gap-2 mb-8">
                <Link className = {linkClasses('profile')}  to = {'/account'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                My Profile</Link>


                <Link className = {linkClasses('cart')} to = {'/account/cart'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    Cart
                </Link>
                <Link className = {linkClasses('listings')} to = {'/account/listings'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                    </svg>                    
                    My Listings
                </Link>
            </nav>
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} {user.email}<br />
                <button className= "primary max-w-sm mt-2" onClick = {logout}>Logout</button>
                </div>
            )}
            {subpage === 'listings' && (
                <ListingsPage/>
            )}
        </div>
    );
}