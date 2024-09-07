import {
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from "@mui/material";

import { MdArrowForwardIos } from "react-icons/md";
import { Box } from "@mui/system";
import LogoFooter from "../vendor/LogoFooter.png";
import LogoFooterDark from "../vendor/LogoFooterSvg.svg"
import LogoNova from "../vendor/LogoHeader.svg"
import useTheme from "../hooks/useTheme";
import variants from "../theme/variants";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

function Footer() {
  const { theme } = useTheme();
  const selectedVariant = variants.find((variant) => variant.name === theme);
  const isDefaultTheme = theme === "DEFAULT";

  return (
    <Box
      sx={{
        backgroundColor: selectedVariant?.palette.background.paper,
        padding: 0,
      }}
    >
      <Container sx={{ minWidth: "90%" }}>
        <Grid
          item
          xs={12}
          sm={4}
          mb={20}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img src={!isDefaultTheme ? LogoNova : LogoFooterDark}></img>
          <Typography variant="h4">
            Pronto para salvar vidas?
            <Button
              sx={{
                marginLeft: "10px",
                paddingX: "50px",
                fontWeight: "900",
                backgroundColor: "#ffffff",
                color: "black",
                border: isDefaultTheme ? "solid 1px black" : "none",
                "&:hover": {
                  backgroundColor: "#ffffff", // Mantenha a mesma cor de fundo no hover
                  color: "black", // Mantenha a mesma cor do texto no hover
                  border: isDefaultTheme ? "solid 1px black" : "none"
                },
              }}
              variant="contained"
              color="primary"
            >
              Doar
            </Button>
          </Typography>
        </Grid>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" mb={10} sx={{ width: "35%" }}>
              Se inscreva na nossa Newsletter
            </Typography>
            <TextField
              placeholder="E-mail"
              sx={{
                "& fieldset": {
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                },
                width: "auto",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{
                      backgroundColor: "#f50057", // cor de fundo do InputAdornment
                      padding: "25px",
                      borderRadius: "4px",
                      height: "100%",
                      margin: 0,
                      cursor: "pointer",
                    }}
                  >
                    <MdArrowForwardIos color="#ffffff" />
                  </InputAdornment>
                ),
              }}
            ></TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" mb={10}>
              Serviços
            </Typography>
            <Typography
              sx={{
                cursor: "pointer",
                borderBottom: "2px solid transparent",
                width: "30%",
                "&:hover": {
                  borderBottom: "2px solid #ffffff",
                  borderColor: !isDefaultTheme ? "#ffffff" : "black",
                },
              }}
            >
              Entrar em contato
            </Typography>
            <Typography
              sx={{
                cursor: "pointer",
                borderBottom: "2px solid transparent",
                width: "38%",
                "&:hover": {
                  borderBottom: "2px solid #ffffff",
                  borderColor: !isDefaultTheme ? "#ffffff" : "black",
                },
              }}
            >
              Campanhas de doação
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" mb={10}>
              Sobre
            </Typography>
            <Typography
              sx={{
                cursor: "pointer",
                borderBottom: "2px solid transparent",
                width: "23%",
                "&:hover": {
                  borderBottom: "2px solid #ffffff",
                  borderColor: !isDefaultTheme ? "#ffffff" : "black",
                },
              }}
            >
              Nossa história
            </Typography>
            <Typography
              sx={{
                cursor: "pointer",
                borderBottom: "2px solid transparent",
                width: "20%",
                "&:hover": {
                  borderBottom: "2px solid #ffffff",
                  borderColor: !isDefaultTheme ? "#ffffff" : "black",
                },
              }}
            >
              Nosso time
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={4} sx={{ mt: 20 }}>
          {/* Coluna para o texto */}
          <Grid
            item
            xs={12}
            sm={8}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Typography
              sx={{
                marginRight: "30px",
                "&:hover": {
                  borderBottom: "2px solid #ffffff",
                  borderColor: !isDefaultTheme ? "#ffffff" : "black",
                },
              }}
            >
              Termos e Condições
            </Typography>
            <Typography
              sx={{
                ml: 2,
                "&:hover": {
                  borderBottom: "2px solid #ffffff",
                  borderColor: !isDefaultTheme ? "#ffffff" : "black",
                },
              }}
            >
              Política de Privacidade
            </Typography>
          </Grid>

          {/* Coluna para os ícones */}
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <IconButton>
              <FaTwitter size={25} />
            </IconButton>
            <IconButton>
              <FaFacebookF size={25} />
            </IconButton>
            <IconButton>
              <FaInstagram size={25} />
            </IconButton>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Footer;
