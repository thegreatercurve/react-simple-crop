import * as React from "react";
import { Crop, CropValue, Preview } from "../src";
import { DEFAULT_INITIAL_STATE } from "./constants";

import "../src/style.scss";

export default {
  title: "03 - Examples"
};

export const FileInput = (): React.ReactNode => {
  const imageRef = React.createRef<HTMLImageElement>();

  const [value, setValue] = React.useState<CropValue>(DEFAULT_INITIAL_STATE);

  const [filePreview, setFilePreview] = React.useState<string>("");

  const handFileUpload = (
    event: React.SyntheticEvent<HTMLInputElement>
  ): void => {
    if (!event.currentTarget.files) {
      return;
    }

    const reader = new FileReader();

    const file = event.currentTarget.files[0];

    reader.addEventListener("load", (): void => {
      if (reader.result) {
        setFilePreview(reader.result.toString());
      }
    });

    reader.readAsDataURL(file);
  };

  const handleChange = (crop: CropValue): void => {
    setValue({ ...value, ...crop });
  };

  return (
    <div>
      <input onChange={handFileUpload} type="file" />
      <Crop
        onChange={handleChange}
        ref={imageRef}
        src={filePreview}
        value={value}
      />
      {filePreview && <Preview ref={imageRef} value={value} />}
    </div>
  );
};

FileInput.story = {
  name: "File input"
};
