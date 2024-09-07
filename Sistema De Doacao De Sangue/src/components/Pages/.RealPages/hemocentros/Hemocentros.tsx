import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FolderIcon from "@mui/icons-material/Folder";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { GiHospitalCross } from "react-icons/gi";
import { MdBloodtype } from "react-icons/md";
import { Box, Button, Typography } from "@mui/material";
import useTheme from "../../../hooks/useTheme";
import variants from "../../../theme/variants";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

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

function Hemocentros() {
  const { theme } = useTheme();
  const selectedVariant = variants.find(
    (variant: any) => variant.name === theme
  );

  const [tipoPesquisa, setTipoPesquisa] = useState("hemocentros");
  const [hemocentros, setHemocentros] = useState<Hemocentro[]>([]);

  const [CarregarHemocentros, { loading, error, data, refetch }] = useLazyQuery(GET_HEMOCENTROS);

  const handleTipoChange = (event: React.SyntheticEvent, newValue: string) => {
    setTipoPesquisa(newValue);
  };
 
  useEffect(() => {
    CarregarHemocentros()
      .then(response => {
        if (response.data) {
          setHemocentros(response.data.hemocentros || []);
        }
      })
      .catch(error => {
        console.error('Erro ao carregar hemocentros:', error);
      });
      console.log(data)
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
          borderRadius: "6px"
        }}
      >
        {loading && <Typography>Carregando...</Typography>}
        {error && <Typography>Erro ao carregar hemocentros.</Typography>}
        {hemocentros.length > 0 ? (
          hemocentros.map(hemocentro => (
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
                  width: "100%"
                }}
              >
                <Typography variant="h5">{hemocentro.nomeHemocentro}</Typography>
                <Button variant="contained">Ver detalhes</Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginTop: "8px",
                  width: "100%"
                }}
              >
                <Typography mb={1} sx={{ color: "lightgrey" }}>{hemocentro.endereco}</Typography>
                <Typography mb={1} sx={{ color: "lightgrey" }}>{hemocentro.telefone}</Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>Nenhum hemocentro encontrado.</Typography>
        )}
      </Box>
    </>
  );
}

export default Hemocentros;
