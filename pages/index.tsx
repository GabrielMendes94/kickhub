import Head from "next/head";
import Link from "next/link";
import { useRef } from "react";
import {
  Box,
  Button,
  Checkbox,
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

export default function Home() {
  const formLoginRef = useRef<HTMLFormElement | null>(null);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    alert("Login efetuado com sucesso (simulado).");
    formLoginRef.current?.reset();
  }

  return (
    <>
      <Head>
        <title>Login — KickHub</title>
        <meta name="description" content="Tela de login" />
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
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{ flex: 1, width: "100%", gap: { xs: 4, md: 0 } }}
        >
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
            <Typography variant="h1" sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}>
              Bem-vindo(a)!
            </Typography>
            <Typography
              variant="body1"
              sx={{ maxWidth: 420, color: "rgba(255,255,255,0.9)" }}
            >
              Conecte-se para bater seu ponto, corrigir, justificar e acompanhar seu histórico.
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
              id="form-login"
              ref={formLoginRef}
              onSubmit={handleLogin}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "100%",
                maxWidth: 440,
                bgcolor: "background.paper",
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                boxShadow: { xs: "0 12px 25px rgba(0,0,0,0.08)", md: "0 20px 40px rgba(0,0,0,0.1)" },
              }}
            >
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
                required
              />

              <TextField
                id="senha-login"
                type="password"
                label="Senha"
                placeholder="Digite sua senha"
                required
              />

              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" gap={1}>
                <FormControlLabel control={<Checkbox id="lembrar-me" color="primary" />} label="Lembrar de mim" />
                <MuiLink
                  component={Link}
                  href="/recuperar-senha"
                  underline="none"
                  color="primary"
                  fontWeight={600}
                  fontSize="0.95rem"
                >
                  Esqueceu a senha?
                </MuiLink>
              </Stack>

              <Button type="submit" size="large" variant="contained">
                Entrar
              </Button>

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
                <MuiLink component={Link} href="/cadastro" color="primary" fontWeight={600} underline="none">
                  Crie sua conta
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
