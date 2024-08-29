import { Helmet, HelmetProvider } from "react-helmet-async";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AuthProvider } from "./components/context/AuthContext";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import createEmotionCache from "./utils/createEmotionCache";
import createTheme from "./components/theme";
import routes from "./components/Pages/routes";
import { useRoutes } from "react-router-dom";
import useTheme from "./components/hooks/useTheme";

// import { AuthProvider } from "./context/JWTContext";
// import { AuthProvider } from "./contexts/FirebaseAuthContext";
// import { AuthProvider } from "./contexts/Auth0Context";
// import { AuthProvider } from "./contexts/CognitoContext";

const clientSideEmotionCache = createEmotionCache();

function App({ emotionCache = clientSideEmotionCache }) {
  const content = useRoutes(routes);

  const { theme } = useTheme();

  return (
    <CacheProvider value={emotionCache}>
      <HelmetProvider>
        <Helmet
          titleTemplate="Doação de Sangue"
          defaultTitle="Painel - Doador"
        />
          {/* @ts-ignore */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MuiThemeProvider theme={createTheme(theme)}>
              <AuthProvider>
                {content}
            </AuthProvider>
            </MuiThemeProvider>
          </LocalizationProvider>
      </HelmetProvider>
    </CacheProvider>
  );
}

export default App;
