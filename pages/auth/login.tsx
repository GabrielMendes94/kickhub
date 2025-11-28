import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  Alert, Box, Button, Checkbox, CircularProgress, Divider,
  FormControlLabel, IconButton, Link as MuiLink, Stack, TextField, Typography, Collapse
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginDefaultValues, loginSchema } from "@/validation/authSchemas";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";

export default function Login() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();
  
  const {
    control, handleSubmit, register, formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  async function handleLogin(data: LoginFormData) {
    setLoginError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/ponto/bater");
    } catch (error: any) {
      console.error(error);
      if (['auth/invalid-credential', 'auth/user-not-found', 'auth/wrong-password'].includes(error.code)) {
        setLoginError("E-mail ou senha incorretos.");
      } else {
        setLoginError("Erro ao fazer login. Tente novamente.");
      }
    }
  }

  return (
    <>
      <Head><title>Login — KickHub</title></Head>
      <Box component="main" sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", py: { xs: 4, md: 0 }, px: { xs: 2, md: 0 } }}>
        <Stack direction={{ xs: "column", md: "row" }} sx={{ flex: 1, width: "100%", gap: { xs: 4, md: 0 } }}>
          <Box sx={{ flex: 1, background: "linear-gradient(180deg, #65E33F 0%, #387D23 100%)", color: "#ffffff", p: { xs: 5, sm: 6, md: 10 }, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: { xs: "center", md: "flex-start" }, textAlign: { xs: "center", md: "left" }, gap: 3 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}>Bem-vindo(a)!</Typography>
            <Typography variant="body1" sx={{ maxWidth: 420, color: "rgba(255,255,255,0.9)" }}>Conecte-se para bater seu ponto, corrigir, justificar e acompanhar seu histórico.</Typography>
          </Box>

          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 3, sm: 4, md: 8 } }}>
            <Box component="form" noValidate onSubmit={handleSubmit(handleLogin)} sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", maxWidth: 440, bgcolor: "background.paper", p: { xs: 3, sm: 4 }, borderRadius: 3, boxShadow: { xs: "0 12px 25px rgba(0,0,0,0.08)", md: "0 20px 40px rgba(0,0,0,0.1)" } }}>
              <Box>
                <Typography variant="h2" component="h1" gutterBottom>Fazer Login</Typography>
                <Typography color="text.secondary" fontSize="0.95rem">Acesse com suas credenciais para continuar.</Typography>
              </Box>

              <TextField type="email" label="E-mail" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
              <TextField type="password" label="Senha" {...register("password")} error={!!errors.password} helperText={errors.password?.message} />

              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" gap={1}>
                <Controller name="rememberMe" control={control} render={({ field }) => (
                  <FormControlLabel control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Lembrar de mim" />
                )} />
                <MuiLink component={Link} href="/auth/recuperar-senha" underline="none" color="primary" fontWeight={600} fontSize="0.95rem">Esqueceu a senha?</MuiLink>
              </Stack>

              <Button type="submit" size="large" variant="contained" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}>
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>

              <Collapse in={!!loginError}>
                <Alert severity="error" onClose={() => setLoginError(null)}>{loginError}</Alert>
              </Collapse>

              <Divider>Ou entre com</Divider>
              <Stack direction="row" spacing={2} justifyContent="center">
                <IconButton color="primary" size="large"><GoogleIcon /></IconButton>
                <IconButton color="primary" size="large"><FacebookIcon /></IconButton>
              </Stack>

              <Typography textAlign="center" color="text.secondary">
                Primeira vez aqui? <MuiLink component={Link} href="/auth/cadastro" color="primary" fontWeight={600} underline="none">Crie sua conta</MuiLink>
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
    </>
  );
}