import { useEffect, useState } from 'react';
import './css_styles/leaguePage.css'
import NavBar from './NavBar';
import { supabase } from './supabaseClient';
import './css_styles/DropdownSearch.css'

function LeaguePage({ user, setUser }){

    const [inputValue, setInputValue] = useState('');
    const [newLeagueName, setNewLeagueName] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [showDropdown, setDropdown] = useState(false);
    const [searchResults, setResults] = useState('');
    const [leagueData, setLeagueData] = useState([]);

    const fetchLeagues = async () => {
        // fetch the leagues the user is in
        const { data, error } = await supabase
            .from('Leagues')
            .select('*')
            .contains('players', [user.id]);
        
        if (error){
            console.log(error.message);
            return
        } 

        // collect all unique player IDs from all leagues
        const allPlayerIds = [...new Set(data.flatMap(league => league.players))];

        // fetch user info for all player IDs
        const { data: users, error: userError } = await supabase
            .from('Players')
            .select('*')
            .in('user_id', allPlayerIds);

        if (userError) {
            console.error("Error fetching users:", userError.message);
            return;
        }

        // map user IDs to names
        const idToName = {};
        users.forEach(user => {
            idToName[user.user_id] = user.name;
        });

        // build the final data structure
        const leagueDataUp = data.map(league => ({
            team_name: league.team_name,
            players: league.players.map(id => idToName[id] || "Unknown")
        }));

        setLeagueData(leagueDataUp);
        
    }

    const handleSelect = async (team) => {
        setDropdown(false);
        await joinLeague(team, user.id);
        fetchLeagues();
    }

    const createLeague = async (name) => {
        setShowPopup(false);
        const { error } = await supabase
            .from('Leagues')
            .insert([
                {
                team_name: name,
                players: [user.id]
                }
            ]);
        
        if (error){
            console.log(error.message);
        }
        fetchLeagues();
    }

    const joinLeague = async (leagueName, newPlayerId) => {

        // Fetch current array
        const { data, error } = await supabase
            .from('Leagues')
            .select('players')
            .eq('team_name', leagueName)
            .single();

        if (error) {
            console.error('Error fetching league:', error.message);
            return;
        }

        const currentPlayers = data.players || [];

        // Make sure player isnt already in the league
        if (currentPlayers.includes(newPlayerId)) {
            console.log('Player already in league');
            return;
        }

        // Update array
        const { error: updateError } = await supabase
            .from('Leagues')
            .update({ players: [...currentPlayers, newPlayerId] })
            .eq('team_name', leagueName);

        if (updateError) {
            console.error('Error updating league:', updateError.message);
        } else {
            console.log('Player added to league');
        }
    };

    const handleSearch = async (term) => {

        // if there is nothing, return null
        if (!term) {
            setResults([]);
            setDropdown(false);
            return
        }

        // search for a team in the database
        const { data, error } = await supabase
            .from('Leagues')
            .select('*')
            .ilike('team_name', `%${term}%`)
        
        if (error) {
            console.error('Search error:', error.message);
        } else {
            console.log(data)
            setDropdown(true);
            setResults(data);
        }
    };

    const handleRemove = async (team) => {
        // Fetch the team
        const { data, error } = await supabase
            .from('Leagues')
            .select('players')
            .eq('team_name', team)
            .single();


        if (error) {
            console.error('Error fetching league:', error.message);
            return;
        }

        const currentPlayers = data.players || [];
        // remove player
        const updatedPlayers = currentPlayers.filter(id => id !== user.id);

        // Update array
        const { error: updateError } = await supabase
            .from('Leagues')
            .update({ players: updatedPlayers })
            .eq('team_name', team);

        if (updateError) {
            console.error('Error updating league:', updateError.message);
        } else {
            console.log('Player removed from league');
        }
        fetchLeagues();
    }

    // wait 300ms after user stops typing
    useEffect(() => {
        fetchLeagues();
        const delayDebounce = setTimeout(() => {handleSearch(inputValue);}, 300);
        return () => clearTimeout(delayDebounce);
    }, [inputValue]);

    return(
        <div className='league-page'> 
            <NavBar user={user} setUser={setUser}></NavBar>
            <div className='title-bar-leagues'>
                <p>Leagues</p>
            </div>
            <div className='league-page-main'>
                <div className='league-creation'>
                    <input 
                    className='league-input'
                    type='text'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder='Search League Name...'
                    ></input>
                   <div>
                        {showDropdown && searchResults.length > 0 && (
                            <ul className="dropdown-list">
                            {searchResults.map((team) => (
                                <li
                                key={team.id}
                                className="dropdown-item"
                                onClick={() => handleSelect(team.team_name)}
                                >
                                {team.team_name}
                                </li>
                            ))}
                            </ul>
                        )}
                    </div>
                    <button onClick={() => joinLeague(1, user.id)}>Join League</button>
                    <button onClick={() => setShowPopup(true)}>Create New League</button>
                </div>
                <div className='league-container'>
                    {leagueData.map((team, index) => (
                    
                        <div key={index} className='league-card'>
                            <p>League Name: {team.team_name}</p>
                            {team.players.map((p, index) => (
                                <p key={index}>{p}</p>
                            ))}
                            <button onClick={() => handleRemove(team.team_name)} className='league-card-button'>Leave League</button>
                        </div>

                    ))}
                </div>
            </div>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h3>Enter League Name</h3>
                        <input
                            className='popup-input'
                            type="text"
                            value={newLeagueName}
                            onChange={(e) => setNewLeagueName(e.target.value)}
                            placeholder="Enter League name.."
                        />
                        <div className="popup-buttons">
                            <button onClick={() => createLeague(newLeagueName)}>Submit</button>
                            <button onClick={() => setShowPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default LeaguePage