import * as Yup from "yup";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Hidden,
  Modal,
  Alert as MuiAlert,
  TextField as MuiTextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

import CircularLoading from "../Loading/Loading";
import { Formik } from "formik";
import LogoBranca from "/bloodIcon.png";
import LogoPreta from "/bloodIcon.png";
import { setCookie } from "nookies";
import sideImage from "../vendor/DoacaoDeSangue.png";
import { spacing } from "@mui/system";
import styled from "@emotion/styled";
import useAuth from "../hooks/useAuth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import variants from "../theme/variants";

const Alert = styled(MuiAlert)(spacing);
const TextField = styled(MuiTextField)<{ my?: number }>(spacing);

export const LOGIN_MUTATION = gql`
  mutation loginUsuario($dadosLogin: UsersDTOInput!) {
    loginUsuario(dadosLogin: $dadosLogin) {
      token
      message
      id
      tipo_usuario
    }
  }
`;

function SignIn() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const selectedVariant = variants.find((variant) => variant.name === theme);
  const { signIn, setUrl, url } = useAuth();
  const [login, { data, error, loading }] = useMutation(LOGIN_MUTATION);
  const [rememberFields, setRememberFields] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [apiUrl, setApiUrl] = useLocalStorage("url", null);
  const [isLoading, setIsLoading] = useState(false);
  const isDefaultTheme = theme === "DEFAULT";
  const isMobile = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    if (
      !localStorage.getItem("rememberedId") &&
      !localStorage.getItem("rememberedUsername")
    ) {
      localStorage.setItem("rememberedId", "");
      localStorage.setItem("rememberedUsername", "");
    }
  }, []);

  useEffect(() => {
    if (data) {
      console.log('Dados recebidos:', data);
      if (data?.loginUsuario?.message) {
        setErrorOccurred(true);  // Caso haja uma mensagem de erro
      } else {
        // Autenticação bem-sucedida, prosseguir com o login
        signIn(data?.loginUsuario.token, data?.loginUsuario.id, data?.loginUsuario.tipo_usuario);
      }
    }
  }, [data]);

  useEffect(() => {
    if (data?.loginUsuario) {
      setCookie(undefined,"tipoUser",data?.loginUsuario.tipo_usuario,{
        maxAge: 60 * 60 * 4,
        path: '/',
        sameSite: 'None',
        secure: true, 
      })
    }
  }, [data]);

  const Brand = styled.img`
    height: auto;
    width: 25%;
  `;

  const Brand2 = styled.img`
    height: auto;
    width: 25%;
  `;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: { xs: "auto", md: "100%", xl: "70%" },
        width:"60%",
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
        
        <Typography
          component="h1"
          variant="h4"
          align="left"
          marginBottom="5px"
          sx={{ display: "flex", justifyContent: "left", fontWeight: "400",fontSize: "1.75rem"}}
        >
          Entrar
        </Typography>

        <Formik
          enableReinitialize={true}
          initialValues={{
            username: localStorage.getItem("rememberedUsername") || "",
            password: "",
            submit: false,
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string().max(60).required("Usuário Obrigatório"),
            password: Yup.string().max(255).required("Senha Obrigatória"),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              setIsLoading(true);

              const response = await login({
                variables: {
                  dadosLogin:{
                    username: values.username,
                    password: values.password,
                  },
                },
              }).catch((error) => {
                console.log(JSON.stringify(error, null, 2));
                setStatus({ success: false });
                setErrors({ submit: error.message || "Something went wrong" });
                setSubmitting(false);
                setIsLoading(false);
              });
              console.log('Resposta da mutação:', response);
              if (data?.loginUsuario?.token) {
                signIn(data?.loginUsuario.token, data?.loginUsuario.user.id,data?.loginUsuario.tipo_usuario);
              }
            } catch (error: any) {
              console.log(JSON.stringify(error, null, 2));
              setStatus({ success: false });
              setErrors({ submit: error.message || "Something went wrong" });
              setSubmitting(false);
              setIsLoading(false);
            }

            if (rememberFields) {
              localStorage.setItem("rememberedUsername", values.username);
            } else {
              localStorage.removeItem("rememberedUsername");
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
          }) => (
            <form noValidate onSubmit={handleSubmit}>
              {(errorOccurred || errors.submit) && (
                <Alert mt={2} mb={3} severity="warning">
                  {"Login inválido"}
                </Alert>
              )}
              <Typography>
                Usuário
              </Typography>
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
              <Typography>
                Senha
              </Typography>
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
              <Grid container justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  style={{
                    backgroundColor: selectedVariant?.palette.button.main,
                    width: "100%",
                    marginTop: "10px"
                  }}
                  disabled={isSubmitting}
                >
                  Entrar
                </Button>
              </Grid>
              <Grid container justifyContent="space-between">
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    value="remember"
                    onChange={(event) =>
                      setRememberFields(event.target.checked)
                    }
                    color="primary"
                  />
                }
                label="Lembre-se"
              />
              <Typography sx={{display: "flex", justifyContent: "flex-end",margin: "3%"}}>
                Esqueci minha senha
              </Typography>
              </Grid>
              <Grid container justifyContent="center">
                <Typography>
                  Não possui conta?
                  <Button type="button" onClick={() => navigate("/auth/sign-up")}>Registrar</Button>
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
    </Box>
  );
}

export default SignIn;
