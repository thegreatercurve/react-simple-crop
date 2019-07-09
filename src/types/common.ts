export enum ArrowKeys {
  ArrowUp = "ArrowUp",
  ArrowRight = "ArrowRight",
  ArrowDown = "ArrowDown",
  ArrowLeft = "ArrowLeft"
}

export type AspectRatio = [number, number];

export interface CropValue {
  height: number;
  width: number;
  x: number;
  y: number;
}

export enum Directions {
  North = "n",
  NorthEast = "ne",
  East = "e",
  SouthEast = "se",
  South = "s",
  SouthWest = "sw",
  West = "w",
  NorthWest = "nw"
}

export enum Status {
  Drawing = "Drawing",
  MovingByKeyboard = "MovingByKeyboard",
  MovingByMouse = "MovingByMouse",
  Resizing = "Resizing",
  None = "None"
}
