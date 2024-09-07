import {
    Container,
    Grid,
    Paper,
    Typography,
  } from "@mui/material";
  

  import useTheme from "../hooks/useTheme";
  import variants from "../theme/variants";
  import FundoComoDoar from "../vendor/FundoComoDoar.svg";

  
  function ComoDoar() {
    const { theme } = useTheme();
    const selectedVariant = variants.find((variant) => variant.name === theme);
    const isDefaultTheme = theme === "DEFAULT";
  
    return ( 
      <>
        <Typography variant="h3" gutterBottom sx={{marginBottom: "12%", marginLeft: "18%"}}>Como doar?</Typography>
        <Container       sx={{
            backgroundImage: `url(${FundoComoDoar})`, // Substitua pelo caminho da sua imagem
            backgroundSize: '50%', // Faz com que a imagem cubra todo o container
            backgroundPosition: 'center', // Centraliza a imagem dentro do container
            backgroundRepeat: 'no-repeat', // Evita que a imagem se repita
            width: '100%',
            padding: 0
          }}>
          
          <Grid container spacing={12} justifyContent="center">
            {/* Passos */}
            <Grid item xs={12} sm={4} mb={20}>
              <Paper elevation={3} style={{ padding: '10%', textAlign: 'center', borderRadius: "50%"}}>
                <Typography variant="h6">Step 1: Lorem Ipsum</Typography>
                <Typography sx={{
                        textAlign: "center",
                        width: "100%", // Garante que o componente ocupe a largura total disponível
                        margin: "0 auto" // Adiciona margem automática para centralização adicional, se necessário
                    }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4} mt={-60}>
              <Paper elevation={3} style={{ padding: '10%', textAlign: 'center', borderRadius: "50%"}}>
              <Typography variant="h6">Step 2: Lorem Ipsum</Typography>
                <Typography sx={{
                        textAlign: "center",
                        width: "100%", // Garante que o componente ocupe a largura total disponível
                        margin: "0 auto" // Adiciona margem automática para centralização adicional, se necessário
                    }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4} >
              <Paper elevation={3} style={{ padding: '10%', textAlign: 'center', borderRadius: "50%"}}>
              <Typography variant="h6">Step 3: Lorem Ipsum</Typography>
                <Typography sx={{
                        textAlign: "center",
                        width: "100%", // Garante que o componente ocupe a largura total disponível
                        margin: "0 auto" // Adiciona margem automática para centralização adicional, se necessário
                    }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        </>
      );
  }
  
  export default ComoDoar;
  