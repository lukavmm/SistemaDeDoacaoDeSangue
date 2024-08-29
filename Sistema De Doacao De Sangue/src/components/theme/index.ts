import { PaletteOptions, createTheme as createMuiTheme } from "@mui/material/styles";

import breakpoints from "./breakpoints";
import components from "./components";
import shadows from "./shadows";
import typography from "./typography";
import variants from "./variants";

const createTheme = (name: string) => {
  let themeConfig = variants.find((variant) => variant.name === name);

  if (!themeConfig) {
    console.warn(new Error(`The theme ${name} is not valid`));
    themeConfig = variants[0];
  }

  const { palette, ...rest } = themeConfig; // Desestruturação da variável themeConfig

  return createMuiTheme(
    {
      spacing: 4,
      breakpoints: breakpoints,
      // @ts-ignore
      components: components,
      typography: typography,
      shadows: shadows,
      palette: palette as PaletteOptions, // Uso de palette como PaletteOptions
    },
    {
      name: themeConfig.name,
      header: themeConfig.header,
      footer: themeConfig.footer,
      sidebar: themeConfig.sidebar,
    }
  );
};

export default createTheme;
