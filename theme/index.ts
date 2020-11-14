import { configureFonts, DefaultTheme } from "react-native-paper";
import fonts from "./fonts";
import colors from "./colors";

const theme = {
  ...DefaultTheme,
  fonts: configureFonts(fonts),
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
};

export default theme;
