"use client"
import { getRelMousePointToImage } from "@/common/screenspace";
import GameEvent from "@/common/storage";
import { JSX, RefObject, useEffect, useRef, useState } from "react";
import { ENABLE_PC_AREA, DISABLE_PC_AREA, DESKTOP, FULLROOM, FULLROOM_FOOTER, FULLROOM_HEADER, randomImageIdx, Background, AppOverlay } from "./background";

const PcOffState = "PcOffState";

const zoomDuration = 300;
const zoomMin = 1.0;
const zoomMax = 8.0;

const useBool = (
    key: string,
    defaultValue: boolean
): [boolean, boolean, (value: boolean) => void] => {
    const [state, setState] = useState(defaultValue);
    const [ready, setReady] = useState(false);
 
    useEffect(() => {
        const stored = GameEvent.getBool(key);
        setState(stored === null ? defaultValue : stored);
        setReady(true);
    }, [key]);
 
    const setStateHook = (value: boolean): void => {
        setState(value);
        GameEvent.setBool(key, value);
    };
 
    return [state, ready, setStateHook];
};
 
const useHydrated = (): boolean => {
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => setHydrated(true), []);
    return hydrated;
};


export default function Page(): JSX.Element {
    const [image, setImage] = useState(0);
    const [opacity, setOpacity] = useState(0);
    const [pcOff, pcOffReady, setPcOff] = useBool(PcOffState, true);
    const [zoom, setZoom] = useState(1);
    const hydrated = useHydrated();
 
    const initialStateResolved = useRef(false);
    const fullroomRef = useRef<HTMLImageElement>(null);
    const desktopRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const idx = randomImageIdx();
            setImage(idx);
        }, 2000);
 
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!pcOffReady) {
            return;
        }

        if (pcOff) {
            setZoom(1);
            setOpacity(0);
            initialStateResolved.current = true;
            return;
        }

        if (!initialStateResolved.current) {
            setZoom(zoomMax);
            setOpacity(1);
            initialStateResolved.current = true;
            return;
        }

        const startTime = performance.now();

        let frame: number;

        const animate = (time: number) => {
            const progress = Math.min(
                (time - startTime) / zoomDuration,
                1
            );

            const eased = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            setZoom(
                zoomMin + (zoomMax - zoomMin) * eased
            );

            setOpacity(eased);

            if (progress < 1) {
                frame = requestAnimationFrame(animate);
            }
        };

        frame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frame);
    }, [pcOff, pcOffReady]);
 
    const imgClick = (
        event: React.MouseEvent<HTMLImageElement>,
        imgRef: RefObject<HTMLImageElement | null>
    ) => {
        const img = imgRef.current;
        if (!img) return;

        const cursorPos = getRelMousePointToImage(event, img);

        const enable = !cursorPos.inRect(ENABLE_PC_AREA);
        const disable = cursorPos.inRect(DISABLE_PC_AREA);
        
        setPcOff(pcOff ? enable : disable);
    };
  
    if (!hydrated) return (<Background img={FULLROOM[0]} />);
 
    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
            }}
        >
            {zoom < zoomMax && <>
                <Background
                    ref={fullroomRef}
                    img={FULLROOM[image]}
                    zoom={zoom}
                    onClick={event => imgClick(event, fullroomRef)}
                />
                <img
                    src={FULLROOM_HEADER.src}
                    alt={FULLROOM_HEADER.alt}
                    style={{
                        position: "absolute",
                        top: -10,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "30vw",
                        height: "auto",

                    }}
                />
                <img
                    src={FULLROOM_FOOTER.src}
                    alt={FULLROOM_FOOTER.alt}
                    style={{
                        position: "absolute",
                        bottom: "2%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "30vw",
                        height: "auto",

                    }}
                />

            </>}

            {!pcOff && (
                <>
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <Background
                            ref={desktopRef}
                            img={DESKTOP[image]}
                            onClick={event => imgClick(event, desktopRef)}
                            opacity={opacity}
                        />
                        <AppOverlay 
                            imgRef={desktopRef}
                        />
                    </div>

                </>
            )}
            <audio loop />
        </div>
    );
}