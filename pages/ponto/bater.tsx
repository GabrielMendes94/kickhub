import Head from "next/head";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import type { JSX } from "react";

import { Box, Button, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { clearAuthFlag } from "@/utils/auth";
import { ActionTile } from "@/components/ActionTile";
import { UserBadge } from "@/components/UserBadge";
import { SummaryStatCard } from "@/components/ponto/SummaryStatCard";
import { HistoryList } from "@/components/ponto/HistoryList";

const RECIFE_TIMEZONE = "America/Recife";

type QuickActionIcon = "entrada" | "saida" | "pausa" | "retorno" | "justificar";

type QuickAction = {
  id: string;
  title: string;
  description?: string;
  variant: "entrada" | "pausa" | "saida" | "justificar";
  icon?: QuickActionIcon;
};

const quickActions: QuickAction[] = [
  {
    id: "entrada",
    title: "Entrada",
    description: "Inicie seu expediente com apenas um toque.",
    variant: "entrada",
    icon: "entrada",
  },
  {
    id: "saida",
    title: "Saída",
    description: "Finalize o dia registrando seu horário de saída.",
    variant: "saida",
    icon: "saida",
  },
  {
    id: "justificar",
    title: "Corrigir / Justificar",
    description: "Envie ajustes ou justificativas de ponto.",
    variant: "justificar",
    icon: "justificar",
  },
];

const actionIcons: Record<QuickActionIcon, JSX.Element> = {
  entrada: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h9a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5V3z" />
      <path d="M14 12H4" />
      <path d="M7 9l-3 3 3 3" />
    </svg>
  ),
  pausa: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 5v14" />
      <path d="M16 5v14" />
    </svg>
  ),
  retorno: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12l-3 3 3 3" />
      <path d="M3 15h13a5 5 0 1 0 0-10h-1" />
    </svg>
  ),
  saida: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21h-9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9v18z" />
      <path d="M10 12h10" />
      <path d="M16 15l3-3-3-3" />
    </svg>
  ),
  justificar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3h8l4 4v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M8 7h8" />
      <path d="M8 11h6" />
      <path d="M8 15h8" />
    </svg>
  ),
};

const loggedUser = {
  name: "Gabriel Mendes",
  role: "Colaborador",
  initials: "GM",
};

type HistoryEntryType = "entrada" | "pausa" | "retorno" | "saida";

const historyEntries: Array<{
  id: string;
  label: string;
  time: string;
  type: HistoryEntryType;
}> = [
  { id: "1", label: "Entrada", time: "08:00", type: "entrada" },
  { id: "2", label: "Pausa", time: "12:02", type: "pausa" },
  { id: "3", label: "Retorno", time: "13:05", type: "retorno" },
  { id: "4", label: "Saída", time: "17:02", type: "saida" },
];

type SummaryStat = {
  id: "worked" | "break" | "records";
  label: string;
  value: string;
  icon: JSX.Element;
};

const daySummaryStats: SummaryStat[] = [
  {
    id: "worked",
    label: "Tempo trabalhado",
    value: "08h 12m",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l3 3" />
      </svg>
    ),
  },
  {
    id: "break",
    label: "Tempo de pausa",
    value: "01h 05m",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2h8l1 4h3" />
        <path d="M17 9a5 5 0 0 1-10 0" />
        <path d="M12 14v7" />
        <path d="M9 21h6" />
      </svg>
    ),
  },
  {
    id: "records",
    label: "Registros",
    value: `${historyEntries.length} hoje`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 4h10v16H5V4z" />
        <path d="M9 8h10" />
        <path d="M9 12h10" />
        <path d="M9 16h6" />
      </svg>
    ),
  },
];

type QuickActionVariant = QuickAction["variant"] | "retorno";

const quickActionColors: Record<QuickActionVariant, string> = {
  entrada: "#00a96e",
  pausa: "#d9b36c",
  retorno: "#3b82f6",
  saida: "#f87171",
  justificar: "#60a5fa",
};

const historyDotColors: Record<HistoryEntryType, string> = {
  entrada: "#00a96e",
  pausa: "#d9b36c",
  retorno: "#3b82f6",
  saida: "#f87171",
};

const historyListEntries = historyEntries.map((entry) => ({
  id: entry.id,
  label: entry.label,
  time: entry.time,
  dotColor: historyDotColors[entry.type],
}));

function getRecifeTimeLabel() {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: RECIFE_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}

function getRecifeDateLabel() {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: RECIFE_TIMEZONE,
    weekday: "long",
    day: "2-digit",
    month: "long",
  })
    .format(new Date())
    .replace(/^./, (match) => match.toUpperCase());
}

