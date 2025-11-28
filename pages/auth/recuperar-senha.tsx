import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import {
  Alert, Box, Button, CircularProgress, Link as MuiLink,
  Stack, TextField, Typography, Collapse
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RecoverPasswordFormData, recoverPasswordDefaultValues, recoverPasswordSchema } from "@/validation/authSchemas";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function RecuperarSenha() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    handleSubmit, register, reset, formState: { errors, isSubmitting },
  } = useForm<RecoverPasswordFormData>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: recoverPasswordDefaultValues,
  });

  async function handleRecover(data: RecoverPasswordFormData) {
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setSuccessMessage(`Enviamos um link de recuperação para ${data.email}.`);
      reset();
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setErrorMessage("Usuário não encontrado.");
      } else {
        setErrorMessage("Erro ao enviar email. Tente novamente.");
      }
    }
  }

  return (
    <>
      <Head><title>Recuperar Senha — KickHub</title></Head>
      <Box component="main" sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", py: { xs: 4, md: 0 }, px: { xs: 2, md: 0 } }}>
        <Stack direction={{ xs: "column", md: "row" }} sx={{ flex: 1, gap: { xs: 4, md: 0 } }}>
          <Box sx={{ flex: 1, background: "linear-gradient(180deg, #65E33F 0%, #387D23 100%)", color: "#ffffff", p: { xs: 5, sm: 6, md: 10 }, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: { xs: "center", md: "flex-start" }, textAlign: { xs: "center", md: "left" }, gap: 3 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: "2.1rem", md: "2.5rem" } }}>Bem-vindo(a)</Typography>
            <Typography variant="body1" sx={{ maxWidth: 420, color: "rgba(255,255,255,0.9)" }}>Recuperamos o acesso da sua conta em poucos passos.</Typography>
          </Box>

          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 3, sm: 4, md: 8 } }}>
            <Box component="form" noValidate onSubmit={handleSubmit(handleRecover)} sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", maxWidth: 420, bgcolor: "background.paper", p: { xs: 3, sm: 4 }, borderRadius: 3, boxShadow: { xs: "0 12px 25px rgba(0,0,0,0.08)", md: "0 20px 40px rgba(0,0,0,0.1)" } }}>
              <Box>
                <Typography variant="h2" component="h1" gutterBottom>Esqueceu a senha?</Typography>
                <Typography color="text.secondary">Digite seu e-mail para receber o link de recuperação.</Typography>
              </Box>

              <TextField type="email" label="E-mail" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />

              <Button type="submit" size="large" variant="contained" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}>
                {isSubmitting ? "Enviando..." : "Continuar"}
              </Button>

              <Collapse in={!!successMessage}>
                <Alert severity="success" onClose={() => setSuccessMessage(null)}>{successMessage}</Alert>
              </Collapse>
              <Collapse in={!!errorMessage}>
                <Alert severity="error" onClose={() => setErrorMessage(null)}>{errorMessage}</Alert>
              </Collapse>

              <Typography textAlign="center" color="text.secondary">
                <MuiLink component={Link} href="/auth/login" underline="none">Voltar para login</MuiLink>
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
    </>
  );
}