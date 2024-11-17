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
                <Typography variant="h6">Passo 1: Cadastro e Triagem</Typography>
                <Typography sx={{
                        textAlign: "center",
                        width: "100%", // Garante que o componente ocupe a largura total disponível
                        margin: "0 auto" // Adiciona margem automática para centralização adicional, se necessário
                    }}>
                      No primeiro passo, você deverá apresentar um documento oficial com foto. Em seguida, será solicitado que responda a um questionário sobre seu histórico de saúde e hábitos de vida. Após isso, será realizada uma avaliação rápida, incluindo a medição de sua pressão arterial, peso e níveis de hemoglobina, para garantir que você está apto a realizar a doação de sangue.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4} mt={-60}>
              <Paper elevation={3} style={{ padding: '10%', textAlign: 'center', borderRadius: "50%"}}>
              <Typography variant="h6">Passo 2: Doação de Sangue</Typography>
                <Typography sx={{
                        textAlign: "center",
                        width: "100%", // Garante que o componente ocupe a largura total disponível
                        margin: "0 auto" // Adiciona margem automática para centralização adicional, se necessário
                    }}>
                Durante a doação, você será acomodado em uma cadeira confortável, onde a coleta de sangue será realizada. O procedimento é rápido, durando cerca de 10 minutos, e consiste na retirada de aproximadamente 450 ml de sangue. Todo o material utilizado é descartável e seguro, garantindo que a doação seja feita de forma higiênica e sem riscos para o doador.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4} >
              <Paper elevation={3} style={{ padding: '10%', textAlign: 'center', borderRadius: "50%"}}>
              <Typography variant="h6">Passo 3: Recuperação e Hidratação</Typography>
                <Typography sx={{
                        textAlign: "center",
                        width: "100%", // Garante que o componente ocupe a largura total disponível
                        margin: "0 auto" // Adiciona margem automática para centralização adicional, se necessário
                    }}>
                Após a doação, você será orientado a descansar por alguns minutos em uma área reservada, enquanto recebe um lanche leve e sucos para ajudar na reposição de energia. Esse momento de descanso, que dura cerca de 15 minutos, é essencial para garantir que você se recupere bem. Após o descanso, é importante manter-se hidratado e evitar atividades físicas intensas nas próximas horas para garantir uma recuperação completa.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        </>
      );
  }
  
  export default ComoDoar;
  