import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import styledEmotion from "@emotion/styled";
import { useState } from "react";
import NavbarUserDropdown from "../navbar/NavbarUserDropdown";
import Logo from "../vendor/LogoHeader.svg";
import { Grid, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { GiHospitalCross } from "react-icons/gi";
import { MdBloodtype } from "react-icons/md";
import { GrScheduleNew } from "react-icons/gr";
import { CalendarToday } from "@mui/icons-material";
import { MdOutlineManageAccounts } from "react-icons/md";
import { CgLogOff } from "react-icons/cg";
import useAuth from "../hooks/useAuth";

let drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const HomeIcone = styledEmotion.img`
  margin-right: ${(props: any) => props.theme.spacing(6)};
  margin-left: ${(props: any) => props.theme.spacing(3)};
  color: ${(props: any) => props.theme.sidebar.header.brand.color};
  fill: ${(props: any) => props.theme.sidebar.header.brand.color};
  width: 60%;
  height: 60%;
`;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    drawerWidth = 258;
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/sign-in");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Grid>
            <HomeIcone
              src={Logo}
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            />
          </Grid>
          <Box sx={{ flexGrow: 1 }} />{" "}
          {/* Esse Box serve para preencher o espaço entre os itens */}
          <NavbarUserDropdown />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
        {[
            { text: "Doações", icon: <GiHospitalCross size={24} />, route: "/hemocentros", state: { tipoPesquisa: "hemocentros" } },
            { text: "Doadores", icon: <MdBloodtype size={24} />, route: "/hemocentros", state: { tipoPesquisa: "doadores" } },
            { text: "Agendamentos", icon: <CalendarToday />, route: "/agendamentos" },
          ].map((text, index) => (
              <Tooltip title={text.text} placement="right" arrow disableHoverListener={open}>
              <ListItem key={text.text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => {
                    if(text.state){
                      navigate(text.route, {state: text.state});
                    } else {
                      navigate(text.route)
                    }
                  }}
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                    },
                    open
                      ? {
                          justifyContent: "initial",
                        }
                      : {
                          justifyContent: "center",
                        },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: "center",
                      },
                      open
                        ? {
                            mr: 3,
                          }
                        : {
                            mr: "auto",
                          },
                    ]}
                  >
                   {text.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text.text}
                    sx={[
                      open
                        ? {
                            opacity: 1,
                          }
                        : {
                            opacity: 0,
                          },
                    ]}
                  />
                </ListItemButton>
              </ListItem>
              </Tooltip>
            )
          )}
        </List>
        <Divider />
        <List>
        {[
            { text: "Meu Perfil", icon: <MdOutlineManageAccounts size={24}/>, route: "/Perfil" },
            { text: "Sair", icon: <CgLogOff size={24}/>, onclick: handleSignOut },
          ].map((text, index) => (
              <Tooltip title={text.text} placement="right" arrow disableHoverListener={open}>
              <ListItem key={text.text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => {
                    if (text.onclick) {
                      text.onclick(); // Executa a função handleSignOut
                    } else if (text.route) {
                      navigate(text.route); // Navega para a rota especificada
                    }
                  }}
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                    },
                    open
                      ? {
                          justifyContent: "initial",
                        }
                      : {
                          justifyContent: "center",
                        },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: "center",
                      },
                      open
                        ? {
                            mr: 3,
                          }
                        : {
                            mr: "auto",
                          },
                    ]}
                  >
                   {text.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text.text}
                    sx={[
                      open
                        ? {
                            opacity: 1,
                          }
                        : {
                            opacity: 0,
                          },
                    ]}
                  />
                </ListItemButton>
              </ListItem>
              </Tooltip>
            )
          )}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
      </Box>
    </Box>
  );
}
