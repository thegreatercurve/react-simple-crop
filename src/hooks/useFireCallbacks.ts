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
  const prevStatusRef = React.useRef<Status | null>(null);

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
      ((status === Status.Drawing && prevStatus === Status.None) ||
        (status === Status.MovingByKeyboard && prevStatus === Status.None) ||
        (status === Status.MovingByMouse && prevStatus === Status.None) ||
        (status === Status.Resizing && prevStatus === Status.None))
    ) {
      onStart();
    }

    if (
      onComplete &&
      ((status === Status.None && prevStatus === Status.Drawing) ||
        (status === Status.None && prevStatus === Status.MovingByKeyboard) ||
        (status === Status.None && prevStatus === Status.MovingByMouse) ||
        (status === Status.None && prevStatus === Status.Resizing))
    ) {
      onComplete();
    }
  }, [imageRef, onComplete, onStart, prevStatus, status]);
};
