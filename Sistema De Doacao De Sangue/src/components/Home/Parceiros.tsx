import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Box, IconButton, Card, CardMedia } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import useTheme from "../hooks/useTheme";
import variants from '../theme/variants';
import banner1 from "../vendor/banner1.png";
import banner2 from "../vendor/BannerSD-1.png";

function Parceiros() {
  const { theme } = useTheme();
  const selectedVariant = variants.find((variant: any) => variant.name === theme);
  const isDefaultTheme = theme === "DEFAULT";
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    banner1,
    banner2,
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    // Set up interval for automatic image change
    const interval = setInterval(handleNext, 5000); // Change image every 3 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <Container sx={{ marginBottom: "5%" }}>
    <Box sx={{backgroundColor: selectedVariant?.palette.background.paper, padding: "10px", borderRadius:"5px", marginBottom: "15px"}}>
        <Typography variant="h3">Nossa Missão</Typography>
        <Typography>Pesquisas apontam que apenas 1,8% da população brasileira doa sangue regularmente, embora o ideal para suprir as necessidades do país seja de 3 a 5%. Além disso, quase metade dos doadores doa apenas uma vez. Esse comportamento resulta em estoques inconsistentes e insuficientes, agravando crises de saúde pública, especialmente durante pandemias, feriados prolongados e períodos de maior demanda hospitalar. O sistema de doação será projetado para combater essas barreiras por meio de estratégias inovadoras e centradas no doador, com foco em engajamento contínuo e construção de confiança.</Typography>
    </Box>
        <Typography variant="h3" gutterBottom>Nossos Parceiros</Typography>
      <Box sx={{ position: 'relative', width: '100%', height: '90%', marginBottom: '20px' }}>
        <Card sx={{ height: '100%' }}>
          <CardMedia
            component="img"
            image={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            sx={{ height: '100%' }}
          />
        </Card>
        <IconButton
          onClick={handlePrev}
          sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Container>
    </>
  );
}

export default Parceiros;
