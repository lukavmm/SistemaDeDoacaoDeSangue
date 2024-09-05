import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Navigate, useNavigate } from "react-router-dom";
import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CircularLoading from "../../../../components/Loading/Loading";
import { FaUserEdit } from "react-icons/fa";
import React from "react";
import { decryptCookieValue } from "../../../../utils/jwt";
import { parseCookies } from "nookies";
import { parseISO } from "date-fns";
import { ptBR } from "@mui/x-date-pickers/locales/ptBR";
import ptLocale from "date-fns/locale/pt-BR";
import { styled } from "@mui/system";

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

const EditPerfil = () => {
  const codUser = decryptCookieValue();

  const cookies = parseCookies();
  const tipoUsuario = cookies["tipoUser"];

  const navigate = useNavigate();

  const [CarregarPerfil, { loading, error, data, refetch }] =
    useLazyQuery(GET_PERFIL);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [dataNascimento, setdataNascimento] = useState("");
  const [tipoSanguineo, settipoSanguineo] = useState("");
  const [sexo, setSexo] = useState("");
  const [endereco, setendereco] = useState("");
  const [telefone, settelefone] = useState("");
  const [dataUltimaDoacao, setdataUltimaDoacao] = useState("");
  const [cpf, setcpf] = useState("");
  const [nomeHemocentro, setnomeHemocentro] = useState("");
  const [cnpj, setcnpj] = useState("");
  const [peso, setPeso] = useState<number | undefined>(undefined);
  const [dataAtualizacao, setdataAtualizacao] = useState("");

  const [elegibilidade, setElegibilidade] = useState<string>("indisponível");

  const [dataUltimaDoacaoAtualizada, setDataUltimaDoacaoAtualizada] =
    useState<Date | null>(null);

  // Use a função para atualizar a elegibilidade
  useEffect(() => {
    setElegibilidade(canDonate(peso, toDate(dataUltimaDoacao)));
  }, [peso, dataUltimaDoacao]); // Atualiza quando peso ou dataUltimaDoacao mudarem

  useEffect(() => {
    if (data) {
      console.log(data);
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
  }, [data]);

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

  const handleDateChange = (date: Date | null) => {
    setDataUltimaDoacaoAtualizada(date);
  };

  const canDonate = (
    peso: number | undefined,
    dataUltimaDoacao: Date | undefined
  ): string => {
    const intervaloMinimoDias = 60;
    const pesoMinimo = 50; // Peso mínimo em kg

    if (peso === undefined || dataUltimaDoacao === undefined) {
      return "indisponível"; // Retornar mensagem padrão se algum valor for indefinido
    }

    if (peso < pesoMinimo) {
      return "Não"; // Não apto a doar
    }

    // Verificar se dataUltimaDoacao é um objeto Date
    const dataUltimaDoacaoDate =
      dataUltimaDoacao instanceof Date
        ? dataUltimaDoacao
        : new Date(dataUltimaDoacao); // Converte se não for um objeto Date

    if (isNaN(dataUltimaDoacaoDate.getTime())) {
      return "indisponível"; // Retornar mensagem padrão se a data for inválida
    }

    const dataAtual = new Date();
    const diferencaDias = Math.floor(
      (dataAtual.getTime() - dataUltimaDoacaoDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return diferencaDias >= intervaloMinimoDias ? "Sim" : "Não";
  };

  const formatDate = (isoDateString: any) => {
    if (!isoDateString) return ""; // Retorna uma string vazia se a data não for fornecida

    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês é zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${day}-${month}-${year}`;
  };

  function formatPhoneNumber(value: string): string {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  }

  function formatCPF(value: string): string {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return value;
  }

  const handlePesoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numberValue = parseFloat(value);
    setPeso(isNaN(numberValue) ? undefined : numberValue);
  };

  function formatCNPJ(value: string): string {
    if (!value) return "";
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, "");
    // Match the cleaned input to the CNPJ format
    const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
    }
    return value;
  }

  const toDate = (date: string | Date): Date => {
    if (typeof date === "string") {
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    }
    return date instanceof Date ? date : new Date();
  };

  return (
    <Grid container justifyContent="center" spacing={3}>
      <Grid item xs={12} textAlign="center">
        <Typography fontSize={32} variant="h4">
          Perfil
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <CustomCard>
          <CardContent>
            {data && !loading ? (
              <>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <Typography variant="h6" gutterBottom>
                    Credenciais:
                  </Typography>
                  <IconButton>
                    <FaUserEdit />
                  </IconButton>
                </Box>
                <Divider />
                <Grid container spacing={2}>
                  <img
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    style={{
                      width: "13%",
                      borderRadius: "50%",
                      marginTop: "15px",
                      padding: "10px",
                    }}
                  ></img>
                  <Grid item>
                    <Grid container spacing={5} mt={0.1}>
                      <Grid item xs={10} sm={6}>
                        <TextField
                          label="Usuário"
                          fullWidth
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={10} sm={6}>
                        <TextField
                          label="E-mail"
                          fullWidth
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          variant="outlined"
                        />
                      </Grid>
                      {tipoUsuario === "doador" && (
                        <>
                          <Grid item xs={10} sm={6}>
                            <TextField
                              label="Peso"
                              fullWidth
                              value={peso === undefined ? "" : peso.toString()}
                              onChange={handlePesoChange}
                              variant="outlined"
                              type="number"
                            />
                          </Grid>
                          <Grid item xs={10} sm={6}>
                            <TextField
                              label="Elegível para doar"
                              fullWidth
                              value={elegibilidade}
                              disabled
                              variant="outlined"
                            />
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Typography mt={5} variant="h6" gutterBottom>
                  Dados Pessoais:
                </Typography>
                <Divider></Divider>
                {tipoUsuario == "doador" && (
                  <>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Grid container spacing={5} mt={0.1}>
                          <Grid item xs={10} sm={6}>
                            <TextField
                              label="Nome Completo"
                              fullWidth
                              value={nomeCompleto}
                              onChange={(e) => setNomeCompleto(e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={10} sm={6}>
                            <TextField
                              label="Data de Nascimento"
                              fullWidth
                              value={formatDate(dataNascimento)}
                              onChange={(e) =>
                                setdataNascimento(e.target.value)
                              }
                              variant="outlined"
                              disabled
                            />
                          </Grid>
                          <Grid item xs={10} sm={6}>
                            <TextField
                              label="Tipo sanguíneo"
                              fullWidth
                              value={tipoSanguineo}
                              onChange={(e) => settipoSanguineo(e.target.value)}
                              disabled
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={10} sm={6}>
                            <TextField
                              label="Sexo"
                              fullWidth
                              value={sexo === 'M' ? "Masculino" : "Feminino"}
                              onChange={(e) => setEmail(e.target.value)}
                              variant="outlined"
                              disabled
                            />
                          </Grid>
                          <Grid item xs={10} sm={6}>
                            <TextField
                              label="Endereço"
                              fullWidth
                              value={endereco}
                              onChange={(e) => setendereco(e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={10} sm={6}>
                            <TextField
                              label="Telefone"
                              fullWidth
                              value={formatPhoneNumber(telefone)}
                              onChange={(e) => settelefone(e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={10} sm={6}>
                            <LocalizationProvider
                              dateAdapter={AdapterDateFns}
                              adapterLocale={ptLocale}
                              localeText={
                                ptBR.components.MuiLocalizationProvider
                                  .defaultProps.localeText
                              }
                            >
                              <DatePicker
                                sx={{ width: "100%" }}
                                label="Data da última doação"
                                value={parseISO(dataUltimaDoacao)}
                                slotProps={{ textField: { size: "medium" } }}
                                onChange={(date: any) => {
                                  setDataUltimaDoacaoAtualizada(date);
                                }}
                              />
                            </LocalizationProvider>
                          </Grid>
                          <Grid item xs={10} sm={6}>
                            <TextField
                              label="Cpf"
                              fullWidth
                              value={formatCPF(cpf)}
                              onChange={(e) => setcpf(e.target.value)}
                              variant="outlined"
                              disabled
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                )}
                {tipoUsuario == "hemocentro" && (
                  <>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Grid container spacing={5} mt={0.1}>
                          <Grid item xs={10} sm={6}>
                            <TextField
                              label="Hemocentro"
                              fullWidth
                              value={nomeHemocentro}
                              onChange={(e) =>
                                setnomeHemocentro(e.target.value)
                              }
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={10} sm={6}>
                            <TextField
                              label="Endereço"
                              fullWidth
                              value={endereco}
                              onChange={(e) => setendereco(e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={10} sm={6}>
                            <TextField
                              label="Telefone"
                              fullWidth
                              value={formatPhoneNumber(telefone)}
                              onChange={(e) => settelefone(e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={10} sm={6}>
                            <TextField
                              label="E-mail"
                              fullWidth
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={10} sm={6}>
                            <TextField
                              label="Cnpj"
                              fullWidth
                              value={formatCNPJ(cnpj)}
                              onChange={(e) => setcnpj(e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    display: "block",
                    margin: "20px auto",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Salvar e aplicar
                </Button>
              </>
            ) : (
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{ height: "37.8vh" }}
              >
                <CircularLoading />
              </Grid>
            )}
          </CardContent>
        </CustomCard>
      </Grid>
    </Grid>
  );
};

export default EditPerfil;
