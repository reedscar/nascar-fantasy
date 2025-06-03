import { supabase } from "./supabaseClient"
import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import RaceBar from "./RaceBar"
import NavBar from "./NavBar"
import './css_styles/homePage.css'
import nascarLogo from './assets/nascar.png';
import DropdownSearch from "./DropdownSearch";
import DriverCard from "./DriverCard"

function HomePage({user, setUser}){

    const [driverData, setDriverData] = useState([]);
    const [driverCount, setDriverCount] = useState(0);

    const addDriverToGarage = async (name) => {

        // find how many drivers are in garage
        const { count, count_error } = await supabase
            .from('Teams')
            .select('*', { count: 'exact', head: true })
            .eq('player_id', user.id)
        setDriverCount(count);

        if (count == 6){
            toast("Can't add more than 6 drivers to your team!")
            return;
        }

        const { data, error } = await supabase
            .from('Teams')
            .upsert([{ 'player_id': user.id, 'driver_name':  name}])
        
        if (error) {
            if (error.message == 'duplicate key value violates unique constraint "unique_player_driver"'){
                toast(`Can't add ${name} again!`);
            } else {
                toast(error.message);
            }
        } 

        fetchGarage();
    }

    const fetchGarage = async () => {
        const { data, error } = await supabase
            .from("Teams")
            .select("driver_name")
            .eq("player_id", user.id);

        if (error) {
            console.error("Error fetching garage:", error.message);
            return;
        }

        const driverDataList = [];

        for (const d of data) {
            const { data: stats, error: statsError } = await supabase
                .from('Drivers')
                .select('*')
                .eq('Full_Name', d.driver_name)
                .single();
            
            if (statsError) {
                console.error(`Error fetching stats for ${d.driver_name}:`, statsError.message);
            } else {
                driverDataList.push(stats);
            }
        }
        setDriverData(driverDataList);
        setDriverCount(driverDataList.length);
    };

    const remove_driver = async (driver) => {
        console.log(driver);
        const { error } = await supabase
            .from('Teams')
            .delete()
            .eq('driver_name', driver)
            .eq('player_id', user.id)
        
        if (error) {
            toast(error.message);
        }
        
        fetchGarage();
    }


    useEffect(() => {
        if (user?.id) {
            fetchGarage();
        }
    }, [user]);

    return(
        <div className="home_page">
            <ToastContainer></ToastContainer>
            <NavBar user={user} setUser={setUser}></NavBar>
            <div className="main_content">
                <div className="left-content">
                    <div className="title-bar">
                        <img className="nascar-title" src={nascarLogo}></img>
                        <p>Fantasy</p>
                    </div>  
                    <div className="dropdown-container">
                        <p>Add To Your Lineup 👉</p>
                        <DropdownSearch onDriverSelect={addDriverToGarage}></DropdownSearch>
                        <p>{driverCount}/6</p>
                    </div>
                    
                    {driverData.map((driver, index) => (
                        <DriverCard key={index} 
                                    name={driver.Full_Name} 
                                    badge={driver.Badge_Image} 
                                    team={driver.Team} 
                                    remove_driver={remove_driver}>
                                    </DriverCard>
                    ))}
                    
                </div>
                <RaceBar></RaceBar>
            </div>
        </div>
    )
}
export default HomePage