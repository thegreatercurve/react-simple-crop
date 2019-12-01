import * as React from "react";
import {
  useDrawCrop,
  useFireCallbacks,
  useMoveCrop,
  useResizeCrop
} from "../hooks";
import { INITIAL_STATE, mainReducer } from "../reducers";
import { AspectRatio, CropValue, Directions, Status } from "../types";
import { arePassiveListenersSupported, getCropStyle } from "../utils";

const DIRECTIONS = [
  Directions.North,
  Directions.NorthEast,
  Directions.East,
  Directions.SouthEast,
  Directions.South,
  Directions.SouthWest,
  Directions.West,
  Directions.NorthWest
];

export interface CropProps {
  alt?: string;
  aspectRatio?: AspectRatio;
  className?: string;
  crossOrigin?: "anonymous" | "use-credentials";
  maxHeight?: number;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
  src?: string;
  value: CropValue;
  onChange: (crop: CropValue) => void;
  onComplete?: () => void;
  onStart?: () => void;
}

export const Crop = React.forwardRef<HTMLImageElement, CropProps>(
  (
    {
      alt = "",
      aspectRatio,
      className,
      crossOrigin = "anonymous",
      maxHeight,
      maxWidth,
      minHeight,
      minWidth,
      onChange,
      onComplete,
      onStart,
      src = "",
      value
    },
    imageRef
  ): React.ReactElement => {
    const innerContainerRef = React.useRef<HTMLImageElement>(null);

    const [state, dispatch] = React.useReducer(mainReducer, INITIAL_STATE);

    const { status } = state;

    const { height, width } = value;

    const [startDraw, updateDraw, finishDraw] = useDrawCrop(
      dispatch,
      onChange,
      state,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      aspectRatio
    );
    const [
      startMoveByKeyboard,
      updateMoveByMouse,
      finishMoveByKeyboard,
      startMoveOnKeyDown,
      finishMoveOnKeyUp
    ] = useMoveCrop(dispatch, onChange, value, state);
    const [startResize, updateResize, finishResize] = useResizeCrop(
      dispatch,
      onChange,
      value,
      state,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      aspectRatio
    );

    useFireCallbacks({ onComplete, onStart }, status, innerContainerRef);

    const customClassName = `ReactSimpleCrop${
      className ? ` ${className}` : ""
    }`;

    const showCrop = width > 0 || height > 0;

    const handleContainerMouseMove = (
      event: React.MouseEvent | React.TouchEvent | TouchEvent
    ): void => {
      event.preventDefault();

      if (!innerContainerRef.current) {
        return;
      }

      if (status === Status.Drawing) {
        updateDraw(event, innerContainerRef.current);
      } else if (status === Status.MovingByMouse) {
        updateMoveByMouse(event, innerContainerRef.current);
      } else if (status === Status.Resizing) {
        updateResize(event, innerContainerRef.current);
      }
    };

    const handleContainerMouseUp = (): void => {
      if (status === Status.Drawing) {
        finishDraw();
      } else if (status === Status.MovingByMouse) {
        finishMoveByKeyboard();
      } else if (status === Status.Resizing) {
        finishResize();
      }
    };

    const handleCropKeyUp = (
      event: React.KeyboardEvent<HTMLDivElement>
    ): void => {
      finishMoveOnKeyUp(event);
    };

    const handleCropKeyDown = (
      event: React.KeyboardEvent<HTMLDivElement>
    ): void => {
      // Prevent scroll on key press.
      event.preventDefault();

      startMoveOnKeyDown(event);
    };

    const handleImageMouseDown = (
      event: React.MouseEvent | React.TouchEvent
    ): void => {
      if (!innerContainerRef.current) {
        return;
      }

      startDraw(event, innerContainerRef.current);
    };

    const handleCropMouseDown = (
      event: React.MouseEvent | React.TouchEvent
    ): void => {
      if (!innerContainerRef.current) {
        return;
      }

      startMoveByKeyboard(event, innerContainerRef.current);
    };

    React.useEffect((): (() => void) => {
      const supportsPassive = arePassiveListenersSupported();

      const options = supportsPassive ? { passive: false } : false;

      if (innerContainerRef.current) {
        innerContainerRef.current.addEventListener(
          "touchmove",
          handleContainerMouseMove,
          options
        );
      }

      return (): void => {
        if (innerContainerRef.current) {
          innerContainerRef.current.removeEventListener(
            "touchmove",
            handleContainerMouseMove
          );
        }
      };
    }, []);

    return (
      <div
        className={customClassName}
        data-testid="container"
        onMouseMove={handleContainerMouseMove}
        onMouseUp={handleContainerMouseUp}
        onTouchEnd={handleContainerMouseUp}
        onTouchMove={handleContainerMouseMove}
      >
        <div
          className="ReactSimpleCrop__inner-container"
          data-testid="inner-container"
          ref={innerContainerRef}
        >
          {showCrop ? (
            <div
              className="ReactSimpleCrop__crop"
              data-testid="crop"
              onKeyDown={handleCropKeyDown}
              onKeyUp={handleCropKeyUp}
              onMouseDown={handleCropMouseDown}
              onTouchStart={handleCropMouseDown}
              style={getCropStyle(value)}
              tabIndex={1}
            >
              {DIRECTIONS.map((direction, i): React.ReactElement | null =>
                !aspectRatio || i % 2 !== 0 ? (
                  <div
                    className={`ReactSimpleCrop__handle ReactSimpleCrop__handle--${direction}`}
                    data-testid={`handle-${direction}`}
                    id={direction}
                    key={direction}
                    onMouseDown={startResize}
                    onTouchStart={startResize}
                  />
                ) : null
              )}
            </div>
          ) : null}
          <img
            alt={alt}
            className="ReactSimpleCrop__image"
            crossOrigin={crossOrigin}
            data-testid="image"
            onMouseDown={handleImageMouseDown}
            onTouchStart={handleImageMouseDown}
            ref={imageRef}
            src={src}
          />
        </div>
      </div>
    );
  }
);

Crop.displayName = "Crop";
