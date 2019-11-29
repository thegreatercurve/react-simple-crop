# React Simple Crop

A simple, easy-to-use and dependecy-free library for cropping images in React.

## Features

- Responsive and touch enabled
- Crop supports mimimum and maximum sizes
- Crop can conform to an aspect ratio
- Crop can be refined with arrow keys
- Dependency-free (only 8kb minified)
- Compatible with >IE11
- Typescript support
- Accessible

## Installation

```
npm i react-simple-crop --save
```

## Demo

A simple example can be found [here on CodeSandbox](https://codesandbox.io/s/cocky-lake-9jy0d).

There is also a full suite of Storybook stories, which can be run locally:

```
npm run storybook
```

## Basic Usage

```jsx
import React from "react";
import { Crop, Preview } from "react-simple-crop";

export const App = () => {
  const imageRef = React.createRef();

  const [value, setValue] = React.useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  return (
    <>
      <Crop
        onChange={crop => setValue({ ...value, ...crop })}
        ref={imageRef}
        src={"..."}
        value={value}
      />
      {filePreview && <Preview ref={imageRef} value={value} />}
    </>
  );
};
```

---

## Components

### `<Crop />`

Displays an image with a crop area overlay.

This crop area can be drawn, moved or resized, using mouse click, touch, or keyboard arrow events.

The `onChange` callback will fire any time the coordinates or size of the crop area change.

You must then update the local parent component state with the new `value` to see these changes reflected in the DOM.

#### How to use

```jsx
import { Crop } from "react-simple-crop";

/* ... */

const [value, setValue] = React.useState({
  x: 0,
  y: 0,
  width: 0,
  height: 0
});

<Crop
  onChange={crop => setValue({ ...value, ...crop })}
  src="..."
  value={value}
/>;
```

#### Props

| Prop            | Required | Type                                                                 | Description                                                                                                                                                |
| --------------- | :------: | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **onChange**    | &#10003; | `({ x: number; y: number; width: number; height: number; }) => void` | Callback which is fired any time the coordinates or size of the crop area change.                                                                          |
| **src**         | &#10003; | `string`                                                             | Source attribute which is passed to the image element.                                                                                                     |
| **value**       | &#10003; | `{ x: number; y: number; width: number; height: number; }`           | Percentage coordinates and size of the crop area. You can also use this prop to initialize the size of the crop on the first render.                       |
| **aspectRatio** |          | `[number, number]`                                                   | Restricts the ability to draw or resize a crop area to specific dimensions.                                                                                |
| **alt**         |          | `string`                                                             | Alt attribute which is passed to the image element.                                                                                                        |
| **className**   |          | `string`                                                             | Class name attribute passed to the containing element of the image and crop area.                                                                          |
| **crossOrigin** |          | `"anonymous" | "use-credentials"`                               | Cross origin attribute which is passed to the image element.                                                                                               |
| **maxHeight**   |          | `number`                                                             | Restricts the height of the crop area to a maximum percentage of the image element.                                                                        |
| **maxWidth**    |          | `number`                                                             | Restricts the width of the crop area to a maximum percentage of the image element.                                                                         |
| **minHeight**   |          | `number`                                                             | Restricts the height of the crop area to a minimum percentage of the image element.                                                                        |
| **minWidth**    |          | `number`                                                             | Restricts the width of the crop area to a minimum percentage of the image element.                                                                         |
| **onComplete**  |          | `() => void`                                                         | Callback which is fired any time the crop area finishes being drawn, moved by mouse or keyboard, or resized.                                               |
| **onStart**     |          | `() => void`                                                         | Callback which is fired any time the crop area starts being drawn, moved by mouse or keyboard, or resized.                                                 |
| **ref**         |          | `{ current: HTMLImageElement }`                                      | React ref object which is passed to the image element, and also needs to be passed to the `<Preview />` component. This is used to draw the preview image. |

### `<Preview />`

Displays a new preview image of the currently selected crop area. This image can then be saved as its own file.

#### How to use

```jsx
import { Crop, Preview } from "react-simple-crop";

/* ... */

const imageRef = React.createRef();

const [value, setValue] = React.useState({
  x: 0,
  y: 0,
  width: 0,
  height: 0
});

<Crop
  onChange={crop => setValue({ ...value, ...crop })}
  ref={imageRef}
  src="..."
  value={value}
/>
<Preview
  ref={imageRef}
  value={value}
/>
```

#### Props

| Prop         | Required | Type                                                       | Description                                                                                         |
| ------------ | :------: | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **ref**      | &#10003; | `{ current: HTMLImageElement }`                            | React ref object of the `<Crop />` component image element. This is used to draw the preview image. |
| **value**    | &#10003; | `{ x: number; y: number; width: number; height: number; }` | Percentage coordinates and size of the crop area.                                                   |
| **fileType** |          | `string`                                                   | File type of the preview image (i.e. `image/jpeg`, `image/png`, or `image/gif`).                    |

Also accepts any HTML image attributes as props (i.e. `alt`, `crossOrigin` or `style`), apart from `src`, which is used internally by this component.
