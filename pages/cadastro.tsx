import Head from "next/head";
import React, { useRef } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function Cadastro() {
  const formRef = useRef<HTMLFormElement | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const form = formRef.current;
    if (!form) {
      return;
    }

    const formData = new FormData(form);
    const senha = (formData.get("senha") as string)?.trim();
    const confirmar = (formData.get("confirmarSenha") as string)?.trim();

    if (!senha || senha !== confirmar) {
      alert("As senhas não coincidem! Tente novamente.");
      return;
    }

    alert("Cadastro realizado com sucesso!");
    form.reset();
  }

  return (
    <>
      <Head>
        <title>Cadastro — KickHub</title>
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
            <Typography variant="h1" sx={{ fontSize: { xs: "2.2rem", md: "2.7rem" } }}>
              Bem-vindo(a)
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 420, color: "rgba(255,255,255,0.9)" }}>
              Preencha os dados para criar sua conta e começar sua jornada.
            </Typography>
            <Box
              component="img"
              src="/images/personagem1-removebg-preview.png"
              alt="Personagem ilustrativo"
              sx={{ width: { xs: 160, md: 220 }, mt: 4, display: { xs: "none", sm: "block" } }}
            />
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
              id="form-cadastro"
              ref={formRef}
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "100%",
                maxWidth: 520,
                bgcolor: "background.paper",
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                boxShadow: { xs: "0 12px 25px rgba(0,0,0,0.08)", md: "0 20px 40px rgba(0,0,0,0.1)" },
              }}
            >
              <Box>
                <Typography variant="h2" component="h1" gutterBottom>
                  Cadastro
                </Typography>
                <Typography color="text.secondary" fontSize="0.95rem">
                  Crie sua conta para acessar todos os recursos KickHub.
                </Typography>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  id="primeiro-nome"
                  name="primeiroNome"
                  label="Primeiro nome"
                  placeholder="Digite seu primeiro nome"
                  required
                />
                <TextField
                  id="sobrenome"
                  name="sobrenome"
                  label="Sobrenome"
                  placeholder="Digite seu sobrenome"
                  required
                />
              </Stack>

              <TextField
                id="email-cadastro"
                name="email"
                type="email"
                label="E-mail"
                placeholder="Digite seu e-mail"
                required
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  id="senha-cadastro"
                  name="senha"
                  type="password"
                  label="Senha"
                  placeholder="Digite a senha"
                  required
                />
                <TextField
                  id="confirmar-senha"
                  name="confirmarSenha"
                  type="password"
                  label="Confirmar senha"
                  placeholder="Confirme a senha"
                  required
                />
              </Stack>

              <Typography color="text.secondary" fontSize="0.9rem">
                Ao criar uma conta você aceita nossos {" "}
                <MuiLink href="#" underline="none" fontWeight={600}>
                  termos de uso e política de privacidade
                </MuiLink>
                .
              </Typography>

              <Button type="submit" size="large" variant="contained">
                Criar conta
              </Button>

              <Typography textAlign="center" color="text.secondary">
                Já possui uma conta? {" "}
                <MuiLink component={Link} href="/" underline="none">
                  Faça login
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
