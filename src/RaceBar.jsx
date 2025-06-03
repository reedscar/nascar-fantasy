import { useEffect, useState } from "react";
import RaceCard from "./RaceCard";
import './css_styles/RaceCard.css'

function RaceBar(){
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const endpoint = 'https://cf.nascar.com/cacher/2025/race_list_basic.json';

    useEffect(() => {
        // API Endpoint
        fetch(endpoint)
            .then(response => {
                if (!response.ok) {
                    throw new Error('failed to fetch');
                }
                return response.json();
            })
            .then(data => setData(data))
            .catch(err => setError(err.message));
    }, []);

    return (
        <div className="race_bar">
        {error && <p>Error: {error}</p>}
        {data ? (
            data.series_1.map((race, index) => (
                <RaceCard 
                key={race.race_id}
                name={race.race_name} 
                track={race.track_name} 
                date={race.race_date} 
                winner={race.winner_driver_id}>
                </RaceCard>
            ))
        ) : (
            <p>Loading...</p>
        )}
        </div>
    );

}
export default RaceBar