import * as React from "react";
import { Crop, CropValue, Preview } from "../src";
import {
  DEFAULT_INITIAL_STATE,
  LANDSCAPE_IMAGE,
  PORTRAIT_IMAGE
} from "./constants";

import "../src/style.scss";

export default {
  title: "01 - Basic"
};

export const CropOnly = (): React.ReactNode => {
  const [value, setValue] = React.useState<CropValue>(DEFAULT_INITIAL_STATE);

  const handleChange = (crop: CropValue): void => {
    setValue({ ...value, ...crop });
  };

  return <Crop onChange={handleChange} src={LANDSCAPE_IMAGE} value={value} />;
};

CropOnly.story = {
  name: "Crop only"
};

export const CropAndPreview = (): React.ReactNode => {
  const imageRef = React.createRef<HTMLImageElement>();

  const [value, setValue] = React.useState<CropValue>(DEFAULT_INITIAL_STATE);

  const handleChange = (crop: CropValue): void => {
    setValue({ ...value, ...crop });
  };

  return (
    <>
      <Crop
        onChange={handleChange}
        ref={imageRef}
        src={PORTRAIT_IMAGE}
        value={value}
      />
      <Preview ref={imageRef} value={value} />
    </>
  );
};

CropAndPreview.story = {
  name: "Crop and Preview"
};
