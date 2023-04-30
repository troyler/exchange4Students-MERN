import { useContext, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import ListingsPage from "./ListingsPage";
import AccountNavigation from "../AccountNavigation";
import CartPage from "./CartPage";


export default function ProfilePage() {
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

    if(redirect) {
        return <Navigate to = {redirect}  />
    }


    return (
        <div>
            <AccountNavigation />
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} {user.email}<br />
                <button className= "primary max-w-sm mt-2" onClick = {logout}>Logout</button>
                </div>
            )}
            {subpage === 'carts' && (
                <CartPage/>
            )}
            {subpage === 'listings' && (
                <ListingsPage/>
            )}
        </div>
    );
}