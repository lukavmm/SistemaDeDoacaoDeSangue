import {
  Box,
  CssBaseline,
  Paper as MuiPaper,
} from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";

import GlobalStyle from "../GlobalStyle";
import Navbar from "../../components/navbar/Navbar";
import { spacing } from "@mui/system";
import styled from "@emotion/styled";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

let drawerWidth = 0;

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Drawer = styled.div`
  ${(props) => props.theme.breakpoints.up("md")} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: ${(props) => props.theme.palette.background.default};

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

interface DashboardType {
  children?: React.ReactNode;
}

const Dashboard: React.FC<DashboardType> = ({ children }) => {
  const router = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    drawerWidth = 258;
    setMobileOpen(!mobileOpen);
  };

  // Close mobile menu when navigation occurs
  useEffect(() => {
    setMobileOpen(false);
  }, [router.pathname]);

  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <Drawer>
        <Box sx={{ display: { xs: "block", lg: "none" } }}>
        </Box>
      </Drawer>
      <AppContent>
        <Navbar  onDrawerToggle={handleDrawerToggle} />
        <MainContent p={isLgUp ? 12 : 5}>
          {children}
          <Outlet />
        </MainContent>
      </AppContent>
    </Root>
  );
};

export default Dashboard;
