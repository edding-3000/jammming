import React from 'react';

export function Track({
    searchResult
}) {
    return (
        <li>
            <p>{`${searchResult.name} - ${searchResult.artist}`}</p>
            <p>{searchResult.album}</p>
            <button>Add</button>
        </li>
    );
}