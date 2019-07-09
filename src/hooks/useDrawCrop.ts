import * as React from "react";
import { State } from "../reducers";
import { CropValue, DrawAction, DrawActionTypes, AspectRatio } from "../types";
import {
  getXPercent,
  getYPercent,
  restrictPointToBounds,
  getNewAspectRatio
} from "../utils";

export const useDrawCrop = (
  dispatch: React.Dispatch<DrawAction>,
  onChange: (crop: CropValue) => void,
  value: CropValue,
  state: State,
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

    onChange({
      height: 0,
      width: 0,
      x,
      y
    });

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
    const x = restrictPointToBounds(getXPercent(event, imageRef));
    const y = restrictPointToBounds(getYPercent(event, imageRef));

    const width = Math.abs(x0 - x);
    const height = Math.abs(y0 - y);

    if (aspectRatio) {
      onChange(
        getNewAspectRatio(aspectRatio, { height, width, x, y }, state, imageRef)
      );

      return;
    }

    onChange({
      height,
      width,
      x: x < x0 ? x : x0,
      y: y < y0 ? y : y0
    });
  };

  const finishDraw = (): void => {
    dispatch({ type: DrawActionTypes.FinishDraw });
  };

  return [startDraw, updateDraw, finishDraw];
};
