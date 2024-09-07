import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Box, IconButton, Card, CardMedia } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import useTheme from "../hooks/useTheme";
import variants from '../theme/variants';

function Parceiros() {
  const { theme } = useTheme();
  const selectedVariant = variants.find((variant: any) => variant.name === theme);
  const isDefaultTheme = theme === "DEFAULT";
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    'https://wallpapers.com/images/featured/amazon-npcp6jc782ixp9zs.jpg',
    'https://portal.fiocruz.br/sites/portal.fiocruz.br/files/styles/institucional_nova_-_banners/public/banner/banner_tghn_fiocruz_portal_en_960_x_250_px.png?itok=WfE55_Pz',
    "https://i.pcmag.com/imagery/articles/03Ab48cEIqQVBraBHaqFBIE-1..v1604347983.jpg",
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
        <Typography>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. </Typography>
    </Box>
        <Typography variant="h3" gutterBottom>Nossos Parceiros</Typography>
      <Box sx={{ position: 'relative', width: '100%', height: '400px', marginBottom: '20px' }}>
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
