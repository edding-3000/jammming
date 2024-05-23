import React from 'react';
export function TrackList({
    searchQuery,
    searchResults,
    children
}) {
    return (
        <>
            <h2>{searchResults.length === 0 ? "No r" : "R"}esults{searchQuery.length > 0 ? ` for "${searchQuery}"` : ""}</h2>
            {children}
        </>
    );
}