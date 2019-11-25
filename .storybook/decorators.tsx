import * as React from "react";

import "./style.scss";

export const GlobalStylesDecorator = storyFn => <>{storyFn()}</>;
