import { supabase } from "./supabaseClient"
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import './css_styles/navbar.css'

function NavBar({ user, setUser }){

    const navigate = useNavigate();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
            if (error) {
                console.error('Logout error:', error.message)
            } else {
                setUser(null)
        }
    }

    return(
        <div className="navbar">
            <button onClick={() => navigate('/home')} className="nav-button">Home</button>
            <button onClick={() => navigate('/news')} className="nav-button">News</button>
            <button onClick={() => navigate('/leagues')} className="nav-button">Leagues</button>
            <p className="logged-in">Logged in as {user.email}</p>
            <button onClick={handleLogout} className="nav-button">Logout</button>
        </div>
    );
}
export default NavBar