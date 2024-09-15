import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import { GiHospitalCross } from "react-icons/gi";
import { MdBloodtype } from "react-icons/md";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import useTheme from "../../../hooks/useTheme";
import variants from "../../../theme/variants";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { formatCNPJ, formatPhoneNumber } from "../../../../utils/functions";

const GET_HEMOCENTROS = gql`
  query {
    hemocentros {
      id
      nomeHemocentro
      endereco
      telefone
      emailContato
      cnpj
    }
  }
`;

interface Hemocentro {
  id: number;
  nomeHemocentro: string;
  endereco: string;
  telefone: string;
  emailContato: string;
  cnpj: string;
}

const center = { lat: 48.8584, lng: 2.2945 };

function Hemocentros() {
  const { theme } = useTheme();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAoDKmLK4aTcHTTXU-xGp1JC2io7cbreMU",
  });
  const selectedVariant = variants.find(
    (variant: any) => variant.name === theme
  );

  const [tipoPesquisa, setTipoPesquisa] = useState("hemocentros");
  const [hemocentros, setHemocentros] = useState<Hemocentro[]>([]);
  const [hemocentroSelecionado, setHemocentroSelecionado] =
    useState<Hemocentro | null>(null); // Hemocentro selecionado para detalhes
  const [open, setOpen] = useState(false); // Estado do modal
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null); // Coordenadas

  const [CarregarHemocentros, { loading, error, data, refetch }] =
    useLazyQuery(GET_HEMOCENTROS);

  const handleOpenModal = (hemocentro: Hemocentro) => {
    setHemocentroSelecionado(hemocentro);
    geocodeAddress(hemocentro.endereco);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setHemocentroSelecionado(null);
  };

   // Função para converter endereço em latitude e longitude
   const geocodeAddress = (endereco: string) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: endereco }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        const location = results[0].geometry.location;
        setCoords({ lat: location.lat(), lng: location.lng() });
      } else {
        console.error("Geocoding failed: " + status);
        setCoords(center); // Se falhar, usa o centro default
      }
    });
  };

  useEffect(() => {
    // Preenchendo com dados fake
    const hemocentrosFake: Hemocentro[] = [
      {
        id: 1,
        nomeHemocentro: "Hemocentro Central",
        endereco: "Avenida Brasil, 456, São Paulo, SP",
        telefone: "(11) 1234-5678",
        emailContato: "contato@hemocentrocentral.com.br",
        cnpj: "12.345.678/0001-90",
      },
      {
        id: 2,
        nomeHemocentro: "Hemocentro Norte",
        endereco: "Rua das Flores, 123, São Paulo, SP",
        telefone: "(11) 9876-5432",
        emailContato: "contato@hemocentronorte.com.br",
        cnpj: "98.765.432/0001-10",
      },
    ];

    // Definindo os dados fake no estado
    setHemocentros(hemocentrosFake);
  }, []);

  const handleTipoChange = (event: React.SyntheticEvent, newValue: string) => {
    setTipoPesquisa(newValue);
  };

  useEffect(() => {
    CarregarHemocentros()
      .then((response) => {
        if (response.data) {
          setHemocentros(response.data.hemocentros || []);
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar hemocentros:", error);
      });
    console.log(data);
  }, [CarregarHemocentros]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "15%",
          marginLeft: "43%",
        }}
      >
        <BottomNavigation
          sx={{ width: "100%", borderRadius: "6px" }}
          value={tipoPesquisa}
          onChange={handleTipoChange}
        >
          <BottomNavigationAction
            label="Hemocentros"
            value="hemocentros"
            icon={<GiHospitalCross size={24} />}
          />
          <BottomNavigationAction
            label="Doadores"
            value="doadores"
            icon={<MdBloodtype size={24} />}
          />
        </BottomNavigation>
      </Box>
      <Box
        sx={{
          backgroundColor: selectedVariant?.palette.background.default,
          width: "40%",
          display: "flex",
          flexDirection: "column", // Organiza os elementos verticalmente
          justifyContent: "center",
          alignItems: "center", // Centraliza horizontalmente
          padding: "16px", // Adiciona padding ao redor do conteúdo
          margin: "3% auto", // Centraliza horizontalmente
          borderRadius: "6px",
        }}
      >
        {loading && <Typography>Carregando...</Typography>}
        {error && <Typography>Erro ao carregar hemocentros.</Typography>}
        {hemocentros.length > 0 ? (
          hemocentros.map((hemocentro) => (
            <Box
              key={hemocentro.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                marginBottom: "16px",
                padding: "16px",
                width: "100%",
                borderRadius: "6px",
                backgroundColor: selectedVariant?.palette.background.paper,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography variant="h5">
                  {hemocentro.nomeHemocentro}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleOpenModal(hemocentro)}
                >
                  Ver detalhes
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginTop: "8px",
                  width: "100%",
                }}
              >
                <Typography mb={1} sx={{ color: "lightgrey" }}>
                  {hemocentro.endereco}
                </Typography>
                <Typography mb={1} sx={{ color: "lightgrey" }}>
                  {formatPhoneNumber(hemocentro.telefone)}
                </Typography>
              </Box>
            </Box>
            
          ))
        ) : (
          <Typography>Nenhum hemocentro encontrado.</Typography>
        )}
      </Box>
      {/* Modal de Detalhes */}
      <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle sx={{fontSize: 24}}>Detalhes do Hemocentro</DialogTitle>
        <DialogContent>
          {hemocentroSelecionado && (
            <Box sx={{ display:"flex"}}>
              <Box sx={{ width: "50%"}}>
                <Typography variant="h6">
                  {hemocentroSelecionado.nomeHemocentro}
                </Typography>
                <Typography>
                  Endereço: {hemocentroSelecionado.endereco}
                </Typography>
                <Typography>
                  Telefone: {formatPhoneNumber(hemocentroSelecionado.telefone)}
                </Typography>
                <Typography>
                  Email: {hemocentroSelecionado.emailContato}
                </Typography>
                <Typography>CNPJ: {formatCNPJ(hemocentroSelecionado.cnpj)}</Typography>
              </Box>
              <Box>
              <GoogleMap
                  center={coords ?? { lat: 48.8584, lng: 2.2945 }}
                  zoom={15}
                  mapContainerStyle={{ width: "500px", height: "500px" }}
                >
                  <Marker position={coords ?? { lat: 48.8584, lng: 2.2945 }} />
                </GoogleMap>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Hemocentros;
