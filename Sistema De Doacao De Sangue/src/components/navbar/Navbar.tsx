import {
  Grid,
  InputBase,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { getPermissoesFromCookie, hasPermission } from "../../utils/jwt";
import { useLocation, useNavigate } from "react-router-dom";

import { Home as HomeIcon } from "@mui/icons-material";
import Logo from "../vendor/bloodIcon2.jpg";
import { Menu as MenuIcon } from "@mui/icons-material";
import NavbarUserDropdown from "../navbar/NavbarUserDropdown";
import React from "react";
import styled from "@emotion/styled";
import useTheme from "../hooks/useTheme";
import variants from "../theme/variants";
import { withTheme } from "@emotion/react";

//import { useTranslation } from "react-i18next";



const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.header.background};
  color: ${(props) => props.theme.header.color};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const HomeIcone = styled.img`
  margin-right: ${(props) => props.theme.spacing(6)};
  margin-left: ${(props) => props.theme.spacing(12)};
  color: ${(props) => props.theme.sidebar.header.brand.color};
  fill: ${(props) => props.theme.sidebar.header.brand.color};
  width: 80px;
  height: 45px;
`;

const IconeCampanha = styled.img`
  width: 22px;
  height: 20px;
`;

// const Configuracao = styled(IconeConfiguracao)`
//   color: ${(props) => props.theme.sidebar.header.brand.color};
//   fill: ${(props) => props.theme.sidebar.header.brand.color};
//   width: 80px;
//   height: 45px;
// `;

const IconeAuditoria = styled.img`
  width: 22px;
  height: 20px;
`;

const Search = styled.div`
  border-radius: 2px;
  background-color: ${(props) => props.theme.header.background};
  display: none;
  position: relative;
  width: 100%;



  ${(props) => props.theme.breakpoints.up("md")} {
    display: block;
  }
`;

const SearchIconWrapper = styled.div`
  width: 50px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Input = styled(InputBase)`
  color: inherit;
  width: 100%;

  > input {
    color: white;
    padding-top: ${(props) => props.theme.spacing(2.5)};
    padding-right: ${(props) => props.theme.spacing(2.5)};
    padding-bottom: ${(props) => props.theme.spacing(2.5)};
    padding-left: ${(props) => props.theme.spacing(12)};
    width: 160px;
  }
`;

type NavbarProps = {
  onDrawerToggle: React.MouseEventHandler<HTMLElement>;
};

const Navbar: React.FC<NavbarProps> = ({ onDrawerToggle }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const selectedVariant = variants.find((variant) => variant.name === theme);
  //const { t } = useTranslation();
  const location = useLocation();

  const getIconStyle = (path: string, top: number) => {
    const isActive = path === "/"
      ? location.pathname === path
      : location.pathname === path || location.pathname.startsWith(path);

    return {
      backgroundColor: isActive ? "#407AD6" : "#26426F",
      borderRadius: "5px",
      position: "fixed",
      left: "6px",
      top: `${top}px`,
      zIndex: 1000,
      padding: "8px 8px",
    };
  };

  return (
    <React.Fragment>
      <AppBar
        position="sticky"
        elevation={0}
        style={{ backgroundColor: selectedVariant?.header.background }}
      >
        <Toolbar>
          <Grid container alignItems="center">
            <Grid>
              <HomeIcone
                src={Logo}
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
              />
            </Grid>
            <Grid item xs />
            <Grid item>
              <NavbarUserDropdown />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

    </React.Fragment>
  );
};

export default withTheme(Navbar);
