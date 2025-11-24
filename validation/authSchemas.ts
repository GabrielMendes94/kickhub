import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Informe o e-mail." })
    .email("Digite um e-mail válido."),
  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres." }),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginFormData = {
  email: "",
  password: "",
  rememberMe: false,
};

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, { message: "O nome precisa ter pelo menos 2 caracteres." }),
    lastName: z
      .string()
      .trim()
      .min(2, { message: "O sobrenome precisa ter pelo menos 2 caracteres." }),
    email: z
      .string()
      .trim()
      .min(1, { message: "Informe o e-mail." })
      .email("Digite um e-mail válido."),
    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres." }),
    confirmPassword: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas precisam ser iguais.",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

export const signupDefaultValues: SignupFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const recoverPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Informe o e-mail." })
    .email("Digite um e-mail válido."),
});

export type RecoverPasswordFormData = z.infer<typeof recoverPasswordSchema>;

export const recoverPasswordDefaultValues: RecoverPasswordFormData = {
  email: "",
};
