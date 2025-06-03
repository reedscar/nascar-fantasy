import { useState } from 'react'
import { supabase } from './supabaseClient'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import nascarLogo from './assets/nascar.png';
import 'react-toastify/dist/ReactToastify.css'
import './css_styles/SignInPage.css'

function SignInPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            await supabase.auth.signOut();
        };

        logoutUser();
    }, []);

    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            toast(error.message)
        } else {
            setEmail(email);
            navigate('/home');
        }
    }

    const handleSignup = async () => {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            if (error.message === 'User already registered') {
                toast('This email is already registered. Try logging in or checking your email.');
            } else {
                toast(error.message);
            }
            return;
        }

        toast('Signup successful! Please check your email to verify your account.');
    };

  return (
    <div className='login-page'>
        <div className='login-top-decor'>
            <img className='nascar-logo' src={nascarLogo}></img>
            <p className='login-title-text'>Fantasy</p>
        </div>
        <div className='login-box'>
        <h2 className="login-header">Login or Sign Up</h2>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="login-text" />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="login-text" />
        <div className='login-button-container'>
            <button onClick={handleLogin} className="login-button">Login</button>
            <button onClick={handleSignup} className="login-button">Sign Up</button>
            <ToastContainer />
        </div>
        </div>
    </div>
  )
}

export default SignInPage