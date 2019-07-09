import { Directions } from ".";
import { ArrowKeys } from "./common";

export enum DrawActionTypes {
  FinishDraw = "FinishDraw",
  StartDraw = "StartDraw"
}

export type DrawAction =
  | {
      type: DrawActionTypes.StartDraw;
      x: number;
      y: number;
    }
  | {
      type: DrawActionTypes.FinishDraw;
    };

export enum MoveActionTypes {
  StartMoveByMouse = "StartMoveByMouse",
  FinishMoveByMouse = "FinishMoveByMouse",
  StartMoveByKeyboard = "StartMoveByKeyboard",
  FinishMoveByKeyboard = "FinishMoveByKeyboard"
}

export type MoveAction =
  | {
      type: MoveActionTypes.StartMoveByMouse;
      x: number;
      y: number;
    }
  | { type: MoveActionTypes.FinishMoveByMouse }
  | { key: ArrowKeys; type: MoveActionTypes.StartMoveByKeyboard }
  | { key: ArrowKeys; type: MoveActionTypes.FinishMoveByKeyboard };

export enum ResizeActionTypes {
  FinishResize = "FinishResize",
  StartResize = "StartResize"
}

export type ResizeAction =
  | {
      direction: Directions;
      x: number;
      y: number;
      type: ResizeActionTypes.StartResize;
    }
  | {
      type: ResizeActionTypes.FinishResize;
    };

export type AnyAction = DrawAction | ResizeAction | MoveAction;
