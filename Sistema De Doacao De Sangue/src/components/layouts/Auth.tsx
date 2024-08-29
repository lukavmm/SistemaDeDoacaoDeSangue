import { CssBaseline, Grid } from "@mui/material";
import React, { useState } from "react";

import GlobalStyle from "../GlobalStyle";
import NavbarUserDropdown from "../../components/navbar/NavbarTemasUser";
import { Outlet } from "react-router-dom";
import styled from "@emotion/styled";

// import Navbar from "../components/navbar/Navbar";




//import Settings from "../components/Settings";

let drawerWidth = 0;

const Drawer = styled.div`
  ${(props) => props.theme.breakpoints.up("md")} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`;

const Root = styled.div`
  max-width: "100%";
  margin: auto;
  justify-content: center;
  align-items: center;
  display: flex;
  height: auto;
  min-height: 100%;
`;

interface AuthType {
  children?: React.ReactNode;
}

const Auth: React.FC<AuthType> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [state, setState] = useState({
    isOpen: false,
  });

  const toggleDrawer = (open: boolean) => () => {
    setState({ ...state, isOpen: open });
  };

  return (
    <Root>
      <Grid>
        <NavbarUserDropdown />
      </Grid>
      <CssBaseline />
      <GlobalStyle />
      {children}
      <Outlet />
      {/* <Settings /> */}
    </Root>
  );
};

export default Auth;
