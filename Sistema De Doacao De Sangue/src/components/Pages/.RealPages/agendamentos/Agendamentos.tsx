import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import useTheme from "../../../hooks/useTheme";
import variants from "../../../theme/variants";

import { decryptCookieValue } from "../../../../utils/jwt";
import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { addHours, parseISO } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/dist/locale/pt-br'
import moment from "moment";
import "moment/locale/pt-br";
import EditarAgendamentoModal from "../../../Modal/EditarAgendamentoModal";


const GET_AGENDAMENTOS = gql`
  query getagendamentos($codUser: Int!) {
    agendamentos(codUser: $codUser) {
        id
        obs
        data
        criadoEm
        atualizadoEm
        status
        hora
        doadorId
        hemocentroId
    }
  }
`;

interface Agendamento {
    id: number;
    obs: string;
    data: string; // ou Date se você preferir
    criadoEm: string;
    atualizadoEm: string;
    status: string;
    hora: string; // ou Date se você preferir
    doadorId: number;
    hemocentroId: number;
  }

  interface Event {
    id: number;
    title: string;
    hora: String;
    start: Date; // ou string se você preferir
    end: Date;   // ou string se você preferir
  }

  const localizer = momentLocalizer(moment);
// console.log(localizer)

const convertISOToTime = (isoDuration: string) => {
  const hoursMatch = isoDuration.match(/PT(\d+)H/);
  const minutesMatch = isoDuration.match(/(\d+)M/);
  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

  // Formatar a hora e minutos no formato "HH:mm"
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };
    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };
    const goToCurrent = () => {
        toolbar.onNavigate('TODAY');
    };

    return (
        <Box className="toolbar">
            <Button 
                variant="contained" color="primary"
                onClick={goToBack}
                sx={{margin: "5px"}}
            >
                Anterior
            </Button>
            <Button 
                variant="contained" color="primary"
                onClick={goToCurrent}
                sx={{margin: "5px"}}
            >
                Hoje
            </Button>
            <Button 
                variant="contained" color="primary"
                onClick={goToNext}
                sx={{margin: "5px"}}
            >
                Próximo
            </Button>
        </Box>
    );
};

function Agendamentos() {

  const [events, setEvents] = useState<Event[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const { theme } = useTheme();

  const selectedVariant = variants.find(
    (variant: any) => variant.name === theme
  );

  const codUser = decryptCookieValue();

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setModalOpen(true); // Abre o modal
  };

  const handleModalClose = () => {
    setSelectedEvent(null);
    setModalOpen(false); // Fecha o modal
  };

  const [CarregarAgendamentos, { loading, error, data, refetch }] = useLazyQuery(GET_AGENDAMENTOS);

  useEffect(() => {
    if (codUser) {
        CarregarAgendamentos({ variables: { codUser } });
    }
  }, [codUser, CarregarAgendamentos]);

  useEffect(() => {
    if (data && data.agendamentos) {
        setAgendamentos(data.agendamentos); // Armazena os dados recebidos no estado
    }
}, [data]); // Dependência apenas do 'data'

  const CustomCard = styled(Card)(({ theme }) => ({
    //borderColor: theme.palette.cardConfig.main,
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
  }));

  const convertDurationToHours = (duration:any) => {
    const hoursMatch = duration.match(/PT(\d+)H/);
    return hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  };


      // Função para estilizar eventos
      const eventStyleGetter = (event: Event) => {
        const style = {
        };
        return {
            style
        };
    };

  useEffect(() => {
    if (agendamentos.length > 0) {
      const formattedEvents = agendamentos.map(agendamento => {
        const startDateTime = agendamento.data; // Formato ISO já está correto
        const durationHours = convertDurationToHours(agendamento.hora); // Converte a duração para horas
  
        return {
          coduser: codUser,
          data: agendamento.data,
          id: agendamento.id,
          hora: agendamento.hora,
          obs: agendamento.obs,
          title: `${convertISOToTime(agendamento.hora)} Agendamento ${agendamento.id} - ${agendamento.obs}`,
          start: parseISO(startDateTime), // Começo da data
          end: addHours(parseISO(startDateTime), durationHours), // Adiciona as horas à data
        };
      });
      setEvents(formattedEvents);
    }
  }, [agendamentos]); // Dependência de 'agendamentos'

  return (
    <Grid container justifyContent="center" spacing={3}>
      <Grid item xs={12} textAlign="center">
        <Typography fontSize={32} variant="h4">Agendamentos</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {loading ? (
              <Typography>Carregando...</Typography>
            ) : (
              <Box>
                <Calendar
                  localizer={localizer}
                  events={events}
                  formats={{
                    agendaDateFormat: "DD/MM ddd",
                    weekdayFormat: "dddd"
                  }}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600 }}
                  popup
                  selectable
                  components={{
                    toolbar: CustomToolbar // Passando o componente personalizado para a toolbar
                }}
                  views={['month']}
                  messages={{
                    date: "Data",
                    time: "Hora",
                    event: "Evento",
                    allDay: "Dia Todo",
                    week: "Semana",
                    work_week: "Eventos",
                    day: "Dia",
                    month: "Mês",
                    previous: "Anterior",
                    next: "Próximo",
                    yesterday: "Ontem",
                    tomorrow: "Amanhã",
                    today: "Hoje",
                    agenda: "Agenda",
                    noEventsInRange: "Não há eventos no período.",
                    showMore: function showMore(total) {
                      return "+" + total + " mais";
                    }
                  }}
                  dayPropGetter={(date) => {
                    const style = {};
                    const today = moment().startOf('day'); // Obtém a data de hoje
                    const isToday = moment(date).isSame(today, 'day');
                    const currentMonth = moment().month();
                    const isPreviousMonth = moment(date).month() < currentMonth;
                
                    if (isToday) {
                        // Cor do dia atual
                        style.backgroundColor = theme != "DEFAULT" && "#3A5E7D"; // Altere para a cor que você preferir
                        style.color = "#FFF"; // Cor do texto
                    } else if (isPreviousMonth) {
                        // Cor dos dias do mês anterior
                        style.backgroundColor = theme === "DEFAULT" ? "#d3d3d3" : "#3A5E8D"; // Cor para os dias do mês anterior
                        style.color = "#A9A9A9"; // Cor do texto em cinza escuro para indicar desabilitado
                        style.opacity = 0.3; // Opacidade para dar o efeito de desabilitado
                    }
                
                    return { style };
                }}
                  onSelectEvent={event => handleEventClick(event)}
                  onSelectSlot={slotInfo => alert(`Data selecionada: ${slotInfo.start}`)} // Exibe data selecionada
                />
                {selectedEvent && (
                  <EditarAgendamentoModal
                      open={modalOpen}
                      onClose={handleModalClose}
                      selectedEvent={selectedEvent}
                      refetch={refetch}
                  />
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Agendamentos;
