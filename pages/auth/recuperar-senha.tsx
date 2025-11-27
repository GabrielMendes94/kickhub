import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Box, Button, CircularProgress, Link as MuiLink, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RecoverPasswordFormData,
  recoverPasswordDefaultValues,
  recoverPasswordSchema,
} from "@/validation/authSchemas";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { FormSuccessAlert } from "@/components/auth/FormSuccessAlert";

export default function RecuperarSenha() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecoverPasswordFormData>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: recoverPasswordDefaultValues,
  });

  async function handleRecover(data: RecoverPasswordFormData) {
    setSuccessMessage(null);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setSuccessMessage(`Enviamos um código para ${data.email}.`);
    reset();
  }

  return (
    <>
      <Head>
        <title>Recuperar Senha — KickHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <AuthLayout
        hero={
          <AuthHeroPanel
            title="Bem-vindo(a)"
            description="Recuperamos o acesso da sua conta em poucos passos. Informe o e-mail cadastrado para receber o código."
          />
        }
      >
        <AuthFormCard component="form" id="form-recuperar" noValidate onSubmit={handleSubmit(handleRecover)} sx={{ maxWidth: 420 }}>
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

              <Button
                type="submit"
                size="large"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {isSubmitting ? "Enviando..." : "Continuar"}
              </Button>

              <FormSuccessAlert message={successMessage} onClose={() => setSuccessMessage(null)} />

              <Typography textAlign="center" color="text.secondary">
                <MuiLink component={Link} href="/auth/login" underline="none">
                  Voltar para login
                </MuiLink>
              </Typography>
        </AuthFormCard>
      </AuthLayout>
    </>
  );
}
