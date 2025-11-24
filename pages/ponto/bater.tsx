import Head from "next/head";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import type { JSX } from "react";

import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Container,
  Divider,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { clearAuthFlag } from "@/utils/auth";

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

type ActionTileProps = {
  title: string;
  description?: string;
  variant: QuickActionVariant;
  icon?: QuickActionIcon;
  href?: string;
  onClick?: () => void;
};

function ActionTile({ title, description, variant, icon, href, onClick }: ActionTileProps) {
  const content = (
    <Stack
      spacing={0.5}
      alignItems={icon ? "center" : "flex-start"}
      textAlign={icon ? "center" : "left"}
      sx={{ width: "100%" }}
    >
      {icon ? (
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.4)",
            backgroundColor: alpha("#ffffff", 0.18),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 0.5,
            "& svg": {
              width: 26,
              height: 26,
            },
          }}
          aria-hidden="true"
        >
          {actionIcons[icon]}
        </Box>
      ) : null}
      <Typography variant="subtitle1" fontWeight={700} component="strong" sx={{ color: "#ffffff" }}>
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" sx={{ color: alpha("#ffffff", 0.85) }}>
          {description}
        </Typography>
      ) : null}
    </Stack>
  );

  const baseSx = {
    width: "100%",
    borderRadius: 3,
    p: 3,
    color: "#ffffff",
    display: "flex",
    flexDirection: "column" as const,
    gap: 1,
    textDecoration: "none",
    alignItems: icon ? "center" : "flex-start",
    textAlign: icon ? "center" : "left",
    backgroundColor: quickActionColors[variant],
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
    },
  };

  if (href) {
    return (
      <ButtonBase component={Link} href={href} sx={baseSx} focusRipple>
        {content}
      </ButtonBase>
    );
  }

  return (
    <ButtonBase component="button" type="button" onClick={onClick} sx={baseSx} focusRipple>
      {content}
    </ButtonBase>
  );
}

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
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.25)",
                    borderRadius: 50,
                    px: 2,
                    py: 1.5,
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      backgroundColor: "#1f2937",
                      color: "#ffffff",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {loggedUser.initials}
                  </Box>
                  <Box>
                    <Typography fontWeight={600}>{loggedUser.name}</Typography>
                    <Typography variant="body2" sx={{ color: "rgba(17,24,39,0.7)" }}>
                      {loggedUser.role}
                    </Typography>
                  </Box>
                </Stack>

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
                              variant={pauseButtonVariant}
                              icon={isOnBreak ? "retorno" : "pausa"}
                              onClick={handleToggleBreak}
                            />
                          </Box>
                        )}

                        <Box>
                          {action.id === "justificar" ? (
                            <ActionTile
                              title={action.title}
                              description={action.description}
                              variant={action.variant}
                              icon={action.icon}
                              href="/ponto/corrigir"
                            />
                          ) : (
                            <ActionTile
                              title={action.title}
                              description={action.description}
                              variant={action.variant}
                              icon={action.icon}
                            />
                          )}
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
                    <Typography color="text.secondary">
                      Visão rápida das suas marcações
                    </Typography>
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
                      <Box
                        key={stat.id}
                        sx={{
                          borderRadius: 3,
                          border: "1px solid rgba(15,23,42,0.08)",
                          p: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          background: "linear-gradient(180deg, rgba(101,227,63,0.08) 0%, rgba(56,125,35,0.05) 100%)",
                        }}
                      >
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            border: "1px solid rgba(15,23,42,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#387d23",
                            backgroundColor: "#ffffff",
                          }}
                          aria-hidden="true"
                        >
                          {stat.icon}
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {stat.label}
                          </Typography>
                          <Typography variant="h6" fontWeight={700} sx={{ color: "#111827" }}>
                            {stat.value}
                          </Typography>
                        </Box>
                      </Box>
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
                  <Stack spacing={1.5}>
                    {historyEntries.map((entry) => (
                      <Box
                        key={entry.id}
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          justifyContent: "space-between",
                          gap: { xs: 1.5, sm: 2 },
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid rgba(15,23,42,0.08)",
                          alignItems: { xs: "flex-start", sm: "center" },
                          textAlign: { xs: "left", sm: "left" },
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          justifyContent={{ xs: "center", sm: "flex-start" }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              backgroundColor: historyDotColors[entry.type],
                            }}
                            aria-hidden="true"
                          />
                          <Typography fontWeight={600}>{entry.label}</Typography>
                        </Stack>
                        <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>{entry.time}</Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Divider />

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                  >
                    <Typography color="text.secondary">{todaySummary}</Typography>
                    <MuiLink
                      component={Link}
                      href="/ponto/status"
                      underline="none"
                      fontWeight={700}
                      sx={{ color: "#387d23" }}
                    >
                      Ver status completo
                    </MuiLink>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
