import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormData,
  loginDefaultValues,
  loginSchema,
} from "@/validation/authSchemas";
import { setAuthFlag } from "@/utils/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { FormSuccessAlert } from "@/components/auth/FormSuccessAlert";

export default function Login() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  async function handleLogin(data: LoginFormData) {
    setSuccessMessage(null);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSuccessMessage(`Login efetuado com sucesso para ${data.email}.`);
    reset();
    setAuthFlag();
    router.push("/ponto/bater");
  }

  return (
    <>
      <Head>
        <title>Login — KickHub</title>
        <meta name="description" content="Tela de login" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <AuthLayout
        hero={<AuthHeroPanel title="Bem-vindo(a)!" description="Conecte-se para bater seu ponto, corrigir, justificar e acompanhar seu histórico." />}
      >
        <AuthFormCard component="form" id="form-login" noValidate onSubmit={handleSubmit(handleLogin)} sx={{ maxWidth: 440 }}>
              <Box>
                <Typography variant="h2" component="h1" gutterBottom>
                  Fazer Login
                </Typography>
                <Typography color="text.secondary" fontSize="0.95rem">
                  Acesse com suas credenciais para continuar.
                </Typography>
              </Box>

              <TextField
                id="email-login"
                type="email"
                label="E-mail"
                placeholder="Digite seu e-mail"
                autoComplete="email"
                {...register("email")}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />

              <TextField
                id="senha-login"
                type="password"
                label="Senha"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                {...register("password")}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />

              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" gap={1}>
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="lembrar-me"
                          color="primary"
                          checked={field.value}
                          onChange={(event) => field.onChange(event.target.checked)}
                        />
                      }
                      label="Lembrar de mim"
                    />
                  )}
                />
                <MuiLink
                  component={Link}
                  href="/auth/recuperar-senha"
                  underline="none"
                  color="primary"
                  fontWeight={600}
                  fontSize="0.95rem"
                >
                  Esqueceu a senha?
                </MuiLink>
              </Stack>

              <Button
                type="submit"
                size="large"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>

              <FormSuccessAlert message={successMessage} onClose={() => setSuccessMessage(null)} />

              <Divider>Ou entre com</Divider>
              <Stack direction="row" spacing={2} justifyContent="center">
                <IconButton color="primary" aria-label="Entrar com Google" size="large">
                  <GoogleIcon />
                </IconButton>
                <IconButton color="primary" aria-label="Entrar com Facebook" size="large">
                  <FacebookIcon />
                </IconButton>
              </Stack>

              <Typography textAlign="center" color="text.secondary">
                Primeira vez aqui?{" "}
                <MuiLink component={Link} href="/auth/cadastro" color="primary" fontWeight={600} underline="none">
                  Crie sua conta
                </MuiLink>
              </Typography>
        </AuthFormCard>
      </AuthLayout>
    </>
  );
}
