import * as React from "react";
import { State } from "../reducers";
import { CropValue, MoveAction, MoveActionTypes } from "../types";
import {
  getDirectionDirection,
  getXPercent,
  getYPercent,
  isArrowKey,
  restrictPointToBounds
} from "../utils";

export const useMoveCrop = (
  dispatch: React.Dispatch<MoveAction>,
  onChange: (crop: CropValue) => void,
  value: CropValue,
  { pressedKeys, x0, y0 }: State
): [
  (
    event: React.MouseEvent | React.TouchEvent,
    imageRef: HTMLImageElement
  ) => void,
  (
    event: React.MouseEvent | React.TouchEvent | TouchEvent,
    imageRef: HTMLImageElement
  ) => void,
  () => void,
  (event: React.KeyboardEvent<HTMLDivElement>) => void,
  (event: React.KeyboardEvent<HTMLDivElement>) => void
] => {
  const { height, width, x, y } = value;

  const startMoveByKeyboard = (
    event: React.MouseEvent | React.TouchEvent,
    imageRef: HTMLImageElement
  ): void => {
    dispatch({
      type: MoveActionTypes.StartMoveByMouse,
      x: getXPercent(event, imageRef) - x,
      y: getYPercent(event, imageRef) - y
    });
  };

  const updateMoveByMouse = (
    event: React.MouseEvent | React.TouchEvent | TouchEvent,
    imageRef: HTMLImageElement
  ): void => {
    onChange({
      ...value,
      x: restrictPointToBounds(
        getXPercent(event, imageRef) - x0,
        0,
        100 - width
      ),
      y: restrictPointToBounds(
        getYPercent(event, imageRef) - y0,
        0,
        100 - height
      )
    });
  };

  const updateMoveByKeyboard = (x: number, y: number): void => {
    onChange({
      ...value,
      x: restrictPointToBounds(x, 0, 100 - width),
      y: restrictPointToBounds(y, 0, 100 - height)
    });
  };

  const finishMoveByKeyboard = (): void => {
    dispatch({ type: MoveActionTypes.FinishMoveByMouse });
  };

  const startMoveOnKeyDown = ({
    repeat,
    key
  }: React.KeyboardEvent<HTMLDivElement>): void => {
    if (!isArrowKey(key)) {
      return;
    }

    const NUDGE_PERCENTAGE = repeat ? 0.75 : 0.25;

    const direction = getDirectionDirection(key, pressedKeys);

    if (!direction) {
      return;
    }

    let newX = x;
    let newY = y;

    if (direction.includes("e")) {
      newX = x + NUDGE_PERCENTAGE;
    } else if (direction.includes("w")) {
      newX = x - NUDGE_PERCENTAGE;
    }

    if (direction.includes("n")) {
      newY = y - NUDGE_PERCENTAGE;
    } else if (direction.includes("s")) {
      newY = y + NUDGE_PERCENTAGE;
    }

    updateMoveByKeyboard(newX, newY);

    if (!pressedKeys.includes(key)) {
      dispatch({ key, type: MoveActionTypes.StartMoveByKeyboard });
    }
  };

  const finishMoveOnKeyUp = ({
    key
  }: React.KeyboardEvent<HTMLDivElement>): void => {
    if (!isArrowKey(key)) {
      return;
    }

    dispatch({ key, type: MoveActionTypes.FinishMoveByKeyboard });
  };

  return [
    startMoveByKeyboard,
    updateMoveByMouse,
    finishMoveByKeyboard,
    startMoveOnKeyDown,
    finishMoveOnKeyUp
  ];
};
