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
import { BsReceiptCutoff } from "react-icons/bs";
import { Helmet } from "react-helmet-async";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { TbMailBolt } from "react-icons/tb";
import useTheme from "../../hooks/useTheme";




function Analytics() {

const codUser = decryptCookieValue();
  
  return (
    <React.Fragment>
      <Helmet title="Página Inicial" />
        {/* {update && permList?.some(item => {if(item == "23"){return true}}) && */}
        <>
        <Grid container justifyContent="center" spacing={6}>
          <Box textAlign="center">
            <Typography gutterBottom style={{ fontSize: 22, lineHeight: "1.5" }}>
                Olá,
            </Typography>
            <Typography variant="h1" gutterBottom style={{ fontSize: 32, fontWeight: 600, lineHeight: "1" }}>
              Seja Bem Vindo ao Painel Vinty !
            </Typography>
          </Box>
        </Grid>

          {/* <Divider my={6} /> */}
        
          <Grid container spacing={6}>
            <Grid item xs={12}>

              <Grid container spacing={1} gap={10} style={{justifyContent:"center", alignItems:"center"}}>
                
                { <Grid item mt={10}>
                <Link to="" style={{ textDecoration: "none"}}>
                <Card style={{ background: "#26426F",width: 180, height: 180, textAlign: "center", transition: "box-shadow 0.2s ease-in-out" }} onMouseOver={(e) => e.currentTarget.style.boxShadow = "0px 0px 15px 0px #1976f2"} onMouseOut={(e) => e.currentTarget.style.boxShadow = "none"}>
                    <Grid mt={8}>
                      <Typography variant="h4" gutterBottom display="inline" color={"#fff"}>
                      <Grid mt={2} ml={1}>
                        <Grid>
                          {/* ICONE */}
                          <BsReceiptCutoff size={100} color={"#fff"} />
                        </Grid>
                      </Grid>
                      NFE
                      </Typography>
                      </Grid>
                  </Card>
                  </Link>
                  </Grid>
                }
                <Grid item mt={10} >
                <Link to={""} style={{ textDecoration: "none"}}>
                    <Card style={{ background: "#26426F",width: 180, height: 180, textAlign: "center", transition: "box-shadow 0.2s ease-in-out" }} onMouseOver={(e) => e.currentTarget.style.boxShadow = "0px 0px 15px 0px #1976f2"} onMouseOut={(e) => e.currentTarget.style.boxShadow = "none"}>
                      <Grid mt={2} ml={1}>
                        <Grid>
                          {/* ICONE */}
                          <TbMailBolt size={120}  color={"#fff"} />
                        </Grid>
                      </Grid>
                      <Typography variant="h4" gutterBottom display="inline" color={"#fff"}>
                        CRM
                      </Typography>
                    </Card>
                    </Link>
                </Grid>
              </Grid>
          </Grid>
          </Grid>
      </>
      </React.Fragment>
  );
}

export default Analytics;


