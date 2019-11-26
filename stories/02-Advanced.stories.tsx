import { action } from "@storybook/addon-actions";
import * as React from "react";
import { Crop, CropValue, Preview } from "../src";
import {
  DEFAULT_INITIAL_STATE,
  LANDSCAPE_IMAGE,
  PORTRAIT_IMAGE
} from "./constants";

import "../src/style.scss";

export default {
  title: "02 - Advanced"
};

export const Callbacks = (): React.ReactNode => {
  const imageRef = React.createRef<HTMLImageElement>();

  const [value, setValue] = React.useState<CropValue>(DEFAULT_INITIAL_STATE);

  const handleChange = (crop: CropValue): void => {
    action("Change")(crop);

    setValue({ ...value, ...crop });
  };

  return (
    <>
      <p>Open the "actions" panel to see the callbacks firing.</p>
      <Crop
        onChange={handleChange}
        onComplete={action("Complete")}
        onStart={action("Start")}
        ref={imageRef}
        src={LANDSCAPE_IMAGE}
        value={value}
      />
      <Preview ref={imageRef} value={value} />
    </>
  );
};

Callbacks.story = {
  name: "Callbacks"
};

export const InitialState = (): React.ReactNode => {
  const imageRef = React.createRef<HTMLImageElement>();

  const [value, setValue] = React.useState<CropValue>({
    height: 40,
    width: 50,
    x: 10,
    y: 30
  });

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

InitialState.story = {
  name: "Initial state"
};

export const AspectRatio = (): React.ReactNode => {
  const imageRef = React.createRef<HTMLImageElement>();

  const [value, setValue] = React.useState<CropValue>(DEFAULT_INITIAL_STATE);

  const handleChange = (crop: CropValue): void => {
    setValue({ ...value, ...crop });
  };

  return (
    <>
      <Crop
        aspectRatio={[16, 9]}
        onChange={handleChange}
        ref={imageRef}
        src={LANDSCAPE_IMAGE}
        value={value}
      />
      <Preview ref={imageRef} value={value} />
    </>
  );
};

AspectRatio.story = {
  name: "Aspect ratio"
};

export const MinAndMaxWidth = (): React.ReactNode => {
  const imageRef = React.createRef<HTMLImageElement>();

  const [value, setValue] = React.useState<CropValue>(DEFAULT_INITIAL_STATE);

  const handleChange = (crop: CropValue): void => {
    setValue({ ...value, ...crop });
  };

  return (
    <>
      <Crop
        maxWidth={50}
        minWidth={20}
        onChange={handleChange}
        ref={imageRef}
        src={PORTRAIT_IMAGE}
        value={value}
      />
      <Preview ref={imageRef} value={value} />
    </>
  );
};

MinAndMaxWidth.story = {
  name: "Min and max width"
};

export const MinAndMaxHeight = (): React.ReactNode => {
  const imageRef = React.createRef<HTMLImageElement>();

  const [value, setValue] = React.useState<CropValue>(DEFAULT_INITIAL_STATE);

  const handleChange = (crop: CropValue): void => {
    setValue({ ...value, ...crop });
  };

  return (
    <>
      <Crop
        maxHeight={60}
        minHeight={10}
        onChange={handleChange}
        ref={imageRef}
        src={LANDSCAPE_IMAGE}
        value={value}
      />
      <Preview ref={imageRef} value={value} />
    </>
  );
};

MinAndMaxHeight.story = {
  name: "Min and max height"
};
