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
import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import AgendamentoModal from "../../../Modal/AgendamentoModal";

import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import {
  formatCNPJ,
  formatDate,
  formatPhoneNumber,
} from "../../../../utils/functions";
import { decryptCookieValue } from "../../../../utils/jwt";

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

const GET_DOADORES = gql`
  query {
    getDoadores {
      id
      nomeCompleto
      tipoSanguineo
      telefone
      endereco
      dataNascimento
      dataUltimaDoacao
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

interface Doador {
  id: number;
  nomeCompleto: string;
  tipoSanguineo: string;
  telefone: string;
  dataUltimaDoacao: string;
  dataNascimento: string;
  endereco: string;
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
  const [doadores, setDoadores] = useState<Doador[]>([]);

  const codUser = decryptCookieValue();

  const [hemocentroSelecionado, setHemocentroSelecionado] =
    useState<Hemocentro | null>(null); // Hemocentro selecionado para detalhes

  const [doadorSelecionado, setdoadorSelecionado] = useState<Doador | null>(
    null
  );

  const [open, setOpen] = useState(false); // Estado do modal
  const [showAgendamento, setShowAgendamento] = useState(false); // Estado do modal
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  ); // Coordenadas

  const [
    CarregarHemocentros,
    { loading: loadingHemocentros, error: errorHemocentros },
  ] = useLazyQuery(GET_HEMOCENTROS);

  const [CarregarDoadores, { loading: loadingDoadores, error: errorDoadores }] =
    useLazyQuery(GET_DOADORES);

  const handleOpenModal = (hemocentro: Hemocentro) => {
    setHemocentroSelecionado(hemocentro);
    geocodeAddress(hemocentro.endereco);
    setOpen(true);
  };

  const handleOpenModalDoador = (doador: Doador) => {
    setdoadorSelecionado(doador);
    geocodeAddress(doador.endereco);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setHemocentroSelecionado(null);
    setdoadorSelecionado(null);
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

  const handleTipoChange = (event: React.SyntheticEvent, newValue: string) => {
    setTipoPesquisa(newValue);
  };

  useEffect(() => {
    if (tipoPesquisa === "hemocentros") {
      CarregarHemocentros()
        .then((response) => {
          if (response.data) {
            setHemocentros(response.data.hemocentros || []);
          }
        })
        .catch((error) => {
          console.error("Erro ao carregar hemocentros:", error);
        });
    } else if (tipoPesquisa === "doadores") {
      CarregarDoadores()
        .then((response) => {
          if (response.data) {
            setDoadores(response.data.getDoadores || []);
          }
        })
        .catch((error) => {
          console.error("Erro ao carregar doadores:", error);
        });
    }
  }, [tipoPesquisa, CarregarHemocentros, CarregarDoadores]);

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
        {tipoPesquisa === "hemocentros" ? (
          loadingHemocentros ? (
            <Typography>Carregando hemocentros...</Typography>
          ) : errorHemocentros ? (
            <Typography>Erro ao carregar hemocentros.</Typography>
          ) : hemocentros.length > 0 ? (
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
          )
        ) : loadingDoadores ? (
          <Typography>Carregando doadores...</Typography>
        ) : errorDoadores ? (
          <Typography>Erro ao carregar doadores.</Typography>
        ) : doadores.length > 0 ? (
          doadores.map((doador) => (
            <Box
              key={doador.id}
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
                <Typography variant="h5">{doador.nomeCompleto}</Typography>
                <Button
                  variant="contained"
                  onClick={() => handleOpenModalDoador(doador)}
                >
                  Ver detalhes
                </Button>
              </Box>
              <Typography mb={1} sx={{ color: "lightgrey" }}>
                Tipo Sanguíneo: {doador.tipoSanguineo}
              </Typography>
              <Typography mb={1} sx={{ color: "lightgrey" }}>
                Telefone: {formatPhoneNumber(doador.telefone)}
              </Typography>
              <Typography mb={1} sx={{ color: "lightgrey" }}>
                Data da última doação: {formatDate(doador.dataUltimaDoacao)}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography>Nenhum doador encontrado.</Typography>
        )}
      </Box>

      <AgendamentoModal open={showAgendamento} onClose={()=>{setShowAgendamento(false)}} codUser={codUser} codHemocentro={hemocentroSelecionado?.id} />

      <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontSize: 24 }}>
          {hemocentroSelecionado
            ? "Detalhes do Hemocentro"
            : "Detalhes do Doador"}
        </DialogTitle>
        <DialogContent>
          {hemocentroSelecionado ? (
            // Exibe detalhes do hemocentro
            <Box sx={{ display: "flex" }}>
              <Box sx={{ width: "50%" }}>
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
                <Typography>
                  CNPJ: {formatCNPJ(hemocentroSelecionado.cnpj)}
                </Typography>
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
          ) : doadorSelecionado ? (
            // Exibe detalhes do doador
            <Box sx={{ display: "flex" }}>
              <Box sx={{ width: "50%" }}>
                <Typography variant="h6">
                  {doadorSelecionado.nomeCompleto}
                </Typography>
                <Typography>
                  Tipo Sanguíneo: {doadorSelecionado.tipoSanguineo}
                </Typography>
                <Typography>
                  Telefone: {formatPhoneNumber(doadorSelecionado.telefone)}
                </Typography>
                <Typography>Endereço: {doadorSelecionado.endereco}</Typography>
                <Typography>
                  Data de Nascimento:{" "}
                  {formatDate(doadorSelecionado.dataNascimento)}
                </Typography>
                <Typography>
                  Data da última doação:{" "}
                  {formatDate(doadorSelecionado.dataUltimaDoacao)}
                </Typography>
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
          ) : (
            <Typography>Nenhum item selecionado.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={()=> {setShowAgendamento(true)}}>Agendar</Button>
          <Button onClick={handleCloseModal}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Hemocentros;
