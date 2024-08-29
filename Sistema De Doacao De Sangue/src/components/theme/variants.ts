import { green, grey } from "@mui/material/colors";

import { THEMES } from "../../constants";
import merge from "deepmerge";

const customBlue = {
  50: "#e9f0fb",
  100: "#c8daf4",
  200: "#a3c1ed",
  300: "#7ea8e5",
  400: "#6395e0",
  500: "#4782da",
  600: "#407ad6",
  700: "#376fd0",
  800: "#2f65cb",
  900: "#2052c2 ",
};

const defaultVariant = {
  name: THEMES.DEFAULT,
  palette: {
    mode: "light",
    primary: {
      main: customBlue[600],
      contrastText: "#FFF",
    },
    secondary: {
      main: customBlue[500],
      contrastText: "#BFBFBF",
    },
    tertiary: {
      main: "#a1a1a1",
      contrastText: "#FFF",
    },
    background: {
      default: "#EEEEEE",
      paper: "#FFFFFF",
    },
    box:  {
      main:'rgb(228, 228, 228)',
      contrastText: "rgba(255, 255, 255, 0.70)",
    },
    cardConfig:  {
      main:'rgb(228, 228, 228)',
      contrastText: "rgba(255, 255, 255, 0.70)",
    },
    button: {
      main: "#26426F",
      contrastText: "#FFF",
    },
    text: {
      main: "#000",
      contrastText: "#000",
    },
    scrollBar: {
      main: "#9E9E9E",
      contrastText: "rgba(255, 255, 255, 0.45)",
    },
  },
  header: {
    color: grey[500],
    background: "#333333",
    search: {
      color: grey[800],
    },
    indicator: {
      background: customBlue[600],
    },
  },
  footer: {
    color: grey[500],
    background: "#333333",
  },
  sidebar: {
    color: grey[200],
    background: "#26426F",
    header: {
      color: grey[200],
      background: "#333333",
      brand: {
        color: customBlue[500],
      },
    },
    footer: {
      color: grey[200],
      background: "#333333",
      online: {
        background: green[500],
      },
    },
    badge: {
      color: "#FFF",
      background: customBlue[500],
    },
  },
};

const darkVariant = merge(defaultVariant, {
  name: THEMES.DARK,
  palette: {
    mode: "dark",
    primary: {
      main: customBlue[600],
      contrastText: "#FFF",
    },
    secondary: {
      main: "#233044",
      contrastText: "#FFF",
    },
    tertiary: {
      main: "#2f415c",
      contrastText: "#FFF",
    },
    background: {
      default: "#1B2635",
      paper: "#233044",
    },
    box:  {
      main:"#26426F",
      contrastText: "#FFF",
    },
    cardConfig:  {
      main:"#233044",
      contrastText: "rgba(255, 255, 255)",
    },
    button: {
      main: customBlue[800],
      contrastText: "#FFF",
    },
    text: {
      main: "rgba(255, 255, 255, 0.95)",
      contrastText: "rgba(255, 255, 255, 0.5)",
    },
    scrollBar: {
      main: "#233044",
      contrastText: "rgba(255, 255, 255, 0.15)",
    },
  },
  header: {
    color: grey[300],
    background: '#233044',
    search: {
      color: grey[200],
    },
  },
  footer: {
    color: grey[300],
    background: '#233044',
  },
  sidebar: {
    color: grey[200],
    background: "#26426F",
    header: {
      color: grey[200],
      background: "#233044",
      brand: {
        color: customBlue[500],
      },
    },
    footer: {
      color: grey[200],
      background: "#233044",
      online: {
        background: green[500],
      },
    },
    badge: {
      color: "#FFF",
      background: customBlue[500],
    },
  },
});

const variants: Array<VariantType> = [
  defaultVariant,
  darkVariant,
];

export default variants;

export type VariantType = {
  name: string;
  palette: {
    primary: MainContrastTextType;
    secondary: MainContrastTextType;
    tertiary: MainContrastTextType;
    box: MainContrastTextType;
    background: BackgroundType; // Atualizado para usar BackgroundType
    button: MainContrastTextType;
    text: MainContrastTextType; // Adicionado para a camada de variante "texto"
    scrollBar: MainContrastTextType;
    cardConfig:MainContrastTextType;
  };
  header: ColorBgType & {
    search: {
      color: string;
    };
    indicator: {
      background: string;
    };
  };
  footer: ColorBgType;
  sidebar: ColorBgType & {
    header: ColorBgType & {
      brand: {
        color: string;
      };
    };
    footer: ColorBgType & {
      online: {
        background: string;
      };
    };
    badge: ColorBgType;
  };
};

type BackgroundType = {
  default: string;
  paper: string;
};
type MainContrastTextType = {
  main: string;
  contrastText: string;
};
type ColorBgType = {
  color: string;
  background: string;
};
