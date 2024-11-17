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
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";

export const EDITAR_AGENDAMENTO = gql`
  mutation editarAgendamento($dadosAgendamento: AgendamentoDTOInput!, $idAgendamento: Int!) {
    editarAgendamento(
      dadosAgendamento: $dadosAgendamento,
      idAgendamento: $idAgendamento,
    ) {
      message
      error
    }
  }
`;

interface AgendamentoModalProps {
  open: boolean;
  onClose: () => void;
  selectedEvent : any;
  refetch: any;
}

const EditarAgendamentoModal: React.FC<AgendamentoModalProps> = ({ open, onClose, selectedEvent, refetch }) => {

  const [idAgendamento,setIdAgendamento] = useState();
  const [date, setDate] = useState("");
  const [hora, setHora] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const cookies = parseCookies();
  const tipoUsuario = cookies["tipoUser"];

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const [severity, setSeverity] = React.useState<'success' | 'info' | 'warning' | 'error'>('success');

  const [editar_agendamento, { data, error, loading }] = useMutation(EDITAR_AGENDAMENTO);

  const formatarHora = (timeString: string): string => {
    // Expressão regular para extrair horas e minutos
    const match = timeString.match(/^PT(\d+)H(\d+)M$/);
    if (match) {
      const [_, hours, minutes] = match;
      // Retorna no formato HH:mm
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    }
    return ""; // Retorna uma string vazia se o formato for inválido
  };

  const formatarHoraEnvio = (hora: string): string => {
    const [h, m] = hora.split(":");
    return `PT${parseInt(h)}H${parseInt(m)}M`;
  };

  const formatDate = (dateString: string) => {
    // Certifique-se de que a string está sendo convertida para um objeto Date válido
    const date = new Date(dateString);
    
    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      return ''; // Retorna uma string vazia se a data não for válida
    }
    
    // Formatar no formato YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if(selectedEvent){
        setIdAgendamento(selectedEvent.id)
        setDate(formatDate(selectedEvent.data));
        setHora(formatarHora(selectedEvent.hora));
        setObservacoes(selectedEvent.obs)
    }
  }, [selectedEvent]);

  const handleConfirmarAgendamento = async () => {
    try {
      const response = await editar_agendamento({
        variables: {
          dadosAgendamento: {
            data: date,
            hora: formatarHoraEnvio(hora),
            status: "confirmado",
            obs: observacoes
          },
          idAgendamento: idAgendamento
        },
      });
      refetch();
      if (response?.data.editarAgendamento?.error === "" || response?.data.editarAgendamento?.error === null) {
        // Sucesso
        setShowMessage(response?.data.editarAgendamento?.message || "error");
        setSeverity("success");
        setShowMessageModal(true);
      } else {
        // Erro
        setShowMessage(response?.data.editarAgendamento?.error || "error");
        setSeverity("warning");
        setShowMessageModal(true);
      }
    }  catch (e) {
      console.log(JSON.stringify(error, null, 2));
      const message = e || "Ocorreu algum erro :(";
      setShowMessage("error");
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
      <DialogTitle>Dados do agendamento</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField label="Data do Agendamento" type="date" InputLabelProps={{ shrink: true }} value={date || ""}
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
          Confirmar
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

export default EditarAgendamentoModal;
