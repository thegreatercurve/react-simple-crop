import * as React from "react";
import { CropValue } from "../types";

export interface PreviewProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fileType?: string;
  value: CropValue;
}

export const Preview = React.forwardRef<HTMLImageElement, PreviewProps>(
  (
    { value: { height, width, x, y }, fileType = "image/jpeg", ...rest },
    ref
  ): React.ReactElement | null => {
    let imageRef = ref as React.RefObject<HTMLImageElement>;

    const [image, setImage] = React.useState("");

    const canvas = document.createElement("canvas");

    React.useEffect((): void => {
      if (!imageRef || !imageRef.current || !canvas) {
        return;
      }

      if (width < 1 || height < 1) {
        return;
      }

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      const { current } = imageRef;

      const xPx = (x / 100) * current.width;
      const yPx = (y / 100) * current.height;
      const widthPx = (width / 100) * current.width;
      const heightPx = (height / 100) * current.height;

      canvas.width = widthPx;
      canvas.height = heightPx;

      const zoomX = current.naturalWidth / current.width;
      const zoomY = current.naturalHeight / current.height;

      context.drawImage(
        imageRef.current,
        xPx * zoomX,
        yPx * zoomY,
        widthPx * zoomX,
        heightPx * zoomY,
        0,
        0,
        widthPx,
        heightPx
      );

      setImage(canvas.toDataURL(fileType));
    }, [canvas, fileType, height, ref, setImage, width, x, y]);

    return image ? <img src={image} {...rest} /> : null;
  }
);

Preview.displayName = "Preview";
