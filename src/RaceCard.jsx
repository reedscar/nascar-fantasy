import './css_styles/RaceCard.css'
import { supabase } from './supabaseClient'
import { useEffect, useState } from 'react'

function RaceCard({ name, date, track, winner }) {
  const [winnerName, setWinnerName] = useState('')

  useEffect(() => {
    const getWinnerName = async () => {
      if (!winner) {
        return
      }

      const { data, error } = await supabase
        .from('Drivers')
        .select('Full_Name')
        .eq('Nascar_Driver_ID', winner)

      if (error) {
        return
      }

      if (data && data.length > 0) {
        setWinnerName(data[0].Full_Name)
      } else {
        setWinnerName('Unknown')
      }
    }

    getWinnerName()
  }, [winner]) 

  return (
    <div className="race_card">
      <p className="race_card_text">Race: {name}</p>
      <p className="race_card_text">Date: {date}</p>
      <p className="race_card_text">Track: {track}</p>
      <p className="race_card_text">Winner: {winnerName || 'To Be Determined'}</p>
    </div>
  )
}

export default RaceCard
