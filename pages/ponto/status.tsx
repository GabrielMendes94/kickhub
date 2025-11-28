import Head from "next/head";
import Link from "next/link";
import { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Stack,
  Container,
} from "@mui/material";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/contexts/AuthContext";
import { usePoints } from "@/hooks/usePoints";

// Componente simples para colorir o status na tabela
function StatusChip({ type }: { type: string }) {
  const colors: Record<string, "success" | "warning" | "info" | "error" | "default"> = {
    entrada: "success",
    pausa: "warning",
    retorno: "info",
    saida: "error",
  };

  return (
    <Chip
      label={type.toUpperCase()}
      color={colors[type] || "default"}
      size="small"
      sx={{ fontWeight: "bold" }}
    />
  );
}

export default function StatusPontoPage() {
  const canRender = useRequireAuth();
  const { logout } = useAuth();
  
  // Pega os pontos reais do LocalStorage
  const { points } = usePoints();

  // Ordena os pontos do mais recente para o mais antigo
  const sortedPoints = useMemo(() => {
    return [...points].sort((a, b) => b.timestamp - a.timestamp);
  }, [points]);

  if (!canRender) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Histórico Completo — KickHub</title>
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
        <Container maxWidth="md">
          <Stack spacing={4}>
            {/* Cabeçalho Simples */}
            <Box sx={{ color: "#fff", textAlign: "center" }}>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                Histórico de Registros
              </Typography>
              <Typography sx={{ opacity: 0.9 }}>
                Visualize todos os registros de ponto salvos neste dispositivo.
              </Typography>
              
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                <Button
                  component={Link}
                  href="/ponto/bater"
                  variant="outlined"
                  sx={{ color: "#fff", borderColor: "#fff", "&:hover": { borderColor: "#eee", bgcolor: "rgba(255,255,255,0.1)" } }}
                >
                  Voltar para o painel
                </Button>
                <Button
                  onClick={() => logout()}
                  variant="contained"
                  sx={{ bgcolor: "#fff", color: "#387d23", "&:hover": { bgcolor: "#f0f0f0" } }}
                >
                  Sair
                </Button>
              </Stack>
            </Box>

            {/* Tabela de Registros */}
            <Card sx={{ borderRadius: 4, boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}>
              <CardContent sx={{ p: 0 }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#f9fafb" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Data</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Horário</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedPoints.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4, color: "text.secondary" }}>
                          Nenhum registro encontrado até o momento.
                        </TableCell>
                      </TableRow>
                    )}
                    {sortedPoints.map((p) => (
                      <TableRow key={p.id} hover>
                        <TableCell>
                          {new Date(p.timestamp).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#1f2937" }}>
                          {new Date(p.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </TableCell>
                        <TableCell>
                          <StatusChip type={p.type} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
}