export default function BaterPontoPage() {
  const router = useRouter();
  const canRender = useRequireAuth();
  const [recifeTime, setRecifeTime] = useState(getRecifeTimeLabel());
  const [recifeDate, setRecifeDate] = useState(getRecifeDateLabel());
  const [isOnBreak, setIsOnBreak] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecifeTime(getRecifeTimeLabel());
      setRecifeDate(getRecifeDateLabel());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const todaySummary = useMemo(() => {
    return `${historyEntries.length} marcações registradas hoje`;
  }, []);

  const pauseButtonLabel = isOnBreak ? "Retornar" : "Iniciar pausa";
  const pauseButtonDescription = isOnBreak
    ? "Clique para encerrar o intervalo e voltar ao trabalho."
    : "Marque o intervalo de almoço sem complicações.";
  const pauseButtonVariant: QuickActionVariant = isOnBreak ? "retorno" : "pausa";

  function handleToggleBreak() {
    setIsOnBreak((prev) => !prev);
  }

  function handleLogout() {
    clearAuthFlag();
    router.push("/auth/login");
  }

  if (!canRender) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard de Ponto — KickHub</title>
      </Head>

      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #65e33f 0%, #387d23 100%)",
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 3 },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={{ xs: 3, md: 4 }}>
            <Box
              component="header"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "space-between",
                gap: 3,
                color: "#111827",
              }}
            >
              <Box>
                <Typography variant="h4" fontWeight={800} component="h1">
                  Sistema de Ponto
                </Typography>
                <Typography sx={{ mt: 0.5, color: "rgba(0,0,0,0.7)" }}>Registrador de trabalho</Typography>
              </Box>

              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <UserBadge initials={loggedUser.initials} name={loggedUser.name} role={loggedUser.role} />

                <Button
                  type="button"
                  onClick={handleLogout}
                  variant="contained"
                  sx={{
                    borderRadius: 999,
                    px: 3,
                    py: 1.2,
                    fontWeight: 600,
                    textTransform: "none",
                    background: "linear-gradient(90deg, #1f2937 0%, #111827 100%)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #111827 0%, #0b1220 100%)",
                    },
                  }}
                >
                  Logout
                </Button>
              </Stack>
            </Box>

            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0px 10px 50px rgba(0,0,0,0.08)",
                textAlign: "center",
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ py: { xs: 4, md: 6 } }}>
                <Typography variant="overline" sx={{ letterSpacing: 4, color: "#6b7280" }}>
                  Horário oficial
                </Typography>
                <Typography
                  variant="h2"
                  fontWeight={700}
                  sx={{
                    fontSize: { xs: "3rem", md: "4.5rem" },
                    mt: 1,
                    mb: 0.5,
                    color: "#1f2937",
                    letterSpacing: -1.5,
                  }}
                >
                  {recifeTime}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "#6b7280" }}>
                  {recifeDate}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 4, boxShadow: "0px 10px 50px rgba(0,0,0,0.08)" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      Registrar ponto
                    </Typography>
                    <Typography color="text.secondary">
                      Use os atalhos para registrar suas marcações ou abrir a tela de justificativa.
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, minmax(0, 1fr))",
                        md: "repeat(3, minmax(0, 1fr))",
                        lg: "repeat(4, minmax(0, 1fr))",
                      },
                      gap: 2,
                    }}
                  >
                    {quickActions.map((action) => (
                      <Fragment key={action.id}>
                        {action.id === "saida" && (
                          <Box>
                            <ActionTile
                              title={pauseButtonLabel}
                              description={pauseButtonDescription}
                              backgroundColor={quickActionColors[pauseButtonVariant]}
                              icon={isOnBreak ? actionIcons.retorno : actionIcons.pausa}
                              onClick={handleToggleBreak}
                            />
                          </Box>
                        )}

                        <Box>
                          <ActionTile
                            title={action.title}
                            description={action.description}
                            backgroundColor={quickActionColors[action.variant]}
                            icon={action.icon ? actionIcons[action.icon] : undefined}
                            href={action.id === "justificar" ? "/ponto/corrigir" : undefined}
                          />
                        </Box>
                      </Fragment>
                    ))}
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 4, boxShadow: "0px 10px 50px rgba(0,0,0,0.08)" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Resumo do dia
                    </Typography>
                    <Typography color="text.secondary">Visão rápida das suas marcações</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, minmax(0, 1fr))",
                        md: "repeat(3, minmax(0, 1fr))",
                      },
                      gap: 2,
                    }}
                  >
                    {daySummaryStats.map((stat) => (
                      <SummaryStatCard key={stat.id} icon={stat.icon} label={stat.label} value={stat.value} />
                    ))}
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 4, boxShadow: "0px 10px 50px rgba(0,0,0,0.08)" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={3}>
                  <Typography variant="h6" fontWeight={700}>
                    Histórico de hoje
                  </Typography>
                  <HistoryList
                    entries={historyListEntries}
                    summaryText={todaySummary}
                    footerLinkLabel="Ver status completo"
                    footerLinkHref="/ponto/status"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
