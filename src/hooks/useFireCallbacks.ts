import * as React from "react";
import { Status } from "../types";

export const useFireCallbacks = (
  {
    onComplete,
    onStart
  }: {
    onComplete?: () => void;
    onStart?: () => void;
  },
  status: Status,
  imageRef: React.RefObject<HTMLImageElement>
): void => {
  const prevStatusRef = React.useRef<Status>(Status.None);

  React.useEffect((): void => {
    prevStatusRef.current = status;
  }, [status]);

  const prevStatus = prevStatusRef.current;

  React.useEffect((): void => {
    if (!imageRef || !imageRef.current) {
      return;
    }

    if (
      onStart &&
      (status === Status.Drawing ||
        status === Status.MovingByKeyboard ||
        status === Status.MovingByMouse ||
        status === Status.Resizing) &&
      prevStatus === Status.None
    ) {
      onStart();
    }

    if (
      onComplete &&
      status === Status.None &&
      (prevStatus === Status.Drawing ||
        prevStatus === Status.MovingByKeyboard ||
        prevStatus === Status.MovingByMouse ||
        prevStatus === Status.Resizing)
    ) {
      onComplete();
    }
  }, [imageRef, onComplete, onStart, prevStatus, status]);
};
