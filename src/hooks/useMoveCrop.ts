import * as React from "react";
import { State } from "../reducers";
import { CropValue, MoveAction, MoveActionTypes, Status } from "../types";
import {
  getDirectionDirection,
  getXPercent,
  getYPercent,
  isArrowKey,
  clamp
} from "../utils";

export const useMoveCrop = (
  dispatch: React.Dispatch<MoveAction>,
  onChange: (crop: CropValue, status: Status) => void,
  value: CropValue,
  { pressedKeys, x0, y0 }: State,
  onStart?: (status: Status) => void,
  onComplete?: (status: Status) => void
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

  const startMoveByMouse = (
    event: React.MouseEvent | React.TouchEvent,
    imageRef: HTMLImageElement
  ): void => {
    if (onStart) {
      onStart(Status.MovingByMouse);
    }

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
    onChange(
      {
        ...value,
        x: clamp(getXPercent(event, imageRef) - x0, 0, 100 - width),
        y: clamp(getYPercent(event, imageRef) - y0, 0, 100 - height)
      },
      Status.MovingByMouse
    );
  };

  const updateMoveByKeyboard = (x: number, y: number): void => {
    onChange(
      {
        ...value,
        x: clamp(x, 0, 100 - width),
        y: clamp(y, 0, 100 - height)
      },
      Status.MovingByKeyboard
    );
  };

  const finishMoveByMouse = (): void => {
    if (onComplete) {
      onComplete(Status.MovingByMouse);
    }

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

    if (onStart && !pressedKeys.includes(key)) {
      onStart(Status.MovingByKeyboard);
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

    if (onComplete) {
      onComplete(Status.MovingByKeyboard);
    }

    dispatch({ key, type: MoveActionTypes.FinishMoveByKeyboard });
  };

  return [
    startMoveByMouse,
    updateMoveByMouse,
    finishMoveByMouse,
    startMoveOnKeyDown,
    finishMoveOnKeyUp
  ];
};
