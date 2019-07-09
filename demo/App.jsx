import React from "react";
import { Crop, Preview } from "react-simple-crop";
import "./App.scss";

export const App = () => {
  const imageRef = React.createRef();

  const [value, setValue] = React.useState({
    height: 0,
    width: 0,
    x: 0,
    y: 0
  });

  const [filePreview, setFilePreview] = React.useState("");

  const handFileUpload = event => {
    if (!event.currentTarget.files) {
      return;
    }

    const reader = new FileReader();

    const file = event.currentTarget.files[0];

    reader.addEventListener("load", () => setFilePreview(reader.result));

    reader.readAsDataURL(file);
  };

  const handleChange = crop => setValue({ ...value, ...crop });

  return (
    <div className="app">
      <input onChange={handFileUpload} type="file" />
      <Crop
        className="crop"
        onChange={handleChange}
        ref={imageRef}
        src={filePreview}
        value={value}
      />
      {filePreview && <Preview ref={imageRef} value={value} />}
    </div>
  );
};
