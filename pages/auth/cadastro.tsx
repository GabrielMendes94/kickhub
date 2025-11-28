import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  Alert, Box, Button, CircularProgress, Link as MuiLink,
  Stack, TextField, Typography, Collapse
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormData, signupDefaultValues, signupSchema } from "@/validation/authSchemas";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Cadastro() {
  const router = useRouter();
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: signupDefaultValues,
  });

  async function handleSignup(data: SignupFormData) {
    setFirebaseError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      // Atualiza o perfil com o nome completo
      await updateProfile(userCredential.user, {
        displayName: `${data.firstName} ${data.lastName}`.trim()
      });
      router.push("/ponto/bater");
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        setFirebaseError("Este e-mail já está em uso.");
      } else {
        setFirebaseError("Ocorreu um erro ao criar a conta.");
      }
    }
  }

  return (
    <>
      <Head>
        <title>Cadastro — KickHub</title>
      </Head>
      <Box component="main" sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", py: { xs: 4, md: 0 }, px: { xs: 2, md: 0 } }}>
        <Stack direction={{ xs: "column", md: "row" }} sx={{ flex: 1, gap: { xs: 4, md: 0 } }}>
          <Box sx={{ flex: 1, background: "linear-gradient(180deg, #65E33F 0%, #387D23 100%)", color: "#ffffff", p: { xs: 5, sm: 6, md: 10 }, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: { xs: "center", md: "flex-start" }, textAlign: { xs: "center", md: "left" }, gap: 3 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: "2.2rem", md: "2.7rem" } }}>Bem-vindo(a)</Typography>
            <Typography variant="body1" sx={{ maxWidth: 420, color: "rgba(255,255,255,0.9)" }}>Preencha os dados para criar sua conta e começar sua jornada.</Typography>
          </Box>

          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 3, sm: 4, md: 8 } }}>
            <Box component="form" noValidate onSubmit={handleSubmit(handleSignup)} sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", maxWidth: 520, bgcolor: "background.paper", p: { xs: 3, sm: 4 }, borderRadius: 3, boxShadow: { xs: "0 12px 25px rgba(0,0,0,0.08)", md: "0 20px 40px rgba(0,0,0,0.1)" } }}>
              <Box>
                <Typography variant="h2" component="h1" gutterBottom>Cadastro</Typography>
                <Typography color="text.secondary" fontSize="0.95rem">Crie sua conta para acessar todos os recursos KickHub.</Typography>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField label="Primeiro nome" {...register("firstName")} error={!!errors.firstName} helperText={errors.firstName?.message} fullWidth />
                <TextField label="Sobrenome" {...register("lastName")} error={!!errors.lastName} helperText={errors.lastName?.message} fullWidth />
              </Stack>

              <TextField type="email" label="E-mail" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField type="password" label="Senha" {...register("password")} error={!!errors.password} helperText={errors.password?.message} fullWidth />
                <TextField type="password" label="Confirmar senha" {...register("confirmPassword")} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} fullWidth />
              </Stack>

              <Button type="submit" size="large" variant="contained" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}>
                {isSubmitting ? "Enviando..." : "Criar conta"}
              </Button>

              <Collapse in={!!firebaseError}>
                <Alert severity="error" onClose={() => setFirebaseError(null)}>{firebaseError}</Alert>
              </Collapse>

              <Typography textAlign="center" color="text.secondary">
                Já possui uma conta? <MuiLink component={Link} href="/auth/login" underline="none">Faça login</MuiLink>
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
    </>
  );
}