import { Box, Card, CardContent, Divider, Grid, IconButton, Typography } from "@mui/material";
import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import CircularLoading from "../../../../components/Loading/Loading"
import { FaUserEdit } from "react-icons/fa";
import { decryptCookieValue } from '../../../../utils/jwt'
import { parseCookies } from "nookies";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { formatCNPJ, formatCPF, formatDate, formatPhoneNumber } from "../../../../utils/functions";

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
      dataAtualizacao
      peso
    }
  }
`;
 
const CustomCard = styled(Card)(({ theme }) => ({
  borderColor: theme.palette.cardConfig.main,
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
}));

const Perfil = () => {

  const codUser = decryptCookieValue();

  const cookies = parseCookies();
  const tipoUsuario = cookies['tipoUser'];

  const navigate = useNavigate()

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
    const [peso, setPeso] = useState()
    const [dataAtualizacao,setdataAtualizacao] = useState("");

    const [elegibilidade, setElegibilidade] = useState<string>('indisponível');

    // Use a função para atualizar a elegibilidade
    useEffect(() => {
      setElegibilidade(canDonate(peso, toDate(dataUltimaDoacao)));
    }, [peso, dataUltimaDoacao]); // Atualiza quando peso ou dataUltimaDoacao mudarem

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
    setdataAtualizacao(perfil?.dataAtualizacao || "Indisponível");
    setPeso(perfil?.peso || "Indisponível");
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

  const canDonate = (peso: number | undefined, dataUltimaDoacao: Date | undefined): string => {
    const intervaloMinimoDias = 60;
    const pesoMinimo = 50; // Peso mínimo em kg
  
    if (peso === undefined || dataUltimaDoacao === undefined) {
      return 'indisponível'; // Retornar mensagem padrão se algum valor for indefinido
    }
  
    if (peso < pesoMinimo) {
      return 'Não'; // Não apto a doar
    }
  
    // Verificar se dataUltimaDoacao é um objeto Date
    const dataUltimaDoacaoDate = dataUltimaDoacao instanceof Date
      ? dataUltimaDoacao
      : new Date(dataUltimaDoacao); // Converte se não for um objeto Date
  
    if (isNaN(dataUltimaDoacaoDate.getTime())) {
      return 'indisponível'; // Retornar mensagem padrão se a data for inválida
    }
  
    const dataAtual = new Date();
    const diferencaDias = Math.floor((dataAtual.getTime() - dataUltimaDoacaoDate.getTime()) / (1000 * 60 * 60 * 24));
  
    return diferencaDias >= intervaloMinimoDias ? 'Sim' : 'Não';
  };


  const toDate = (date: string | Date): Date => {
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    }
    return date instanceof Date ? date : new Date();
  };
  
  

  return (
  <Grid container justifyContent="center" spacing={3}>
    <Grid item xs={12} textAlign="center">
      <Typography fontSize={32} variant="h4">Perfil</Typography>
    </Grid>
    <Grid item xs={8}>
      <CustomCard>
        <CardContent>
          {data && !loading ? (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <Typography variant="h6" gutterBottom>Credenciais:</Typography>
                <IconButton><FaUserEdit onClick={()=>{navigate('/perfil/editar')}} /></IconButton>
              </Box>
              <Divider />
              <Grid container spacing={2}>
              <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" style={{width:"13%",borderRadius: "50%",marginTop: "15px", padding: "10px"}}></img>
                <Grid item>
                  <Grid container spacing={5} mt={0.1}>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">Usuário</Typography>
                      <Typography style={{padding: '6px',borderRadius: 4, fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1"}} variant="body1">{username || "indisponivel"}</Typography>
                    </Grid>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">Email</Typography>
                      <Typography style={{width: tipoUsuario === 'hemocentro' ? '180px' : 'auto',padding: '6px',borderRadius: 4, fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1" }} variant="body1">{email|| "indisponivel"}</Typography>
                    </Grid>
                    {tipoUsuario === 'doador' && (
                    <>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">Peso</Typography>
                      <Typography style={{ padding: '6px',borderRadius: 4,fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1" }} variant="body1">{peso|| "indisponivel"}</Typography>
                    </Grid>
                    <Grid item xs={10} sm={6}>
                      <Typography variant="subtitle1">Elegível para doar</Typography>
                      <Typography style={{ padding: '6px',borderRadius: 4,fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1" }} variant="body1">{peso !== undefined && dataUltimaDoacao !== undefined ? canDonate(peso, toDate(dataUltimaDoacao)) : "indisponível"}</Typography>
                    </Grid>
                    </>
            )}
                  </Grid>
                </Grid>
              </Grid>
              <Typography  mt={5} variant="h6" gutterBottom>Dados Pessoais:</Typography>
              <Divider></Divider>
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
                      <Typography style={{ padding: '6px',borderRadius: 4,fontWeight: "bold",backgroundColor:localStorage.getItem("theme") === "\"DARK\"" ? "#26426F" : "#f1f1f1" }} variant="body1">{ sexo === 'M' ? "Masculino" : "Feminino" || "indisponivel"}</Typography>
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
