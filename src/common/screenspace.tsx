import { RefObject } from "react";

export class Rect {
    left: number;
    right: number;
    top: number;
    bottom: number;

    constructor(props: {
        left: number, 
        right: number,
        top: number, 
        bottom: number, 
    });
    constructor({
        top = 0,
        bottom = 0,
        left = 0,
        right = 0
    }) {
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
    };
    /**
     * Checks if the Rect contains a given Point
     */
    hasPoint(point: Point): boolean {
        return (
            point.x >= this.left &&
            point.x <= this.right &&
            point.y >= this.top &&
            point.y <= this.bottom
        );
    };
}

export class Point {
    x: number;
    y: number;

    constructor(props: {
        x: number, 
        y: number,
    });
    constructor({
        x = 0,
        y = 0,
    }) {
        this.x = x;
        this.y = y;
    };
    /**
     * Checks if the Point exists inside the given Rect
     */
    inRect(rect: Rect): boolean {
        console.log("Comparing Rect:");
        console.log(`X: ${rect.left} <= ${this.x} <= ${rect.right}`);
        console.log(`Y: ${rect.top} <= ${this.y} <= ${rect.bottom}`);
        return (
            this.x >= rect.left &&
            this.x <= rect.right &&
            this.y >= rect.top &&
            this.y <= rect.bottom
        );
    }
    toString(): string {
        return `{ x: ${this.x}, y: ${this.y} }`;
    }
}

export function getImageScale(
    img: HTMLImageElement
): number {
    const rect = img.getBoundingClientRect();
    return Math.max(
        rect.width / img.naturalWidth,
        rect.height / img.naturalHeight
    );
}

export function getRelPointToImage(
    point: Point,
    img: HTMLImageElement
): Point {
    const rect = img.getBoundingClientRect();

    const sourceWidth = img.naturalWidth;
    const sourceHeight = img.naturalHeight;

    const displayWidth = rect.width;
    const displayHeight = rect.height;

    const scale = Math.max(
        displayWidth / sourceWidth,
        displayHeight / sourceHeight
    );

    const renderedWidth = sourceWidth * scale;
    const renderedHeight = sourceHeight * scale;

    const cropX = (renderedWidth - displayWidth) / 2;
    const cropY = (renderedHeight - displayHeight) / 2;

    const x = point.x - rect.left + cropX;
    const y = point.y - rect.top + cropY;

    return new Point({
        x: x / scale,
        y: y / scale,
    });
}

export function getImagePointToRelative(
    point: Point,
    img: HTMLImageElement
): Point {
    const rect = img.getBoundingClientRect();

    const sourceWidth = img.naturalWidth;
    const sourceHeight = img.naturalHeight;

    const displayWidth = rect.width;
    const displayHeight = rect.height;

    const scale = Math.max(
        displayWidth / sourceWidth,
        displayHeight / sourceHeight
    );

    const renderedWidth = sourceWidth * scale;
    const renderedHeight = sourceHeight * scale;

    const cropX = (renderedWidth - displayWidth) / 2;
    const cropY = (renderedHeight - displayHeight) / 2;

    return new Point({
        x: point.x * scale - cropX,
        y: point.y * scale - cropY,
    });
}

export function getRelMousePointToImage(
    event: React.MouseEvent<HTMLImageElement>,
    img: HTMLImageElement
): Point {
    const point = new Point({
        x: event.clientX,
        y: event.clientY
    });

    return getRelPointToImage(point, img);
}
