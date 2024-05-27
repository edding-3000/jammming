import React from 'react';

export function SearchBar({
    handleSubmit,
    inputVal,
    handleChange
}) {
    return <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Search songs' name='searchSongs' id='searchSongs' value={inputVal} onChange={handleChange} />
        <button type='submit'>Search</button>
    </form>;
}