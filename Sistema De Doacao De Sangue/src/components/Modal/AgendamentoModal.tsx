import * as React from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
} from "@mui/material";
import { gql, useMutation } from '@apollo/client';
import { useState } from "react";
import { parseCookies } from "nookies";

export const CRIAR_AGENDAMENTO = gql`
  mutation criarAgendamento($dadosAgendamento: AgendamentoDTOInput!, $codUser: Int!, $codHemocentro: Int!, $tipoUsuario: String!) {
    criarAgendamento(
      dadosAgendamento: $dadosAgendamento,
      codUser: $codUser,
      codHemocentro: $codHemocentro,
      tipoUsuario: $tipoUsuario,
    ) {
      message
      error
    }
  }
`;

interface AgendamentoModalProps {
  open: boolean;
  onClose: () => void;
  codUser: number | null;
  codHemocentro: number | undefined; 
}

const AgendamentoModal: React.FC<AgendamentoModalProps> = ({ open, onClose, codUser, codHemocentro }) => {

  const [date, setDate] = useState("");
  const [hora, setHora] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const cookies = parseCookies();
  const tipoUsuario = cookies["tipoUser"];

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const [severity, setSeverity] = React.useState<'success' | 'info' | 'warning' | 'error'>('success');

  const [criar_agendamento, { data, error, loading }] = useMutation(CRIAR_AGENDAMENTO);

  //console.log(data,error,loading)

  const formatarHora = (hora: string): string => {
    const [h, m] = hora.split(":");
    return `PT${parseInt(h)}H${parseInt(m)}M`;
  };

  const handleConfirmarAgendamento = async () => {
    try {
      console.log(formatarHora(hora),date,codUser,codHemocentro)
      const response = await criar_agendamento({
        variables: {
          dadosAgendamento: {
            data: date,
            hora: formatarHora(hora),
            status: "confirmado",
            obs: observacoes
          },
          codUser: codUser,
          codHemocentro: codHemocentro,
          tipoUsuario: tipoUsuario
        },
      });
      console.log(response);
      if (response?.data.criarAgendamento?.error === "" || response?.data.criarAgendamento?.error === null) {
        // Sucesso
        setShowMessage(response?.data.criarAgendamento?.message);
        setSeverity("success");
        setShowMessageModal(true);
      } else {
        // Erro
        setShowMessage(response?.data.criarAgendamento?.error);
        setSeverity("warning");
        setShowMessageModal(true);
      }
    }  catch (e) {
      console.log(JSON.stringify(error, null, 2));
      const message = e || "Ocorreu algum erro :(";
      setShowMessage(message);
      setSeverity("error");
      setShowMessageModal(true);
    }
  }

  const handleClose = () => {
    // Redefine os estados ao fechar o modal
    setDate("");
    setHora("");
    setObservacoes("");
    setShowMessageModal(false);
    onClose(); // Chama a função de fechamento passada como prop
  };

  return (
    <>
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Agendar Doação</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField label="Data do Agendamento" type="date" InputLabelProps={{ shrink: true }} value={date}
              onChange={(e) => setDate(e.target.value)} />
          <TextField label="Horário" type="time" InputLabelProps={{ shrink: true}} value={hora}
              onChange={(e) => setHora(e.target.value)} />
          <TextField label="Observações" multiline rows={3} value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" color="primary" onClick={handleConfirmarAgendamento}>
          Confirmar Agendamento
        </Button>
      </DialogActions>
    </Dialog>
    {severity == 'success'  ?
  <Snackbar open={showMessageModal} autoHideDuration={3000}     onClose={() => {
    setShowMessageModal(false);
    handleClose(); // Fechar o modal quando o Snackbar for fechado
  }}>
      <Alert      onClose={() => {
      setShowMessageModal(false);
      handleClose(); // Fechar o modal quando o Snackbar for fechado
    }} severity={severity == 'success'? 'success': 'error' } sx={{ width: '100%' }}>
          <AlertTitle>{severity == 'success'? `Sucesso` : `Erro` }</AlertTitle>
          {showMessage}
      </Alert>
  </Snackbar>
  :
  <Snackbar open={showMessageModal} autoHideDuration={5000} onClose={() => setShowMessageModal(false)}>
      <Alert  onClose={() => setShowMessageModal(false)} severity={'warning'} sx={{ width: '100%' }}>
          <AlertTitle>Atenção ! </AlertTitle>
          {showMessage}
      </Alert>
  </Snackbar>}
      </>
    );
};

export default AgendamentoModal;
