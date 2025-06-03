import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignInPage from './SignInPage'
import HomePage from './HomePage'
import NewsPage from './NewsPage';
import ProtectedRoute from './ProtectedRoute'
import LeaguePage from './LeaguePage'
import './css_styles/HomePage.css'

function Authenticator() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user != null){
        setUser(data.user)
        const { data: playerData, error } = await supabase
          .from('Players')
          .upsert([{
            'name': data.user.email,
            'user_id': data.user.id
        }])
      }
      setLoading(false)
    }
    getUser()

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className='page'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignInPage></SignInPage>}></Route>
          <Route path="/home" element={
            <ProtectedRoute user={user}>
              <HomePage user={user} setUser={setUser}></HomePage>
            </ProtectedRoute>
          }></Route>
          <Route path="/news" element={
            <ProtectedRoute user={user}>
              <NewsPage user={user} setUser={setUser}></NewsPage>
            </ProtectedRoute>
          }></Route>
          <Route path="/leagues" element={
            <ProtectedRoute user={user}>
              <LeaguePage user={user} setUser={setUser}></LeaguePage>
            </ProtectedRoute>
          }></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default Authenticator