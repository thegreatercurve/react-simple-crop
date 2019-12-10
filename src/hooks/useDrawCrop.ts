import * as React from "react";
import { State } from "../reducers";
import {
  AspectRatio,
  CropValue,
  DrawAction,
  DrawActionTypes,
  Status
} from "../types";
import {
  clamp,
  getNewAspectRatio,
  getRestrictedSizeCropValue,
  getXPercent,
  getYPercent
} from "../utils";

export const useDrawCrop = (
  dispatch: React.Dispatch<DrawAction>,
  onChange: (crop: CropValue, status: Status) => void,
  state: State,
  onStart?: (status: Status) => void,
  onComplete?: (status: Status) => void,
  minWidth?: number,
  maxWidth?: number,
  minHeight?: number,
  maxHeight?: number,
  aspectRatio?: AspectRatio
): [
  (
    event: React.MouseEvent | React.TouchEvent,
    imageRef: HTMLImageElement
  ) => void,
  (
    event: React.MouseEvent | React.TouchEvent | TouchEvent,
    imageRef: HTMLImageElement
  ) => void,
  () => void
] => {
  const { x0, y0 } = state;

  const startDraw = (
    event: React.MouseEvent | React.TouchEvent,
    imageRef: HTMLImageElement
  ): void => {
    // Prevent default mousedown event to fix image dragging in Firefox: https://www.redips.net/firefox/disable-image-dragging/
    event.preventDefault();

    const x = getXPercent(event, imageRef);
    const y = getYPercent(event, imageRef);

    if (onStart) {
      onStart(Status.Drawing);
    }

    // onChange(
    //   {
    //     height: 0,
    //     width: 0,
    //     x,
    //     y
    //   },
    //   Status.Drawing
    // );

    dispatch({
      type: DrawActionTypes.StartDraw,
      x,
      y
    });
  };

  const updateDraw = (
    event: React.MouseEvent | React.TouchEvent | TouchEvent,
    imageRef: HTMLImageElement
  ): void => {
    const x = clamp(getXPercent(event, imageRef));
    const y = clamp(getYPercent(event, imageRef));

    let width = clamp(Math.abs(x0 - x), minWidth, maxWidth);
    let height = clamp(Math.abs(y0 - y), minHeight, maxHeight);

    let cropValue = {
      height,
      width,
      x: x < x0 ? x : x0,
      y: y < y0 ? y : y0
    };

    if (aspectRatio) {
      cropValue = {
        ...cropValue,
        ...getNewAspectRatio(
          aspectRatio,
          { height, width, x, y },
          state,
          imageRef
        )
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

    onChange(cropValue, Status.Drawing);
  };

  const finishDraw = (): void => {
    if (onComplete) {
      onComplete(Status.Drawing);
    }

    dispatch({ type: DrawActionTypes.FinishDraw });
  };

  return [startDraw, updateDraw, finishDraw];
};
