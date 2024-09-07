import {
  Card,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { decryptCookieValue, encryptCookieValue, getCookie } from "../../../utils/jwt";
import { gql, useMutation, useQuery } from "@apollo/client";
import { parseCookies, setCookie } from "nookies";

import { Box } from "@mui/system";
import Footer from "../../Home/Footer";
import { Helmet } from "react-helmet-async";
import useTheme from "../../hooks/useTheme";
import ComoDoar from "../../Home/ComoDoar";
import Parceiros from "../../Home/Parceiros";
import NavbarUserDropdown from "../../navbar/NavbarUserDropdown";

function Analytics() {

const codUser = decryptCookieValue();
  
  return (
    <React.Fragment>
      <Helmet title="Página Inicial" />
      <>  
          <Parceiros />
          <ComoDoar />
          <Footer />
      </>
      </React.Fragment>
  );
}

export default Analytics;


