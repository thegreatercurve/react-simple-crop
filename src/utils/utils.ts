import {
  ArrowKeys,
  CropValue,
  Directions,
  AspectRatio,
  Status
} from "../types";
import { State } from "../reducers";

export const arePassiveListenersSupported = (): boolean => {
  try {
    const options = Object.defineProperty({}, "passive", {
      get: (): boolean => true
    });

    document.addEventListener("testPassive", (): null => null, options);
    document.removeEventListener("testPassive", (): null => null, options);
  } catch (e) {
    return false;
  }

  return false;
};

interface NearKeys {
  [key: string]: ArrowKeys[];
}

const NEAR_KEYS: NearKeys = {
  ArrowDown: [ArrowKeys.ArrowRight, ArrowKeys.ArrowLeft, ArrowKeys.ArrowUp],
  ArrowLeft: [ArrowKeys.ArrowDown, ArrowKeys.ArrowUp, ArrowKeys.ArrowRight],
  ArrowRight: [ArrowKeys.ArrowUp, ArrowKeys.ArrowDown, ArrowKeys.ArrowLeft],
  ArrowUp: [ArrowKeys.ArrowLeft, ArrowKeys.ArrowRight, ArrowKeys.ArrowDown]
};

interface NearDirectionsByKey {
  [key: string]: Directions[];
}

const NEAR_DIRECTIONS_BY_KEY: NearDirectionsByKey = {
  ArrowDown: [Directions.SouthEast, Directions.South, Directions.SouthWest],
  ArrowLeft: [Directions.SouthWest, Directions.West, Directions.NorthWest],
  ArrowRight: [Directions.NorthEast, Directions.East, Directions.SouthEast],
  ArrowUp: [Directions.NorthWest, Directions.North, Directions.NorthEast]
};

export const getDirectionDirection = (
  key: ArrowKeys,
  pressedKeys: ArrowKeys[]
): Directions | null => {
  const [nearLeft, nearRight, opposite] = NEAR_KEYS[key];
  const [
    nearLeftDirection,
    nearRightDirection,
    oppositeDirection
  ] = NEAR_DIRECTIONS_BY_KEY[key];

  if (pressedKeys.includes(nearLeft) && !pressedKeys.includes(nearRight)) {
    return nearLeftDirection;
  } else if (
    !pressedKeys.includes(nearLeft) &&
    pressedKeys.includes(nearRight)
  ) {
    return oppositeDirection;
  } else if (!pressedKeys.includes(opposite)) {
    return nearRightDirection;
  }

  return null;
};

interface CropStyle {
  height: string;
  left: string;
  top: string;
  width: string;
}

export const getCropStyle = ({
  height,
  width,
  x,
  y
}: CropValue): CropStyle => ({
  height: `${height}%`,
  left: `${x}%`,
  top: `${y}%`,
  width: `${width}%`
});

export const getNewAspectRatio = (
  [aspectWidth, aspectHeight]: AspectRatio,
  value: CropValue,
  { status, x0, y0 }: Pick<State, "status" | "x0" | "y0">,
  { clientHeight, clientWidth }: HTMLImageElement
): CropValue => {
  const { x, y } = value;

  const xDelta = x - x0;
  const yDelta = y - y0;

  const cropRatio = aspectWidth / aspectHeight;
  const imageRatio = clientWidth / clientHeight;

  const newHeight = (Math.abs(xDelta) / cropRatio) * imageRatio;
  let newWidth: number;

  if (yDelta < 0 && y0 - newHeight < 0) {
    newWidth = (y0 * cropRatio) / imageRatio;

    return {
      height: y0,
      width: newWidth,
      x: xDelta < 0 ? x0 - newWidth : x0,
      y: 0
    };
  } else if (yDelta > 0 && y0 + newHeight > 100) {
    newWidth = ((100 - y0) * cropRatio) / imageRatio;

    return {
      height: 100 - y0,
      width: newWidth,
      x: xDelta < 0 ? x0 - newWidth : x0,
      y: y0
    };
  }

  return {
    ...value,
    ...(status === Status.Resizing ? { width: Math.abs(xDelta) } : {}),
    height: newHeight,
    x: xDelta < 0 ? x : x0,
    y: yDelta < 0 ? y0 - newHeight : y0
  };
};

export const getXPercent = (
  event: React.MouseEvent | React.TouchEvent | TouchEvent,
  { clientWidth, offsetLeft }: HTMLImageElement
): number => {
  const { scrollX } = window;
  let x: number;

  if ("touches" in event) {
    x = event.touches[0].clientX;
  } else {
    x = event.clientX;
  }

  return ((x - offsetLeft + scrollX) / clientWidth) * 100;
};

export const getYPercent = (
  event: React.MouseEvent | React.TouchEvent | TouchEvent,
  { clientHeight, offsetTop }: HTMLImageElement
): number => {
  const { scrollY } = window;
  let y: number;

  if ("touches" in event) {
    y = event.touches[0].clientY;
  } else {
    y = event.clientY;
  }

  return ((y - offsetTop + scrollY) / clientHeight) * 100;
};

export const isArrowKey = (key: string): key is ArrowKeys =>
  key === ArrowKeys.ArrowUp ||
  key === ArrowKeys.ArrowRight ||
  key === ArrowKeys.ArrowDown ||
  key === ArrowKeys.ArrowLeft;

export const isDirection = (str: string): str is Directions =>
  str === Directions.North ||
  str === Directions.NorthEast ||
  str === Directions.East ||
  str === Directions.SouthEast ||
  str === Directions.South ||
  str === Directions.SouthWest ||
  str === Directions.West ||
  str === Directions.NorthWest;

export const restrictPointToBounds = (
  point: number,
  min: number = 0,
  max: number = 100
): number => Math.min(Math.max(point, min), max);
