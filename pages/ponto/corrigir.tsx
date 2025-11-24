import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  Link as MuiLink,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  corrigirPontoDefaultValues,
  corrigirPontoSchema,
  CorrigirPontoFormData,
} from "@/validation/pontoSchemas";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { clearAuthFlag } from "@/utils/auth";

const MOCK_REGISTROS = [
  {
    id: "reg-1",
    date: "2025-11-20",
    time: "08:01",
    status: "Aprovado",
  },
  {
    id: "reg-2",
    date: "2025-11-21",
    time: "08:17",
    status: "Pendente",
  },
  {
    id: "reg-3",
    date: "2025-11-22",
    time: "07:55",
    status: "Aprovado",
  },
];

const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024; // 5MB

const justificarPontoSchema = z.object({
  absenceDate: z.string().min(1, "Informe a data da ausência."),
  reason: z.string().min(10, "Explique o motivo com pelo menos 10 caracteres."),
  attachment: z
    .any()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0]?.size <= MAX_ATTACHMENT_SIZE,
      { message: "O documento deve ter no máximo 5MB." }
    ),
});

type JustificarPontoFormData = {
  absenceDate: string;
  reason: string;
  attachment?: FileList;
};

const justificarPontoDefaultValues: JustificarPontoFormData = {
  absenceDate: "",
  reason: "",
  attachment: undefined,
};

