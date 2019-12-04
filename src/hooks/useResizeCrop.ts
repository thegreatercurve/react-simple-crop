import * as React from "react";
import { State } from "../reducers";
import {
  AspectRatio,
  CropValue,
  Directions,
  ResizeAction,
  ResizeActionTypes
} from "../types";
import {
  clamp,
  getNewAspectRatio,
  getRestrictedSizeCropValue,
  getXPercent,
  getYPercent,
  isDirection
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
  onStart?: () => void,
  onComplete?: () => void,
  minWidth?: number,
  maxWidth?: number,
  minHeight?: number,
  maxHeight?: number,
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

    if (onStart) {
      onStart();
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

    const x = clamp(getXPercent(event, imageRef));
    const y = clamp(getYPercent(event, imageRef));

    const xDelta = x - x0;
    const yDelta = y - y0;

    let width = clamp(Math.abs(xDelta), minWidth, maxWidth);
    let height = clamp(Math.abs(yDelta), minHeight, maxHeight);

    const isNorthOrSouth = [Directions.North, Directions.South].includes(
      direction
    );
    const isEastOrWest = [Directions.East, Directions.West].includes(direction);

    let cropValue = {
      ...value,
      ...(!isNorthOrSouth ? { x: xDelta > 0 ? x0 : x } : {}),
      ...(!isNorthOrSouth ? { width } : {}),
      ...(!isEastOrWest ? { y: yDelta > 0 ? y0 : y } : {}),
      ...(!isEastOrWest ? { height } : {})
    };

    if (aspectRatio) {
      cropValue = {
        ...cropValue,
        ...getNewAspectRatio(aspectRatio, { ...value, x, y }, state, imageRef)
      };
    }

    if (minWidth || maxWidth) {
      cropValue = {
        ...cropValue,
        x: getRestrictedSizeCropValue(x, x0, minWidth, maxWidth)
      };
    }

    if (minHeight || maxHeight) {
      cropValue = {
        ...cropValue,
        y: getRestrictedSizeCropValue(y, y0, minHeight, maxHeight)
      };
    }

    onChange(cropValue);
  };

  const finishResize = (): void => {
    if (onComplete) {
      onComplete();
    }

    dispatch({ type: ResizeActionTypes.FinishResize });
  };

  return [startResize, updateResize, finishResize];
};
