import { configure } from "@storybook/react";
import { GlobalStylesDecorator } from "./decorators";

configure(require.context("../stories", true, /\.stories\.ts?x$/), module);

addDecorator(GlobalStylesDecorator);
