import { Card, CardContent, Grid, Typography } from "@mui/material";
import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import CircularLoading from "../../../../components/Loading/Loading"
//import { ReactComponent as LogoPerfil } from "../../../vendor/IconePerfil.svg";
import { decryptCookieValue } from '../../../../utils/jwt'
import { parseCookies, setCookie } from "nookies";
import { styled } from "@mui/system";
import React from "react";

const GET_PERFIL = gql`
  query getperfil($tipoUsuario: String!, $codUser: Int!) {
    getperfil(tipoUsuario: $tipoUsuario, codUser: $codUser) {
      username
      email
      nomeCompleto
      dataNascimento
      tipoSanguineo
      sexo
      endereco
      telefone
      dataUltimaDoacao
      cpf
      nomeHemocentro
      cpnj
    }
  }
`;
 
const CustomCard = styled(Card)(({ theme }) => ({
  borderColor: theme.palette.cardConfig.main,
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
}));

const ProfileImageContainer = styled('div')({
  display: 'flex',
  backgroundColor:"#26426F",
  justifyContent: 'center',
  width: 150,
  height: 140,
  marginTop: 15,
  marginBottom: 5,
  marginLeft: 10,
  borderRadius: 5,
});

const Perfil = () => {

  const codUser = decryptCookieValue();
  const setTipoUserCookie = (tipoUser: string) => {
    setCookie(null, 'tipoUser', tipoUser, {
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: '/', // Disponível em toda a aplicação
    });
  };
  setTipoUserCookie('doador');
  const cookies = parseCookies();
  const tipoUsuario = cookies['tipoUser'];

  const [CarregarPerfil, { loading, error, data, refetch }] = useLazyQuery(GET_PERFIL);

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [nomeCompleto, setNomeCompleto] = useState("")
    const [dataNascimento, setdataNascimento] = useState("")
    const [tipoSanguineo, settipoSanguineo] = useState("")
    const [sexo, setSexo] = useState("")
    const [endereco, setendereco] = useState("")
    const [telefone, settelefone] = useState("")
    const [dataUltimaDoacao, setdataUltimaDoacao] = useState("")
    const [cpf, setcpf] = useState("")
    const [nomeHemocentro, setnomeHemocentro] = useState("")
    const [cnpj, setcnpj] = useState("")

useEffect(() => {
  if(data){
    console.log(data)
    const perfil = data.getperfil;
    setUsername(perfil?.username || "Indisponível");
    setEmail(perfil?.email || "Indisponível");
    setNomeCompleto(perfil?.nomeCompleto || "Indisponível");
    setdataNascimento(perfil?.dataNascimento || "Indisponível");
    settipoSanguineo(perfil?.tipoSanguineo || "Indisponível");
    setSexo(perfil?.sexo || "Indisponível");
    setendereco(perfil?.endereco || "Indisponível");
    settelefone(perfil?.telefone || "Indisponível");
    setdataUltimaDoacao(perfil?.dataUltimaDoacao || "Indisponível");
    setcpf(perfil?.cpf || "Indisponível");
    setnomeHemocentro(perfil?.nomeHemocentro || "Indisponível");
    setcnpj(perfil?.cpnj || "Indisponível");
  }
}, [data])

useEffect(() => {
    if (codUser != null && tipoUsuario) {
      CarregarPerfil({
        variables: {
          codUser: codUser,
          tipoUsuario: tipoUsuario,
        },
      }).catch((error) => {
        console.log(JSON.stringify(error, null, 2));
      });
    }
  }, [codUser, tipoUsuario]);

  const formatDate = (isoDateString: any) => {
    if (!isoDateString) return ''; // Retorna uma string vazia se a data não for fornecida
  
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é zero-based
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${day}-${month}-${year}`;
  };

  function formatPhoneNumber(value: string): string {
    if (!value) return '';
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  }

  function formatCPF(value: string): string {
    if (!value) return '';
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return value;
  }

  function formatCNPJ(value: string): string {
    if (!value) return '';
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Match the cleaned input to the CNPJ format
    const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
    }
    return value;
  }
  
  

  return (
  <Grid container justifyContent="center" spacing={3}>
    <Grid item xs={12} textAlign="center">
      <Typography fontSize={32} variant="h4">Perfil: {tipoUsuario}</Typography>
    </Grid>
    <Grid item xs={8}>
      <CustomCard>
        <CardContent>
          {data && !loading ? (
            <>
              <Typography ml={3} variant="h6" gutterBottom>Credenciais:</Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Grid container spacing={5} mt={0.1}>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">Usuário</Typography>
                      <Typography style={{padding: '6px',borderRadius: 4, fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1"}} variant="body1">{username || "indisponivel"}</Typography>
                    </Grid>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">Email</Typography>
                      <Typography style={{padding: '6px',borderRadius: 4, fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1" }} variant="body1">{email|| "indisponivel"}</Typography>
                    </Grid>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">Tipo do Usuário</Typography>
                      <Typography style={{ padding: '6px',borderRadius: 4,fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1" }} variant="body1">{tipoUsuario|| "indisponivel"}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Typography ml={3} mt={5} variant="h6" gutterBottom>Dados Pessoais:</Typography>
              {tipoUsuario == "doador" &&(
                <>
                <Grid container spacing={2}>
                <Grid item>
                  <Grid container spacing={5} mt={0.1}>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">Nome Completo</Typography>
                      <Typography style={{padding: '6px',borderRadius: 4, fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1"}} variant="body1">{nomeCompleto || "indisponivel"}</Typography>
                    </Grid>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">Data de Nascimento</Typography>
                      <Typography style={{padding: '6px',borderRadius: 4, fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1" }} variant="body1">{formatDate(dataNascimento)|| "indisponivel"}</Typography>
                    </Grid>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">Tipo sanguíneo</Typography>
                      <Typography style={{ padding: '6px',borderRadius: 4,fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1" }} variant="body1">{tipoSanguineo|| "indisponivel"}</Typography>
                    </Grid>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">Sexo</Typography>
                      <Typography style={{ padding: '6px',borderRadius: 4,fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1" }} variant="body1">{sexo|| "indisponivel"}</Typography>
                    </Grid>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">Endereço</Typography>
                      <Typography style={{ padding: '6px',borderRadius: 4,fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1" }} variant="body1">{endereco|| "indisponivel"}</Typography>
                    </Grid>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">Telefone</Typography>
                      <Typography style={{ padding: '6px',borderRadius: 4,fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1" }} variant="body1">{formatPhoneNumber(telefone)|| "indisponivel"}</Typography>
                    </Grid>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">Data da última doação</Typography>
                      <Typography style={{ padding: '6px',borderRadius: 4,fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1" }} variant="body1">{formatDate(dataUltimaDoacao)|| "indisponivel"}</Typography>
                    </Grid>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">CPF</Typography>
                      <Typography style={{ padding: '6px',borderRadius: 4,fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1" }} variant="body1">{formatCPF(cpf) || "indisponivel"}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
                </>
              )}
              {tipoUsuario == 'hemocentro' && (
                <>
                <Grid container spacing={2}>
                <Grid item>
                  <Grid container spacing={5} mt={0.1}>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">Nome do Hemocentro</Typography>
                      <Typography style={{padding: '6px',borderRadius: 4, fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1"}} variant="body1">{nomeHemocentro || "indisponivel"}</Typography>
                    </Grid>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">Endereço</Typography>
                      <Typography style={{padding: '6px',borderRadius: 4, fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1" }} variant="body1">{endereco|| "indisponivel"}</Typography>
                    </Grid>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">Telefone</Typography>
                      <Typography style={{ padding: '6px',borderRadius: 4,fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1" }} variant="body1">{formatPhoneNumber(telefone) || "indisponivel"}</Typography>
                    </Grid>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">E-mail</Typography>
                      <Typography style={{ padding: '6px',borderRadius: 4,fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1" }} variant="body1">{email|| "indisponivel"}</Typography>
                    </Grid>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">CNPJ</Typography>
                      <Typography style={{ padding: '6px',borderRadius: 4,fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1" }} variant="body1">{formatCNPJ(cnpj) || "indisponivel"}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
                </>
              )}
            </>
          ) : (
            <Grid container justifyContent="center" alignItems="center" style={{ height: "37.8vh" }}>
              <CircularLoading/>
            </Grid>
          )}
        </CardContent>
      </CustomCard>
    </Grid>
  </Grid>
  );
};

export default Perfil;
