import { useState, useEffect } from 'react'
import './css_styles/homePage.css'

function DriverCard({ name, badge, team, remove_driver }){



    return(
        <div className="driver-card">
            <div className='driver-label'>
                <p>{name}</p>
                <p>{team}</p>
            </div>
            <img className='driver-number' src={badge}></img>
            <div className='button-container'>
                <button onClick={() => remove_driver(name)}>Remove</button>
            </div>
        </div>
    )
}
export default DriverCard