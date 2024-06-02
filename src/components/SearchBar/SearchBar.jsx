import React from 'react';
import "./searchBar.css";
import { targetRef } from '../TrackList/TrackList';

export function SearchBar({
    handleSubmit,
    inputVal,
    handleChange
}) {
    const formSubmit = (e) => {
        e.preventDefault();
        targetRef.current.scrollIntoView({ behavior: 'smooth' });
        handleSubmit(e);
    }
    return (
        <form id="searchSongsForm" onSubmit={formSubmit}>
            <input required className='button' type='text' placeholder='Find new songs' name='searchSongs' id='searchSongs' value={inputVal} onChange={handleChange} />
            <div><button className="mainButton" type='submit'>Search</button></div>
        </form>
    );
}