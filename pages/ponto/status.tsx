import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Link as MuiLink,
  Divider,
} from "@mui/material";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { clearAuthFlag } from "@/utils/auth";

const STATUS_DATA = [
  { date: "2025-11-18", weekday: "Seg", status: "batido", time: "08:02" },
  { date: "2025-11-19", weekday: "Ter", status: "batido", time: "08:05" },
  { date: "2025-11-20", weekday: "Qua", status: "pendente", time: null },
  { date: "2025-11-21", weekday: "Qui", status: "batido", time: "08:11" },
  { date: "2025-11-22", weekday: "Sex", status: "ajuste", time: "07:55" },
  { date: "2025-10-30", weekday: "Qui", status: "batido", time: "08:03" },
];

const MONTH_OPTIONS = [
  { label: "Novembro/2025", value: "2025-11" },
  { label: "Outubro/2025", value: "2025-10" },
];

const STATUS_FILTER_OPTIONS = [
  { label: "Todos", value: "all" },
  { label: "Ponto batido", value: "batido" },
  { label: "Em aberto", value: "pendente" },
  { label: "Aguardando ajuste", value: "ajuste" },
];

function StatusChip({ status }: { status: string }) {
  const config = {
    batido: { label: "Ponto batido", color: "success" as const },
    pendente: { label: "Em aberto", color: "warning" as const },
    ajuste: { label: "Aguardando ajuste", color: "info" as const },
  }[status] ?? { label: status, color: "default" as const };

  return <Chip label={config.label} color={config.color} size="small" />;
}

export default function StatusPontoPage() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState("2025-11");
  const [selectedStatus, setSelectedStatus] = useState<(typeof STATUS_FILTER_OPTIONS)[number]["value"]>("all");
  const canRender = useRequireAuth();

  const handleLogout = () => {
    clearAuthFlag();
    router.push("/auth/login");
  };

  const filteredData = useMemo(() => {
    return STATUS_DATA.filter((item) => {
      const matchesMonth = item.date.startsWith(selectedMonth);
      const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
      return matchesMonth && matchesStatus;
    });
  }, [selectedMonth, selectedStatus]);

  if (!canRender) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Status dos Pontos — KickHub</title>
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
        <Stack spacing={4} sx={{ maxWidth: 1100, mx: "auto" }}>
          <Box sx={{ color: "#fff", textAlign: { xs: "left", md: "center" }, display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="h4" component="h1" fontWeight={800}>
              Status dos pontos
            </Typography>
            <Typography sx={{ opacity: 0.9, maxWidth: 720, mx: { xs: 0, md: "auto" } }}>
              Consulte rapidamente quais dias já foram registrados ou dependem de ajuste.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }} justifyContent={{ xs: "flex-start", md: "center" }}>
              <Button
                component={Link}
                href="/ponto/bater"
                variant="outlined"
                color="inherit"
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.7)",
                  color: "#ffffff",
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: "#ffffff",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Voltar para o painel
              </Button>
              <Button
                variant="contained"
                color="inherit"
                onClick={handleLogout}
                sx={{
                  color: "#1f2937",
                  fontWeight: 700,
                  backgroundColor: "#ffffff",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.85)",
                    color: "#0f172a",
                  },
                }}
              >
                Fazer logout
              </Button>
            </Stack>
          </Box>

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0px 25px 60px rgba(0,0,0,0.18)",
              backgroundColor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 }, display: "flex", flexDirection: "column", gap: 3 }}>
              <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} justifyContent="space-between" spacing={3}>
                <Box>
                  <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>
                    Painel do mês
                  </Typography>
                  <Typography color="text.secondary">
                    Escolha o mês e visualize, em uma única tabela, o status e o horário registrado de cada dia.
                  </Typography>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: "100%", maxWidth: 520 }}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="mes-label">Mês</InputLabel>
                    <Select
                      labelId="mes-label"
                      label="Mês"
                      value={selectedMonth}
                      onChange={(event) => setSelectedMonth(event.target.value)}
                    >
                      {MONTH_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      label="Status"
                      value={selectedStatus}
                      onChange={(event) =>
                        setSelectedStatus(event.target.value as (typeof STATUS_FILTER_OPTIONS)[number]["value"])
                      }
                    >
                      {STATUS_FILTER_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Dia</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Horário registrado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.date} hover>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.weekday}</TableCell>
                      <TableCell>
                        <StatusChip status={item.status} />
                      </TableCell>
                      <TableCell>{item.time ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                  {!filteredData.length && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Nenhum dado para o mês selecionado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Divider sx={{ my: 1.5 }} />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems="center">
                <Typography color="text.secondary" textAlign={{ xs: "center", sm: "left" }}>
                  Precisa registrar ou ajustar algo?
                </Typography>
                <Stack direction="row" spacing={2}>
                  <MuiLink
                    component={Link}
                    href="/ponto/bater"
                    underline="none"
                    fontWeight={700}
                    sx={{ color: "#2e6f1d" }}
                  >
                    Bater ponto
                  </MuiLink>
                  <MuiLink
                    component={Link}
                    href="/ponto/corrigir"
                    underline="none"
                    fontWeight={700}
                    sx={{ color: "#2e6f1d" }}
                  >
                    Corrigir/Justificar
                  </MuiLink>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </>
  );
}
