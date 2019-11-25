import {
  AnyAction,
  ArrowKeys,
  Directions,
  DrawActionTypes,
  MoveActionTypes,
  ResizeActionTypes,
  Status
} from "../types";

export interface State {
  direction: Directions | null;
  pressedKeys: ArrowKeys[];
  status: Status;
  x0: number;
  y0: number;
}

export const INITIAL_STATE: State = {
  direction: null,
  pressedKeys: [],
  status: Status.None,
  x0: 0,
  y0: 0
};

export const mainReducer = (
  state = INITIAL_STATE,
  action: AnyAction
): State => {
  switch (action.type) {
    case DrawActionTypes.StartDraw:
      return {
        ...state,
        status: Status.Drawing,
        x0: action.x,
        y0: action.y
      };
    case MoveActionTypes.StartMoveByMouse:
      return {
        ...state,
        status: Status.MovingByMouse,
        x0: action.x,
        y0: action.y
      };
    case MoveActionTypes.StartMoveByKeyboard:
      return {
        ...state,
        pressedKeys: [...state.pressedKeys, action.key],
        status: Status.MovingByKeyboard
      };
    case MoveActionTypes.FinishMoveByKeyboard:
      const pressedKeys: ArrowKeys[] = state.pressedKeys.filter(
        (key: ArrowKeys): boolean => key !== action.key
      );

      return {
        ...state,
        ...(pressedKeys.length < 1 ? { status: Status.None } : {}),
        pressedKeys
      };
    case ResizeActionTypes.StartResize:
      return {
        ...state,
        direction: action.direction,
        status: Status.Resizing,
        x0: action.x,
        y0: action.y
      };
    case DrawActionTypes.FinishDraw:
    case MoveActionTypes.FinishMoveByMouse:
    case ResizeActionTypes.FinishResize:
      return INITIAL_STATE;
    default:
      return state;
  }
};
