import Head from "next/head";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { usePoints, PointType } from "@/hooks/usePoints";

const RECIFE_TIMEZONE = "America/Recife";

type QuickActionIcon = "entrada" | "saida" | "pausa" | "retorno" | "justificar";

// --- ÍCONES SVG ---
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

// --- CONFIGURAÇÃO DE CORES ---
const quickActionColors = {
  entrada: "#00a96e",
  pausa: "#d9b36c",
  retorno: "#3b82f6",
  saida: "#f87171",
  justificar: "#60a5fa",
};

const historyDotColors: Record<string, string> = {
  entrada: "#00a96e",
  pausa: "#d9b36c",
  retorno: "#3b82f6",
  saida: "#f87171",
};

// --- COMPONENTE DO BOTÃO (TILE) ---
function ActionTile({ title, description, variant, icon, href, onClick, disabled }: any) {
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
            "& svg": { width: 26, height: 26 },
          }}
        >
          {actionIcons[icon as QuickActionIcon]}
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
    flexDirection: "column",
    gap: 1,
    textDecoration: "none",
    alignItems: icon ? "center" : "flex-start",
    textAlign: icon ? "center" : "left",
    // Cor condicional se estiver desabilitado
    backgroundColor: disabled ? "#9ca3af" : quickActionColors[variant as keyof typeof quickActionColors],
    boxShadow: disabled ? "none" : "0 12px 30px rgba(0,0,0,0.18)",
    opacity: disabled ? 0.7 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: disabled ? "none" : "translateY(-4px)",
    },
  };

  if (href) {
    return (
      <ButtonBase component={Link} href={href} sx={baseSx} focusRipple={!disabled}>
        {content}
      </ButtonBase>
    );
  }

  return (
    <ButtonBase component="button" type="button" onClick={onClick} disabled={disabled} sx={baseSx} focusRipple={!disabled}>
      {content}
    </ButtonBase>
  );
}

// --- UTILITÁRIOS DE HORA ---
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

function formatHistoryTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// --- COMPONENTE DA PÁGINA ---
export default function BaterPontoPage() {
  const { user, logout } = useAuth();
  const canRender = useRequireAuth();
  
  // Hook personalizado de lógica de ponto (LocalStorage)
  const { registerPoint, getTodayPoints, calculateDailySummary } = usePoints();
  
  // Estado do relógio (para evitar erro de hidratação)
  const [recifeTime, setRecifeTime] = useState<string | null>(null);
  const [recifeDate, setRecifeDate] = useState<string | null>(null);

  // Atualiza o relógio no cliente
  useEffect(() => {
    const updateTime = () => {
      setRecifeTime(getRecifeTimeLabel());
      setRecifeDate(getRecifeDateLabel());
    };
    updateTime(); // Chama imediatamente
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dados calculados do dia
  const dailySummary = calculateDailySummary();
  const todayPoints = getTodayPoints();
  
  // Lógica de Estado para Habilitar/Desabilitar botões
  const lastType = dailySummary.lastType;
  // Está trabalhando se bateu Entrada ou Retorno
  const isWorking = lastType === "entrada" || lastType === "retorno";
  // Está em pausa se bateu Pausa
  const isOnBreak = lastType === "pausa";
  // Dia encerrado se bateu Saída (mas permitimos nova entrada se for turno extra)
  const isFinished = lastType === "saida";

  // Textos dinâmicos do botão de pausa
  const pauseButtonLabel = isOnBreak ? "Retornar" : "Iniciar pausa";
  const pauseButtonDescription = isOnBreak ? "Voltar ao trabalho" : "Intervalo de descanso";
  const pauseButtonVariant = isOnBreak ? "retorno" : "pausa";
  const pauseButtonIcon = isOnBreak ? "retorno" : "pausa";

  if (!canRender) return null;

  // Iniciais do usuário logado
  const userInitials = user?.displayName
    ? user.displayName.substring(0, 2).toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || "US";

  return (
    <>
      <Head>
        <title>Ponto — KickHub</title>
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
          <Stack spacing={4}>
            
            {/* CABEÇALHO */}
            <Box
              component="header"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#111827",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
              }}
            >
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  Sistema de Ponto
                </Typography>
                <Typography sx={{ opacity: 0.7 }}>
                  Olá, {user?.displayName?.split(" ")[0] || "Colaborador"}
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 45,
                    height: 45,
                    borderRadius: "50%",
                    bgcolor: "#fff",
                    color: "#387d23",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  {userInitials}
                </Box>
                <Button
                  onClick={logout}
                  variant="contained"
                  sx={{ borderRadius: 20, bgcolor: "#1f2937", textTransform: "none" }}
                >
                  Sair
                </Button>
              </Stack>
            </Box>

            {/* RELÓGIO */}
            <Card sx={{ borderRadius: 4, textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
              <CardContent sx={{ py: 6 }}>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
                  HORÁRIO DE BRASÍLIA
                </Typography>
                <Typography
                  variant="h2"
                  fontWeight={700}
                  sx={{ mt: 1, color: "#1f2937", fontSize: { xs: "3rem", md: "4.5rem" } }}
                >
                  {recifeTime || "--:--:--"}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {recifeDate || "Carregando data..."}
                </Typography>
              </CardContent>
            </Card>

            {/* BOTÕES DE REGISTRO */}
            <Card sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Registrar
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(4, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  {/* Botão ENTRADA: Desabilitado se já está trabalhando ou em pausa */}
                  <ActionTile
                    title="Entrada"
                    description="Iniciar jornada"
                    variant="entrada"
                    icon="entrada"
                    disabled={isWorking || isOnBreak}
                    onClick={() => registerPoint("entrada")}
                  />

                  {/* Botão PAUSA/RETORNO: Desabilitado se não iniciou a jornada ou se já encerrou */}
                  <ActionTile
                    title={pauseButtonLabel}
                    description={pauseButtonDescription}
                    variant={pauseButtonVariant}
                    icon={pauseButtonIcon}
                    disabled={(!isWorking && !isOnBreak) || isFinished}
                    onClick={() => registerPoint(isOnBreak ? "retorno" : "pausa")}
                  />

                  {/* Botão SAÍDA: Desabilitado se não estiver trabalhando */}
                  <ActionTile
                    title="Saída"
                    description="Encerrar dia"
                    variant="saida"
                    icon="saida"
                    disabled={(!isWorking && !isOnBreak) || isFinished}
                    onClick={() => registerPoint("saida")}
                  />

                  {/* Botão JUSTIFICAR: Sempre ativo, leva para outra página */}
                  <ActionTile
                    title="Justificar"
                    description="Correções"
                    variant="justificar"
                    icon="justificar"
                    href="/ponto/corrigir"
                  />
                </Box>
              </CardContent>
            </Card>

            {/* RESUMO E HISTÓRICO */}
            <Card sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
                  
                  {/* Coluna da Esquerda: Resumo */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      Resumo do dia
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={{ p: 2, border: "1px solid #eee", borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Tempo Trabalhado
                        </Typography>
                        <Typography variant="h5" fontWeight={700} sx={{ color: "#387d23" }}>
                          {dailySummary.worked}
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2, border: "1px solid #eee", borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Tempo de Pausa
                        </Typography>
                        <Typography variant="h5" fontWeight={700} sx={{ color: "#d9b36c" }}>
                          {dailySummary.breakTime}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />

                  {/* Coluna da Direita: Lista de Histórico */}
                  <Box sx={{ flex: 2 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      Histórico de hoje
                    </Typography>
                    <Stack spacing={1}>
                      {todayPoints.length === 0 && (
                        <Typography color="text.secondary" variant="body2">
                          Nenhum registro encontrado hoje.
                        </Typography>
                      )}
                      {todayPoints.map((p) => (
                        <Box
                          key={p.id}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            p: 1.5,
                            border: "1px solid #f0f0f0",
                            borderRadius: 2,
                            alignItems: "center",
                          }}
                        >
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                bgcolor: historyDotColors[p.type],
                              }}
                            />
                            <Typography sx={{ textTransform: "capitalize", fontWeight: 600 }}>
                              {p.type}
                            </Typography>
                          </Stack>
                          <Typography fontWeight={600} color="text.secondary">
                            {formatHistoryTime(p.timestamp)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    <Box sx={{ mt: 2, textAlign: "right" }}>
                      <MuiLink
                        component={Link}
                        href="/ponto/status"
                        sx={{ fontWeight: 700, color: "#387d23", textDecoration: "none" }}
                      >
                        Ver histórico completo →
                      </MuiLink>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

          </Stack>
        </Container>
      </Box>
    </>
  );
}