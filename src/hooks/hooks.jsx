import { useState, useEffect, useRef } from 'react';

export const useAudioPlayer = () => {
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);


    let toParent = (data) => {
        console.log(data);
    }

    const playAudio = (event) => {
        const { target } = event;
        if (target.tagName.toLowerCase() === "picture") {
            const targetAudio = target.closest("li").querySelector("span audio");

            // if (targetAudio.getAttribute("src") === currentAudio.getAttribute("src")) {
            //     console.log("same");
            //     if (!currentAudio.paused) {
            //         console.log("pause same");
            //         currentAudio.pause();
            //         targetAudio.pause();
            //         setCurrentAudio(targetAudio);
            //     } else {
            //         setCurrentAudio(targetAudio);
            //         targetAudio.currentTime = time;
            //         targetAudio.volume = 0.5;
            //         targetAudio.play();
            //         setIsPlaying(targetAudio.getAttribute("src"));
            //     }
            // } else {
            if (currentAudio && currentAudio !== targetAudio) {
                currentAudio.pause();
                setIsPlaying(false);
            }
            if (targetAudio.paused) {
                setCurrentAudio(targetAudio);
                targetAudio.volume = 0.5;
                targetAudio.play();
                setIsPlaying(targetAudio.getAttribute("src"));
            } else {
                setCurrentAudio(targetAudio);
                targetAudio.pause();
                setIsPlaying(false);
            }
            // if (time === targetAudio.duration) {
            //     setTime(0);
            //     setIsPlaying(false);
            // }
            // }
        }

    };

    // useEffect(() => {
    //     if (!currentAudio) return;

    //     let timeout;
    //     if (!currentAudio.paused && isPlaying) {
    //         const audioDuration = Math.floor(currentAudio.duration * 1000);
    //         const currentTimestamp = Math.floor(currentAudio.currentTime * 1000);
    //         const timeLeft = audioDuration - currentTimestamp;
    //         console.log("audioDuration", audioDuration / 1000);
    //         console.log("currentTimestamp", currentTimestamp / 1000);
    //         console.log("timeLeft", timeLeft / 1000);
    //         timeout = setTimeout(() => {
    //             setIsPlaying(false);
    //             setTime(0);
    //             console.log("timeout")
    //         }, timeLeft);
    //     }
    //     return () => {
    //         clearTimeout(timeout);
    //     };
    // }, [currentAudio, isPlaying]);

    return {
        playAudio,
        isPlaying
    };
};
