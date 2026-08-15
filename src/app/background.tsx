import { getImagePointToRelative, getImageScale, Point, Rect } from "@/common/screenspace";
import background from "../static/background.json";
import { MouseEventHandler, Ref, RefObject, useEffect, useState } from "react";

type ImgData = {
    src: string,
    alt: string,
}

const IMAGE_FORMAT = "jpg";
const GIF = "gif"

function toImgData(
    path: string,
    fileData: typeof background.fileData[0],
    format: string,
): ImgData {
    return ({
        src: `${path}${fileData.name}.${format}`,
        alt: fileData.alt
    });
}

export const FULLROOM_HEADER: ImgData = toImgData(background.fullroom, background.fullroomHeader, GIF);
export const FULLROOM_FOOTER: ImgData = toImgData(background.fullroom, background.fullroomFooter, GIF);

export const FULLROOM: ImgData[] = background.fileData.map(fileData => {
    return toImgData(background.fullroom, fileData, IMAGE_FORMAT);
});

export const DESKTOP: ImgData[] = background.fileData.map(fileData => {
    return toImgData(background.desktop, fileData, IMAGE_FORMAT);
});


export function AppOverlay(props: {
    imgRef: RefObject<HTMLImageElement | null>
}) {
    // react re-render electric boogaloo
    const [_size, setSize] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        const element = props.imgRef.current;
        if (!element) return;

        const update = () => {
            const { width, height } = element.getBoundingClientRect();
            setSize({ width, height });
        };

        update();

        window.addEventListener("resize", update);

        return () => {
            window.removeEventListener("resize", update);
        };

    }, [props.imgRef]);

    const img = props.imgRef.current;
    if (!img) return <></>;

    const target = new Point({
        x: 680,
        y: 320
    });

    // size of image in original screen space
    const size = 200;

    const origin = getImagePointToRelative(target, img);
    const scale = getImageScale(img);
    const width = scale * size;

    return background.appData.map((fileData, index) => {
        const offset = index * width;
        return (
            <a
                href={fileData.href}
                key={fileData.name}
                style={{
                    position: "absolute",
                    top: isFinite(origin.y) ? origin.y : 1,
                    left: isFinite(origin.x) ? origin.x + offset : 1,
                }}
            >
                <img 
                    src={`${background.apps}${fileData.name}.${IMAGE_FORMAT}`}
                    alt={fileData.alt}
                    style={{
                        width: isFinite(width) ? width : 0
                    }}
                />
            </a>
        );
    });
}

export const randomImageIdx = () => Math.floor(Math.random() * background.fileData.length);

export const ENABLE_PC_AREA = new Rect({
    left: 910,
    right: 1025,
    top: 500,
    bottom: 585,
});

export const DISABLE_PC_AREA = new Rect({
    left: 1180,
    right: 1225,
    top: 822,
    bottom: 870,
});

export function Background(props: {
    ref?: Ref<HTMLImageElement>
    img: ImgData,
    zoom?: number,
    opacity?: number,
    onClick?: MouseEventHandler<HTMLImageElement>
}) {
    return (
        <img
            ref={props.ref}
            src={props.img.src}
            alt={props.img.alt}
            onClick={props.onClick}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${props.zoom ?? 1})`,
                transformOrigin: "center center",
                opacity: props.opacity,
            }}
        />
    );
}