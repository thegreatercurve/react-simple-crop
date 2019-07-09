import * as React from "react";
import { State } from "../reducers";
import {
  CropValue,
  Directions,
  ResizeAction,
  ResizeActionTypes,
  AspectRatio
} from "../types";
import {
  getXPercent,
  getYPercent,
  isDirection,
  restrictPointToBounds,
  getNewAspectRatio
} from "../utils";

interface OppositeDirectionMap {
  [key: string]: Pick<CropValue, "x" | "y">;
}

const getOppositeDirection = ({
  height,
  width,
  x,
  y
}: CropValue): OppositeDirectionMap => ({
  [Directions.North]: { x: x + width / 2, y: y + height },
  [Directions.NorthEast]: { x, y: y + height },
  [Directions.East]: { x, y: y + height / 2 },
  [Directions.South]: { x: x + width / 2, y },
  [Directions.SouthEast]: { x, y },
  [Directions.SouthWest]: { x: x + width, y },
  [Directions.West]: { x: x + width, y: y + height / 2 },
  [Directions.NorthWest]: { x: x + width, y: y + height }
});

export const useResizeCrop = (
  dispatch: React.Dispatch<ResizeAction>,
  onChange: (crop: CropValue) => void,
  value: CropValue,
  state: State,
  aspectRatio?: AspectRatio
): [
  (event: React.MouseEvent | React.TouchEvent) => void,
  (
    event: React.MouseEvent | React.TouchEvent | TouchEvent,
    imageRef: HTMLImageElement
  ) => void,
  () => void
] => {
  const { direction, x0, y0 } = state;

  const startResize = (event: React.MouseEvent | React.TouchEvent): void => {
    event.stopPropagation();

    const { id } = event.currentTarget;

    if (!isDirection(id)) {
      return;
    }

    dispatch({
      ...getOppositeDirection(value)[id],
      direction: id,
      type: ResizeActionTypes.StartResize
    });
  };

  const updateResize = (
    event: React.MouseEvent | React.TouchEvent | TouchEvent,
    imageRef: HTMLImageElement
  ): void => {
    if (!direction) {
      return;
    }

    const x = restrictPointToBounds(getXPercent(event, imageRef));
    const y = restrictPointToBounds(getYPercent(event, imageRef));

    const xDelta = x - x0;
    const yDelta = y - y0;

    if (aspectRatio) {
      onChange(
        getNewAspectRatio(aspectRatio, { ...value, x, y }, state, imageRef)
      );

      return;
    }

    const isNorthOrSouth = [Directions.North, Directions.South].includes(
      direction
    );
    const isEastOrWest = [Directions.East, Directions.West].includes(direction);

    onChange({
      ...value,
      ...(!isNorthOrSouth ? { x: xDelta > 0 ? x0 : x } : {}),
      ...(!isNorthOrSouth ? { width: Math.abs(xDelta) } : {}),
      ...(!isEastOrWest ? { y: yDelta > 0 ? y0 : y } : {}),
      ...(!isEastOrWest ? { height: Math.abs(yDelta) } : {})
    });
  };

  const finishResize = (): void => {
    dispatch({ type: ResizeActionTypes.FinishResize });
  };

  return [startResize, updateResize, finishResize];
};
