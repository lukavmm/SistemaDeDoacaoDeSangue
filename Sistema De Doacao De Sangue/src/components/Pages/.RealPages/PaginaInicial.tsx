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

const GET_USUARIOS = gql`
  query {
    usuarios {
      codusuario
      usuario
    }
  }
`;



function Analytics() {

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const codUser = decryptCookieValue();

  const { loading, error, data } = useQuery(GET_USUARIOS);

  // const { t } = useTranslation();
  const { theme } = useTheme();

  const navigate = useNavigate();

  
  const getUserName = (userId: any) => {
    const user = usuarios.find(user => user.codusuario === userId);
    return user ? user.usuario : '--'; // Retorna '--' se o usuário não for encontrado
  };

  const cookies = parseCookies();
  const codUserEncrypt = cookies['codUser']
  function generateRedirectUrl(baseUrl: string, encryptedCookies: Record<string, any>, tutorialCookies: Record<string, boolean>, permCookie: string,codUser: string) {
    // Criptografar os cookies que precisam ser criptografados
    const encryptedData = {
      ...Object.fromEntries(
        Object.entries(encryptedCookies).map(([key, value]) => [key, encryptCookieValue(value)])
      ),
      ...Object.fromEntries(
        Object.entries(tutorialCookies).map(([key, value]) => [key, value.toString()]) // Converter booleanos para strings
      ),
      permCookie: encodeURIComponent(permCookie), // Adicionar permCookie sem criptografar
      codUser: encodeURIComponent(codUserEncrypt),
    };
  
    // Gerar a query string com os cookies criptografados e não criptografados
    const queryString = new URLSearchParams(encryptedData).toString();
  
    // Retornar a URL completa
    return `${baseUrl}?${queryString}`;
  }
  
  // Exemplo de uso
  const encryptedCookies = {
    url: cookies['url'],
    'crm-token': cookies['crm-token'],
  };

  const permCookie = cookies['permCookie'];

  const tutorialCookies = {
    tutorialCampanhas: cookies['tutorialCampanhas'] === 'true',
    tutorialContaemail: cookies['tutorialContaemail'] === 'true',
    tutorialContawpp: cookies['tutorialContawpp'] === 'true',
    tutorialHome: cookies['tutorialHome'] === 'true',
    tutorialTemplateemail: cookies['tutorialTemplateemail'] === 'true',
  };

  useEffect(() => {
    if (data) {
      setUsuarios(data.usuarios);
    }
  }, [data]);

  useEffect(() => {
    const checkCookieExpiration = () => {
      const resp =  getCookie()
      if (resp == 1) {  
      } else {
        navigate('/auth/sign-in');
      }
    };
    checkCookieExpiration();
    const interval = setInterval(checkCookieExpiration, 30001);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const resp =  getCookie();
    if (resp == 1) {
    }else if(resp == 0 ){
      
      navigate('/auth/sign-in');
    }
  }, [])

  useEffect(() => {
    const resp = getCookie();
    if (resp == 1) {
    } else if (resp == 0) {
      navigate("/auth/sign-in");
    }
  }, [navigate]);
  

  return (
    <React.Fragment>
      <Helmet title="Página Inicial" />
        {/* {update && permList?.some(item => {if(item == "23"){return true}}) && */}
        <>
        <Grid container justifyContent="center" spacing={6}>
          <Box textAlign="center">
            <Typography gutterBottom style={{ fontSize: 22, lineHeight: "1.5" }}>
                Olá, {getUserName(codUser)}
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
                <Link to="https://thankful-pond-0bdab4a0f.3.azurestaticapps.net/nfe" style={{ textDecoration: "none"}}>
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
                <Link to={generateRedirectUrl("https://orange-ocean-01c96d00f.4.azurestaticapps.net/",encryptedCookies,tutorialCookies,permCookie,codUserEncrypt)} style={{ textDecoration: "none"}}>
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