export default function CorrigirPontoPage() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [justificationMessage, setJustificationMessage] = useState<string | null>(null);
  const canRender = useRequireAuth();
  const {
    handleSubmit: handleSubmitCorrection,
    register: registerCorrection,
    reset: resetCorrection,
    watch: watchCorrection,
    formState: { errors: correctionErrors, isSubmitting: isSubmittingCorrection },
    setValue: setCorrectionValue,
  } = useForm<CorrigirPontoFormData>({
    resolver: zodResolver(corrigirPontoSchema),
    defaultValues: corrigirPontoDefaultValues,
  });

  const {
    handleSubmit: handleSubmitJustification,
    register: registerJustification,
    reset: resetJustification,
    watch: watchJustification,
    formState: { errors: justificationErrors, isSubmitting: isSubmittingJustification },
  } = useForm<JustificarPontoFormData>({
    resolver: zodResolver(justificarPontoSchema),
    defaultValues: justificarPontoDefaultValues,
  });

  const watchedRecordId = watchCorrection("recordId");
  const selectedRecord = useMemo(() => {
    return MOCK_REGISTROS.find((reg) => reg.id === watchedRecordId);
  }, [watchedRecordId]);

  const watchedAttachment = watchJustification("attachment");
  const attachmentName = watchedAttachment?.length
    ? watchedAttachment[0]?.name ?? "Documento selecionado"
    : "Nenhum documento selecionado";

  const handleLogout = () => {
    clearAuthFlag();
    router.push("/auth/login");
  };

  async function handleCorrection(_data: CorrigirPontoFormData) {
    setSuccessMessage(null);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setSuccessMessage("Solicitação de correção enviada à gestão.");
    resetCorrection(corrigirPontoDefaultValues);
  }

  async function handleJustification(_data: JustificarPontoFormData) {
    setJustificationMessage(null);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setJustificationMessage("Justificativa registrada para análise.");
    resetJustification(justificarPontoDefaultValues);
  }

  if (!canRender) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Corrigir Ponto — KickHub</title>
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
          <Box sx={{ color: "#ffffff", textAlign: { xs: "left", md: "center" }, display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="h4" component="h1" fontWeight={800}>
              Correções e justificativas
            </Typography>
            <Typography sx={{ opacity: 0.9, maxWidth: 720, mx: { xs: 0, md: "auto" } }}>
              Ajuste registros incorretos, envie justificativas e acompanhe suas solicitações.
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

          <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
            <Card
              sx={{
                flex: 1,
                borderRadius: 4,
                boxShadow: "0px 25px 60px rgba(0,0,0,0.18)",
                backgroundColor: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(8px)",
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4 }, display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>
                    Corrigir ponto
                  </Typography>
                  <Typography color="text.secondary">
                    Escolha o registro e informe o novo horário com a justificativa adequada.
                  </Typography>
                </Box>

                <Box component="form" noValidate onSubmit={handleSubmitCorrection(handleCorrection)} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <FormControl fullWidth error={Boolean(correctionErrors.recordId)}>
                    <InputLabel id="registro-label">Registro</InputLabel>
                    <Select
                      labelId="registro-label"
                      label="Registro"
                      value={watchedRecordId ?? ""}
                      onChange={(event) => setCorrectionValue("recordId", event.target.value, { shouldValidate: true })}
                    >
                      <MenuItem value="">
                        <em>Selecione</em>
                      </MenuItem>
                      {MOCK_REGISTROS.map((registro) => (
                        <MenuItem key={registro.id} value={registro.id}>
                          {registro.date} às {registro.time} ({registro.status})
                        </MenuItem>
                      ))}
                    </Select>
                    {correctionErrors.recordId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {correctionErrors.recordId.message}
                      </Typography>
                    )}
                  </FormControl>

                  <Collapse in={Boolean(selectedRecord)}>
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      Registro selecionado: {selectedRecord?.date} às {selectedRecord?.time} — {selectedRecord?.status}
                    </Alert>
                  </Collapse>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      label="Nova data"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      {...registerCorrection("newDate")}
                      error={Boolean(correctionErrors.newDate)}
                      helperText={correctionErrors.newDate?.message}
                    />
                    <TextField
                      label="Novo horário"
                      type="time"
                      InputLabelProps={{ shrink: true }}
                      {...registerCorrection("newTime")}
                      error={Boolean(correctionErrors.newTime)}
                      helperText={correctionErrors.newTime?.message}
                    />
                  </Stack>

                  <TextField
                    label="Justificativa"
                    multiline
                    minRows={4}
                    placeholder="Explique o motivo da correção"
                    {...registerCorrection("reason")}
                    error={Boolean(correctionErrors.reason)}
                    helperText={correctionErrors.reason?.message}
                  />

                  <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    disabled={isSubmittingCorrection}
                    startIcon={isSubmittingCorrection ? <CircularProgress size={18} color="inherit" /> : null}
                    sx={{
                      background: "linear-gradient(90deg, #65e33f 0%, #387d23 100%)",
                      color: "#ffffff",
                      fontWeight: 700,
                      boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #58d034 0%, #2e6f1d 100%)",
                      },
                    }}
                  >
                    {isSubmittingCorrection ? "Enviando..." : "Enviar correção"}
                  </Button>

                  <Collapse in={Boolean(successMessage)}>
                    <Alert severity="success" onClose={() => setSuccessMessage(null)} sx={{ borderRadius: 2 }}>
                      {successMessage}
                    </Alert>
                  </Collapse>
                </Box>
              </CardContent>
            </Card>

            <Card
              sx={{
                flex: 1,
                borderRadius: 4,
                boxShadow: "0px 25px 60px rgba(0,0,0,0.18)",
                backgroundColor: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(8px)",
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4 }, display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography variant="h5" component="h2" fontWeight={700} gutterBottom>
                    Justificar ausência
                  </Typography>
                  <Typography color="text.secondary">
                    Informe a data, descreva o motivo e anexe um documento para acelerar a aprovação.
                  </Typography>
                </Box>

                <Box component="form" noValidate onSubmit={handleSubmitJustification(handleJustification)} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <TextField
                    label="Data da ocorrência"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...registerJustification("absenceDate")}
                    error={Boolean(justificationErrors.absenceDate)}
                    helperText={justificationErrors.absenceDate?.message}
                  />

                  <TextField
                    label="Detalhes da justificativa"
                    multiline
                    minRows={4}
                    placeholder="Conte-nos o que aconteceu"
                    {...registerJustification("reason")}
                    error={Boolean(justificationErrors.reason)}
                    helperText={justificationErrors.reason?.message}
                  />

                  <Stack spacing={1}>
                    <Button
                      component="label"
                      variant="outlined"
                      color="inherit"
                      sx={{
                        alignSelf: { xs: "stretch", sm: "flex-start" },
                        borderColor: "rgba(56, 125, 35, 0.5)",
                        color: "#1f2937",
                        fontWeight: 600,
                        "&:hover": {
                          borderColor: "#2e6f1d",
                          backgroundColor: "rgba(56, 125, 35, 0.08)",
                        },
                      }}
                    >
                      Anexar documento
                      <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" {...registerJustification("attachment")} />
                    </Button>
                    <Typography variant="caption" color="text.secondary">
                      {attachmentName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Formatos aceitos: PDF, JPG ou PNG (até 5MB).
                    </Typography>
                    {justificationErrors.attachment && (
                      <Typography variant="caption" color="error">
                        {justificationErrors.attachment.message}
                      </Typography>
                    )}
                  </Stack>

                  <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    disabled={isSubmittingJustification}
                    startIcon={isSubmittingJustification ? <CircularProgress size={18} color="inherit" /> : null}
                    sx={{
                      background: "linear-gradient(90deg, #65e33f 0%, #387d23 100%)",
                      color: "#ffffff",
                      fontWeight: 700,
                      boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #58d034 0%, #2e6f1d 100%)",
                      },
                    }}
                  >
                    {isSubmittingJustification ? "Enviando..." : "Enviar justificativa"}
                  </Button>

                  <Collapse in={Boolean(justificationMessage)}>
                    <Alert severity="success" onClose={() => setJustificationMessage(null)} sx={{ borderRadius: 2 }}>
                      {justificationMessage}
                    </Alert>
                  </Collapse>
                </Box>
              </CardContent>
            </Card>
          </Stack>

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0px 25px 60px rgba(0,0,0,0.18)",
              backgroundColor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(8px)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Typography variant="h6" gutterBottom>
                Registros recentes
              </Typography>
              <List>
                {MOCK_REGISTROS.map((registro, index) => (
                  <Box key={registro.id}>
                    <ListItem
                      disableGutters
                      secondaryAction={
                        <Typography color={registro.status === "Aprovado" ? "success.main" : registro.status === "Pendente" ? "warning.main" : "text.secondary"}>
                          {registro.status}
                        </Typography>
                      }
                    >
                      <ListItemText primary={`${registro.date} às ${registro.time}`} secondary={`ID: ${registro.id}`} />
                    </ListItem>
                    {index < MOCK_REGISTROS.length - 1 && <Divider component="li" />}
                  </Box>
                ))}
              </List>
              <Typography variant="body2" color="text.secondary">
                Precisa apenas registrar um novo ponto? <MuiLink component={Link} href="/ponto/bater" underline="none" color="#2e6f1d">Clique aqui.</MuiLink>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quer verificar o status completo das marcações? <MuiLink component={Link} href="/ponto/status" underline="none" color="#2e6f1d">Acesse o painel de status.</MuiLink>
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </>
  );
}
