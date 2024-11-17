import * as Yup from "yup";

import {
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  Grid,
  Modal,
  Alert as MuiAlert,
  TextField as MuiTextField,
  Snackbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { Autocomplete as AutocompleteGoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { BiDonateBlood } from "react-icons/bi";
import CircularLoading from "../Loading/Loading";
import { FaRegHospital } from "react-icons/fa";
import { Formik } from "formik";
import LogoBranca from "/bloodIcon.png";
import LogoPreta from "/bloodIcon.png";
import React from "react";
import { ptBR } from "@mui/x-date-pickers/locales/ptBR";
import ptLocale from "date-fns/locale/pt-BR";
import sideImage from "../vendor/DoacaoDeSangue.png";
import { spacing } from "@mui/system";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import variants from "../theme/variants";
import { formatCNPJ } from "../../utils/functions";

const Alert = styled(MuiAlert)(spacing);
const TextField = styled(MuiTextField)<{ my?: number }>(spacing);

export const REGISTER_MUTATION = gql`
  mutation registrarUsuario($dadosUsuario: RegistroDTOInput!) {
    registrarUsuario(dadosUsuario: $dadosUsuario) {
      message
      error
    }
  }
`;

function SignUp() {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAoDKmLK4aTcHTTXU-xGp1JC2io7cbreMU",
    libraries: ['places']
  });
  const { theme } = useTheme();
  const selectedVariant = variants.find((variant) => variant.name === theme);
  //const { signIn, setUrl, url } = useAuth();
  const [registro, { data, error, loading }] = useMutation(REGISTER_MUTATION);
  const [isLoading, setIsLoading] = useState(false);
  const isDefaultTheme = theme === "DEFAULT";
  const [tipoCadastro, setTipoCadastro] = useState("");
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const [severity, setSeverity] = React.useState<'success' | 'info' | 'warning' | 'error'>('success');
  
  const [isCompleted, setIsCompleted] = useState(false);

  const [cnpj, setCnpj] = useState('');

  // Função para tratar mudanças no campo
  const handleChangeMask = (e: any) => {
    const { value } = e.target;
    setCnpj(formatCNPJ(value));
  };
  // Função para formatar CNPJ

  const opcoesSexo = [
    { label: "Masculino", id: 1, value: "M" },
    { label: "Feminino", id: 2, value: "F" },
  ];

  useEffect(() => {
    if (
      !localStorage.getItem("rememberedId") &&
      !localStorage.getItem("rememberedUsername")
    ) {
      localStorage.setItem("rememberedId", "");
      localStorage.setItem("rememberedUsername", "");
    }
  }, []);

  const Brand = styled.img`
    height: auto;
    width: 25%;
  `;



  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: { xs: "auto", md: "100%", xl: "70%" },
        width: "50%",
        justifyContent: tipoCadastro === "" ? "" : "center",
        padding: "auto",
        marginX: "22%",
        marginY: "6%",
        backgroundColor: selectedVariant?.palette.background.paper,
      }}
    >
      <Box
        sx={{
          width: { sm: "100%", md: "50%" },
          position: "relative",
          display: tipoCadastro === "" ? "block" : "none",
        }}
      >
        {isMobile && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "6px",
              backgroundColor: isDefaultTheme
                ? "rgba(211, 218, 233, 0.5)"
                : "rgba(16, 40, 87, 0.5)",
            }}
          />
        )}
        <img
          src={sideImage}
          alt="Imagem do login"
          style={{
            display: tipoCadastro === "" ? "block" : "none",
            borderRadius: "6px",
            width: "100%",
            height: "100%",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
        />
        {isMobile && (
          <div
            style={{
              width: "100%",
              position: "absolute",
              top: "85%",
              left: "85%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Brand src={isDefaultTheme ? LogoPreta : LogoBranca} alt="Logo" />
          </div>
        )}
      </Box>

      <Box
        sx={{
          width: { sx: "100%", md: "50%" },
          height: "auto",
          padding: "35px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid container justifyContent="space-between">
          <Typography
            component="h1"
            variant="h4"
            align="left"
            marginBottom="5px"
            sx={{
              display: "flex",
              justifyContent: "left",
              fontWeight: "400",
              fontSize: "1.75rem",
            }}
          >
            Criar conta
          </Typography>
          <Grid item>
            <Button
              sx={{ width: "2%", minWidth: "30px" }}
              onClick={() => {
                setTipoCadastro("hemocentro");
              }}
            >
              <FaRegHospital size={20} />{" "}
            </Button>
            <Button
              sx={{ width: "2%", minWidth: "30px" }}
              onClick={() => {
                setTipoCadastro("doador");
              }}
            >
              <BiDonateBlood size={20} />{" "}
            </Button>
          </Grid>
        </Grid>

        <Formik
          enableReinitialize={true}
          initialValues={{
            username: localStorage.getItem("rememberedUsername") || "",
            password: "",
            dataNascimento: null,
            tipo_sanguineo: "",
            sexo: "",
            endereco: "",
            telefone: "",
            dataUltimaDoacao: null,
            cpf: "",
            email: "",
            nomeCompleto: "",
            cnpj: "",
            tipo_cadastro: "",
            submit: false,
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string().required('Usuário é obrigatório'),
            password: Yup.string().required('Senha é obrigatório'),
            nomeCompleto: Yup.string().required('Nome completo é obrigatório'),
            cpf: Yup.string().required('CPF é obrigatório'),
            dataNascimento: Yup.date().required('Data de nascimento é obrigatória'),
            email: Yup.string().email('Email inválido').required('Email é obrigatório'),
            telefone: Yup.string().required('Telefone é obrigatório'),
            endereco: Yup.string().required('Endereço é obrigatório'),
            tipo_sanguineo: Yup.string().required('Tipo sanguíneo é obrigatório'),
            dataUltimaDoacao: Yup.date().required('Data da última doação é obrigatória'),
            cnpj: Yup.string().required('CNPJ é obrigatório'),
            sexo: Yup.string().required('Sexo é obrigatório'),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              setIsLoading(true);
              const response = await registro({
                variables: {
                  dadosUsuario: {
                    username: values.username,
                    password: values.password,
                    dataNascimento: values.dataNascimento,
                    tipo_sanguineo: values.tipo_sanguineo,
                    sexo: values.sexo,
                    endereco: values.endereco,
                    telefone: values.telefone,
                    dataUltimaDoacao: values.dataUltimaDoacao,
                    cpf: values.cpf,
                    email: values.email,
                    nomeCompleto: values.nomeCompleto,
                    cnpj: values.cnpj,
                    tipo_cadastro: tipoCadastro,
                  },
                },
              });
              console.log(response);
              if (response?.data.registrarUsuario?.error === "") {
                // Sucesso
                setShowMessage("Sucesso ao cadastrar!");
                setSeverity("success");
                setShowMessageModal(true);
              } else {
                // Erro
                setShowMessage(response?.data.registrarUsuario?.error);
                setSeverity("warning");
                setShowMessageModal(true);
                setIsCompleted(false);
              }
            }  catch (e) {
              const message = e || "Ocorreu algum erro :(";
              setErrors(message);
              setSubmitting(false);
              setShowMessage("Erro ao cadastrar");
              setSeverity("error");
              setShowMessageModal(true);
              setIsCompleted(false);
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            isSubmitting,
            touched,
            values,
          }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Typography>Usuário</Typography>
              <TextField
                style={{ marginBottom: 5 }}
                type="username"
                name="username"
                label="Usuário"
                value={values.username}
                error={Boolean(touched.username && errors.username)}
                fullWidth
                helperText={touched.username && errors.username}
                onBlur={handleBlur}
                onChange={handleChange}
                my={2}
              />
              <Typography>Senha</Typography>
              <TextField
                type="password"
                name="password"
                label="Senha"
                value={values.password}
                error={Boolean(touched.password && errors.password)}
                fullWidth
                helperText={touched.password && errors.password}
                onBlur={handleBlur}
                onChange={handleChange}
                my={2}
              />
              <Typography>E-mail</Typography>
              <TextField
                type="email"
                name="email"
                label="E-mail"
                value={values.email}
                error={Boolean(touched.email && errors.email)}
                fullWidth
                helperText={touched.email && errors.email}
                onBlur={handleBlur}
                onChange={handleChange}
                my={2}
              />
              {tipoCadastro == "doador" && (
                <>
                  <Typography>Nome Completo</Typography>
                  <TextField
                    type="text"
                    name="nomeCompleto"
                    label="Nome Completo"
                    value={values.nomeCompleto}
                    error={Boolean(touched.nomeCompleto && errors.nomeCompleto)}
                    fullWidth
                    helperText={touched.nomeCompleto && errors.nomeCompleto}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    my={2}
                  />
                  <Typography my={2}>Data de Nascimento</Typography>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={ptLocale}
                    localeText={
                      ptBR.components.MuiLocalizationProvider.defaultProps
                        .localeText
                    }
                  >
                    <DatePicker
                      sx={{ width: "100%" }}
                      label="Selecione a Data de Nascimento"
                      value={values.dataNascimento}
                      slotProps={{ textField: { size: "medium" } }}
                      onChange={(date: any) => {
                        setFieldValue("dataNascimento", date);
                      }}
                    />
                  </LocalizationProvider>

                  <Typography my={2}>Data da ultima doação</Typography>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={ptLocale}
                    localeText={
                      ptBR.components.MuiLocalizationProvider.defaultProps
                        .localeText
                    }
                  >
                    <DatePicker
                      sx={{ width: "100%" }}
                      label="Selecione a Data da última doação"
                      value={values.dataUltimaDoacao}
                      slotProps={{ textField: { size: "medium" } }}
                      onChange={(date: any) => {
                        setFieldValue("dataUltimaDoacao", date);
                      }}
                    />
                  </LocalizationProvider>

                  <Typography>Tipo Sanguíneo</Typography>
                  <TextField
                    type="text"
                    name="tipo_sanguineo"
                    label="Tipo Sanguíneo"
                    value={values.tipo_sanguineo}
                    error={Boolean(
                      touched.tipo_sanguineo && errors.tipo_sanguineo
                    )}
                    fullWidth
                    helperText={touched.tipo_sanguineo && errors.tipo_sanguineo}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    my={2}
                  />

                  <Typography my={2}>Sexo</Typography>
                  <Autocomplete
                    disablePortal
                    options={opcoesSexo}
                    getOptionLabel={(option) => option.label}
                    value={
                      opcoesSexo.find((op) => op.value === values.sexo) || null
                    }
                    onChange={(event, newValue) =>
                      setFieldValue("sexo", newValue?.value || "")
                    }
                    sx={{ width: "100%" }}
                    renderInput={(params) => (
                      <TextField {...params} label="Sexo" />
                    )}
                  />

                  <Typography>Endereço</Typography>
                  <AutocompleteGoogleMap>
                    <TextField
                      type="text"
                      name="endereco"
                      label="Endereço"
                      value={values.endereco}
                      error={Boolean(touched.endereco && errors.endereco)}
                      fullWidth
                      helperText={touched.endereco && errors.endereco}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      my={2}
                    />
                  </AutocompleteGoogleMap>  
                  <Typography>Telefone</Typography>
                  <TextField
                    type="text"
                    name="telefone"
                    label="Telefone"
                    value={values.telefone}
                    error={Boolean(touched.telefone && errors.telefone)}
                    fullWidth
                    helperText={touched.telefone && errors.telefone}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    my={2}
                  />

                  <Typography>Cpf</Typography>
                  <TextField
                    type="text"
                    name="cpf"
                    label="Cpf"
                    value={values.cpf}
                    error={Boolean(touched.cpf && errors.cpf)}
                    fullWidth
                    helperText={touched.cpf && errors.cpf}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    my={2}
                  />
                </>
              )}
              {tipoCadastro == "hemocentro" && (
                <>
                  <Typography>Nome Hemocentro</Typography>
                  <TextField
                    type="text"
                    name="nomeCompleto"
                    label="Nome Hemocentro"
                    value={values.nomeCompleto}
                    error={Boolean(touched.nomeCompleto && errors.nomeCompleto)}
                    fullWidth
                    helperText={touched.nomeCompleto && errors.nomeCompleto}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    my={2}
                  />

                  <Typography>Endereço</Typography>
                  <AutocompleteGoogleMap>
                    <TextField
                      type="text"
                      name="endereco"
                      label="Endereço"
                      value={values.endereco}
                      error={Boolean(touched.endereco && errors.endereco)}
                      fullWidth
                      helperText={touched.endereco && errors.endereco}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      my={2}
                    />
                  </AutocompleteGoogleMap>
                  <Typography>Telefone</Typography>
                  <TextField
                    type="text"
                    name="telefone"
                    label="Telefone"
                    value={values.telefone}
                    error={Boolean(touched.telefone && errors.telefone)}
                    fullWidth
                    helperText={touched.telefone && errors.telefone}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    my={2}
                  />

                  <Typography>Cnpj</Typography>
                  <TextField
                    type="text"
                    name="cnpj"
                    label="Cnpj"
                    value={values.cnpj}
                    error={Boolean(touched.cnpj && errors.cnpj)}
                    fullWidth
                    helperText={touched.cnpj && errors.cnpj}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    my={2}
                  />
                </>
              )}
              <Grid container justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  style={{
                    backgroundColor: selectedVariant?.palette.button.main,
                    width: "100%",
                    marginTop: "10px",
                  }}
                  disabled={isSubmitting}
                >
                  Registrar
                </Button>
              </Grid>
              <Grid container justifyContent="center">
                <Typography>
                  Já possui conta?
                  <Button
                    type="button"
                    onClick={() => navigate("/auth/sign-in")}
                  >
                    Entrar
                  </Button>
                </Typography>
              </Grid>
              {(isLoading || loading) && (
                <Modal
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  open={isLoading || loading}
                >
                  <CircularLoading />
                </Modal>
              )}
            </form>
          )}
        </Formik>
      </Box>
      {severity == 'success'  ?
            <Snackbar open={showMessageModal} autoHideDuration={3000} onClose={() => navigate("/auth/sign-in")}>
                <Alert  onClose={() => setShowMessageModal(false)} severity={severity == 'success'? 'success': 'error' } sx={{ width: '100%' }}>
                    <AlertTitle>{severity == 'success'? `Sucesso` : `Erro` }</AlertTitle>
                    {showMessage}
                </Alert>
            </Snackbar>
            :
            <Snackbar open={showMessageModal} autoHideDuration={5000} onClose={() => setShowMessageModal(false)}>
                <Alert  onClose={() => setShowMessageModal(false)} severity={'warning'} sx={{ width: '100%' }}>
                    <AlertTitle>Atenção ! </AlertTitle>
                    {showMessage}
                </Alert>
            </Snackbar>
            }
    </Box>
  );
}

export default SignUp;
