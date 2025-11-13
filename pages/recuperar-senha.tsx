import Head from "next/head";
import React, { useRef } from "react";
import Link from "next/link";
import styles from "@/styles/Home.module.css";

export default function RecuperarSenha() {
  const formRef = useRef<HTMLFormElement | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Código de verificação enviado ao email (simulado).");
    formRef.current?.reset();
  }

  return (
    <>
      <Head>
        <title>Recuperar Senha — KickHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.container}>
        <section className={styles.leftSide}>
          <h1>Bem-Vindo(a)</h1>
        </section>

        <section className={styles.rightSide}>
          <h2>Esqueceu a senha?</h2>
          <p className={styles.descricaoRecuperar}>
            Digite seu e-mail para o processo de verificação, enviaremos um código de 4 dígitos para o seu e-mail.
          </p>

          <form id="form-recuperar" ref={formRef} onSubmit={handleSubmit}>
            <div className={styles.inputBox + " " + styles.fullWidth}>
              <div className={styles.inputIcon}>
                <i className="fas fa-envelope"></i>
                <input type="email" id="email-recuperar" placeholder="Digite seu e-mail" required autoComplete="email" />
              </div>
            </div>
            <button type="submit">Continuar</button>
          </form>

          <p className={styles.voltarLogin}>
            <Link href="/">Voltar para Login</Link>
          </p>
        </section>
      </main>
    </>
  );
}
