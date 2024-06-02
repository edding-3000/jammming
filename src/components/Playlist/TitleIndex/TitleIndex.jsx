import React, { useState, useEffect } from "react";
import "./titleIndex.css";

function TitleIndex({
    scrollContainerRef,
    playlistTracks
}) {
    const [showTitleIndex, setShowTitleIndex] = useState(false);
    const [visibleItemIndex, setVisibleItemIndex] = useState(0);

    useEffect(() => {
        if (scrollContainerRef) {
            console.log('scrollContainerRef is set:', scrollContainerRef.current);
            const options = {
                root: scrollContainerRef.current,
                rootMargin: '0px',
                threshold: 0.5
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisibleItemIndex(parseInt(entry.target.getAttribute('data-index')));
                    }
                });
            }, options);

            const items = scrollContainerRef.current.querySelectorAll('.scroll-item');
            items.forEach((item, index) => {
                item.setAttribute('data-index', index);
                observer.observe(item);
            });

            return () => {
                items.forEach(item => {
                    observer.unobserve(item);
                });
            };
        }
    }, [playlistTracks]);

    useEffect(() => {
        setShowTitleIndex(true);
        const timeout = setTimeout(() => {
            setShowTitleIndex(false);
        }, 1500);
        return () => {
            clearTimeout(timeout);
        }
    }, [visibleItemIndex, playlistTracks])

    return (
        <p className={`scrollNumber ${showTitleIndex ? "show" : "hide"}`}>{visibleItemIndex + 1}/{playlistTracks.length}</p>
    );
}

export default TitleIndex;