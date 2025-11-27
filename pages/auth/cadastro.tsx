import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Box, Button, CircularProgress, Link as MuiLink, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignupFormData,
  signupDefaultValues,
  signupSchema,
} from "@/validation/authSchemas";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { FormSuccessAlert } from "@/components/auth/FormSuccessAlert";

export default function Cadastro() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: signupDefaultValues,
  });

  async function handleSignup(data: SignupFormData) {
    setSuccessMessage(null);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSuccessMessage(`Conta criada com sucesso para ${data.firstName}.`);
    reset();
  }

  return (
    <>
      <Head>
        <title>Cadastro — KickHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <AuthLayout
        hero={
          <AuthHeroPanel
            title="Bem-vindo(a)"
            description="Preencha os dados para criar sua conta e começar sua jornada."
            imageSrc="/images/personagem1-removebg-preview.png"
            imageAlt="Personagem ilustrativo"
          />
        }
      >
        <AuthFormCard component="form" id="form-cadastro" noValidate onSubmit={handleSubmit(handleSignup)}>
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
                  label="Primeiro nome"
                  placeholder="Digite seu primeiro nome"
                  autoComplete="given-name"
                  {...register("firstName")}
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName?.message}
                />
                <TextField
                  id="sobrenome"
                  label="Sobrenome"
                  placeholder="Digite seu sobrenome"
                  autoComplete="family-name"
                  {...register("lastName")}
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName?.message}
                />
              </Stack>

              <TextField
                id="email-cadastro"
                type="email"
                label="E-mail"
                placeholder="Digite seu e-mail"
                autoComplete="email"
                {...register("email")}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  id="senha-cadastro"
                  type="password"
                  label="Senha"
                  placeholder="Digite a senha"
                  autoComplete="new-password"
                  {...register("password")}
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                />
                <TextField
                  id="confirmar-senha"
                  type="password"
                  label="Confirmar senha"
                  placeholder="Confirme a senha"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword?.message}
                />
              </Stack>

              <Typography color="text.secondary" fontSize="0.9rem">
                Ao criar uma conta você aceita nossos {" "}
                <MuiLink href="#" underline="none" fontWeight={600}>
                  termos de uso e política de privacidade
                </MuiLink>
                .
              </Typography>

              <Button
                type="submit"
                size="large"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {isSubmitting ? "Enviando..." : "Criar conta"}
              </Button>

              <FormSuccessAlert message={successMessage} onClose={() => setSuccessMessage(null)} />

              <Typography textAlign="center" color="text.secondary">
                Já possui uma conta? {" "}
                <MuiLink component={Link} href="/auth/login" underline="none">
                  Faça login
                </MuiLink>
              </Typography>
        </AuthFormCard>
      </AuthLayout>
    </>
  );
}
