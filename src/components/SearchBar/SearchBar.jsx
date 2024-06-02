import React from 'react';
import "./searchBar.css";

export function SearchBar({
    handleSubmit,
    inputVal,
    handleChange
}) {
    return (
        <form id="searchSongsForm" onSubmit={handleSubmit}>
            <input required className='button' type='text' placeholder='Find new songs' name='searchSongs' id='searchSongs' value={inputVal} onChange={handleChange} />
            <div><button className="mainButton" type='submit'>Search</button></div>
        </form>
    );
}