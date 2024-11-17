import {
    Badge,
    Box,
    Button,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import { formatDistanceToNow, parseISO } from "date-fns";
  import { gql, useMutation, useQuery } from "@apollo/client";
  
  import { Notifications as NotificationsIcon } from "@mui/icons-material";
  import { ptBR } from "date-fns/locale";
  import useTheme from "../hooks/useTheme";
  
  const GET_NOTIFICATIONS = gql`
    query notificacao {
      notificacao(order: { criadoEm: DESC }) {
        idNotificacao
        mensagem
        criadoEm
        visto
      }
    }
  `;
  
  const MARK_AS_SEEN = gql`
    mutation updateNotificacao {
      updateNotificacao {
        message
      }
    }
  `;
  
  interface Notificacao {
    idNotificacao: number;
    mensagem: string;
    criadoEm: string;
    visto: boolean;
  }
  
  const NotificationIcon = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { data, refetch, error } = useQuery<{ notificacao: Notificacao[] }>(
      GET_NOTIFICATIONS
    );
    const [markAsSeen] = useMutation(MARK_AS_SEEN);
    const { theme } = useTheme();
  
    const [notificacao, setNotificacao] = useState<Notificacao[]>([]);
  

    useEffect(() => {
      if (data) {
        setNotificacao(data.notificacao);
      }
    }, [data]);
  
    const unseenCount = notificacao.filter((n) => !n.visto).length;
  
    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = async () => {
      setAnchorEl(null);
  
      if(unseenCount > 0){// Chama a mutação para marcar todas as notificações como vistas
          try {
              // Chama a mutação para marcar todas as notificações como vistas
              const response = await markAsSeen({
                 }).catch((error) => {
                   console.log(JSON.stringify(error, null, 2));
                });
              //console.log(response.data); // Pode verificar a resposta da mutação se necessário
              refetch(); // Atualiza a lista de notificações após marcar como vistas
            } catch (error) {
              console.error('Erro ao marcar notificações como vistas:', error);
            }
      }
    };
  
    return (
      <>
        <Tooltip title="Notificações">
          <IconButton
            aria-label="notifications"
            aria-controls="notification-menu"
            aria-haspopup="true"
            onClick={handleOpen}
            color="inherit"
          >
            <Badge badgeContent={unseenCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Menu
          id="notification-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{maxWidth: "100%", maxHeight: "60%", borderRadius:"6px",marginTop: "10px"}}
        >
          <Box
            p={2}
            display={"flex"}
            justifyContent={"center"}
            sx={{
              backgroundColor: "#407ad6",
              borderRadius: "6px",
              position: "sticky",
              top: 0,
              zIndex: 1,
              marginTop: -2,
            }}
          >
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: "600",
                color: theme === "DEFAULT" ? "#ffffff" : "",
              }}
            >
              Notificações
            </Typography>
          </Box>
          {notificacao.flatMap((item, index) => [
            <MenuItem
              key={item.idNotificacao}
              onClick={handleClose}
              sx={{
                whiteSpace: "normal",
                backgroundColor: theme === "DEFAULT" ? "#F3F3F3" : "",
                paddingY: "15px",
              }}
            >
              <Box>
                <Typography variant="body2" color="textPrimary" sx={{ whiteSpace: "normal", wordWrap: "break-word", maxWidth:"400px",paddingRight: "30px", fontSize: "14px" }}>
                  {item.mensagem}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {formatDistanceToNow(parseISO(item.criadoEm), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </Typography>
              </Box>
            </MenuItem>,
            index < notificacao.length - 1 && <Divider key={`divider-${index}`} />,
          ])}
        </Menu>
      </>
    );
  };
  
  export default NotificationIcon;