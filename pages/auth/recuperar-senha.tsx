import Head from "next/head";
import Link from "next/link";
import {
  Box,
  Button,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RecoverPasswordFormData,
  recoverPasswordDefaultValues,
  recoverPasswordSchema,
} from "@/validation/authSchemas";

export default function RecuperarSenha() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecoverPasswordFormData>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: recoverPasswordDefaultValues,
  });

  function handleRecover(data: RecoverPasswordFormData) {
    alert(`Código enviado para ${data.email} (simulado).`);
    reset();
  }

  return (
    <>
      <Head>
        <title>Recuperar Senha — KickHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          py: { xs: 4, md: 0 },
          px: { xs: 2, md: 0 },
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} sx={{ flex: 1, gap: { xs: 4, md: 0 } }}>
          <Box
            sx={{
              flex: 1,
              background: "linear-gradient(180deg, #65E33F 0%, #387D23 100%)",
              color: "#ffffff",
              p: { xs: 5, sm: 6, md: 10 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: { xs: "center", md: "flex-start" },
              textAlign: { xs: "center", md: "left" },
              gap: 3,
            }}
          >
            <Typography variant="h1" sx={{ fontSize: { xs: "2.1rem", md: "2.5rem" } }}>
              Bem-vindo(a)
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 420, color: "rgba(255,255,255,0.9)" }}>
              Recuperamos o acesso da sua conta em poucos passos. Informe o e-mail cadastrado para receber o código.
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 3, sm: 4, md: 8 },
            }}
          >
            <Box
              component="form"
              id="form-recuperar"
              noValidate
              onSubmit={handleSubmit(handleRecover)}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "100%",
                maxWidth: 420,
                bgcolor: "background.paper",
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                boxShadow: { xs: "0 12px 25px rgba(0,0,0,0.08)", md: "0 20px 40px rgba(0,0,0,0.1)" },
              }}
            >
              <Box>
                <Typography variant="h2" component="h1" gutterBottom>
                  Esqueceu a senha?
                </Typography>
                <Typography color="text.secondary">
                  Digite seu e-mail para o processo de verificação. Enviaremos um código de 4 dígitos para o seu endereço.
                </Typography>
              </Box>

              <TextField
                id="email-recuperar"
                type="email"
                label="E-mail"
                placeholder="Digite seu e-mail"
                autoComplete="email"
                {...register("email")}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />

              <Button type="submit" size="large" variant="contained" disabled={isSubmitting}>
                Continuar
              </Button>

              <Typography textAlign="center" color="text.secondary">
                <MuiLink component={Link} href="/auth/login" underline="none">
                  Voltar para login
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
