"use client"

import { useEffect, useState } from "react";
import { randomImageIdx, DESKTOP, Background } from "../background";

export default function Page() {
    const [image, setImage] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            const idx = randomImageIdx();
            setImage(idx);
        }, 2000);
 
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                }}
            >
                <Background
                    img={DESKTOP[image]}
                />
            </div>        
        </>
    );
}