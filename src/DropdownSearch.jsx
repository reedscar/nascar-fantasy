import './css_styles/dropdownSearch.css'
import { useEffect, useState } from 'react' 
import { supabase } from './supabaseClient';

function DropdownSearch({ onDriverSelect }){

    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setDropdown] = useState(false);

    const handleSearch = async (term) => {

        // if there is nothing, return null
        if (!term) {
            setResults([]);
            setDropdown(false);
            return
        }

        // search for driver in the database
        const { data, error } = await supabase
            .from('Drivers')
            .select('*')
            .ilike('Full_Name', `%${term}%`)
        
        if (error) {
            console.error('Search error:', error.message);
        } else {
            setDropdown(true);
            setResults(data);
        }
    };

     // wait 300ms after user stops typing
    useEffect(() => {
        const delayDebounce = setTimeout(() => {handleSearch(searchTerm);}, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleSelect = (name) => {
        setSearchTerm('')
        setDropdown(false)
        onDriverSelect(name)
    }

    return(
        <div className='driver-search'>
            <input
                className='nascar-input'
                type='text'
                placeholder='Search...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            ></input>

            {showDropdown && results.length > 0 && (
            <ul className='dropdown-list'>
                {results.map((driver) => (
                    <li
                    key={driver.Nascar_Driver_ID}
                    className='dropdown-item'
                    onClick={() => handleSelect(driver.Full_Name)}
                    >
                    {driver.Full_Name}
                    </li>
                ))}
            </ul>
        )}
        </div>
    )
}
export default DropdownSearch