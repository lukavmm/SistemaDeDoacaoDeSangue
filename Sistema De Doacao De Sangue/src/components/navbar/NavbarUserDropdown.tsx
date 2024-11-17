import {
  Box,
  Drawer,
  Grid,
  ListItemButton,
  Menu,
  MenuItem,
  IconButton as MuiIconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { Palette as PaletteIcon } from "@mui/icons-material";
import { THEMES } from "../../constants";
import { User } from "react-feather";
import { css } from "@emotion/react";
import { grey } from "@mui/material/colors";
import styled from "@emotion/styled";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import Notificacao from "./Notificacao";

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

//Tema///////////////////////////////////////////////////////////
type DemoButtonType = {
  active?: boolean;
};

const DemoButton = styled.div<DemoButtonType>`
  cursor: pointer;
  background: ${(props) => props.theme.palette.background.paper};
  height: 80px;
  border-radius: 0.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.825rem;
  position: relative;
  border: 1px solid
    ${(props) =>
      !props.active
        ? props.theme.palette.action.selected
        : props.theme.palette.action.active};
`;

type DemoButtonInnerType = {
  selectedTheme: string;
};

const DemoButtonInner = styled.div<DemoButtonInnerType>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px ${(props) => props.theme.palette.action.selected};
  position: relative;

  ${(props) =>
    props.selectedTheme === THEMES.DEFAULT &&
    css`
      background: linear-gradient(-45deg, #23303f 50%, ${grey[100]} 0);
    `}
  ${(props) =>
    props.selectedTheme === THEMES.DARK &&
    css`
      background: #23303f;
    `}
`;
  // ${(props) =>
  //   props.selectedTheme === THEMES.LIGHT &&
  //   css`
  //     background: ${grey[100]};
  //   `}
  // ${(props) =>
  //   props.selectedTheme === THEMES.BLUE &&
  //   css`
  //     background: linear-gradient(-45deg, #4782da 50%, ${grey[100]} 0);
  //   `}
  // ${(props) =>
  //   props.selectedTheme === THEMES.GREEN &&
  //   css`
  //     background: linear-gradient(-45deg, ${green[500]} 50%, ${grey[100]} 0);
  //   `}
  // ${(props) =>
  //   props.selectedTheme === THEMES.INDIGO &&
  //   css`
  //     background: linear-gradient(-45deg, ${indigo[500]} 50%, ${grey[100]} 0);
  //  `}
  //`;


const DemoTitle = styled(Typography)`
  text-align: center;
`;

const Wrapper = styled.div`
  width: 258px;
  overflow-x: hidden;
`;

const Heading = styled(ListItemButton)`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;

  ${(props) => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }
`;

type DemoTypes = {
  title: string;
  themeVariant: string;
};

function Demo({ title, themeVariant }: DemoTypes) {
  const { theme, setTheme } = useTheme();

  return (
    <Grid item xs={6}>
      <DemoButton
        active={themeVariant === theme}
        onClick={() => setTheme(themeVariant)}
      >
        <DemoButtonInner selectedTheme={themeVariant} />
      </DemoButton>
      <DemoTitle variant="subtitle2" gutterBottom>
        {title}
      </DemoTitle>
    </Grid>
  );
}

function Demos() {
  return (
    <Wrapper>
      <Heading>Alterar tema</Heading>

      <Box px={4} my={3}>
        <Grid container spacing={3}>
          <Demo title="Escuro" themeVariant={THEMES.DARK} />
          {/* <Demo title="Light" themeVariant={THEMES.LIGHT} /> */}
          <Demo title="Padrão" themeVariant={THEMES.DEFAULT} />
          {/* <Demo title="Blue" themeVariant={THEMES.BLUE} />
          <Demo title="Green" themeVariant={THEMES.GREEN} />
          <Demo title="Indigo" themeVariant={THEMES.INDIGO} /> */}
        </Grid>
      </Box>
      <Box my={3} mx={4}>
      </Box>
    </Wrapper>
    
  );
}
////////////////////////////////////////////////////////////////////

function NavbarUserDropdown() {
  const [anchorMenu, setAnchorMenu] = React.useState<any>(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const toggleMenu = (event: React.SyntheticEvent) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/sign-in");
  };

  //CONSTANTES PARA TEMA
  const [state, setState] = useState({
    isOpen: false,
  });

  const toggleDrawer = (open: boolean) => () => {
    setState({ ...state, isOpen: open });
  };
  /////////////////////

  return (
    <React.Fragment>
      <Notificacao aria-haspopup="true" />
      <Tooltip title="Temas">
        <IconButton    
          aria-haspopup="true"
          onClick={toggleDrawer(true)}
          color="inherit"
          size="large"
          >
          <PaletteIcon/> 
        </IconButton>
      </Tooltip>

      <Drawer anchor="right" open={state.isOpen} onClose={toggleDrawer(false)}>
        <Demos />
      </Drawer>
    </React.Fragment>
  );
}


export default NavbarUserDropdown;
