import Head from "next/head";
import React, { useRef } from "react";
import Link from "next/link";
import styles from "@/styles/Home.module.css";

export default function Cadastro() {
  const formRef = useRef<HTMLFormElement | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const senha = (document.getElementById("senha-cadastro") as HTMLInputElement)?.value.trim();
    const confirmar = (document.getElementById("confirmar-senha") as HTMLInputElement)?.value.trim();

    if (senha !== confirmar) {
      alert("As senhas não coincidem! Tente novamente.");
      return;
    }

    alert("Cadastro realizado com sucesso!");
    formRef.current?.reset();
  }

  return (
    <>
      <Head>
        <title>Cadastro — KickHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.container}>
        <section className={styles.leftSide}>
          <h1>Bem-Vindo(a)</h1>
          <p className={styles.subtexto}>Preencha os dados para criar sua conta e começar sua jornada</p>
          <img src="/images/personagem1-removebg-preview.png" alt="Personagem ilustrativo" />
        </section>

        <section className={styles.rightSide}>
          <h2>Cadastro</h2>
          <form id="form-cadastro" ref={formRef} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <div className={styles.inputBox}>
                <label htmlFor="primeiro-nome">Primeiro Nome</label>
                <div className={styles.inputIcon}>
                  <i className="fas fa-user"></i>
                  <input type="text" id="primeiro-nome" placeholder="Digite seu primeiro nome" required />
                </div>
              </div>

              <div className={styles.inputBox}>
                <label htmlFor="sobrenome">Sobrenome</label>
                <div className={styles.inputIcon}>
                  <i className="fas fa-user"></i>
                  <input type="text" id="sobrenome" placeholder="Digite seu sobrenome" required />
                </div>
              </div>
            </div>

            <div className={styles.inputBox + " " + styles.fullWidth}>
              <label htmlFor="email-cadastro">E-mail</label>
              <div className={styles.inputIcon}>
                <i className="fas fa-envelope"></i>
                <input type="email" id="email-cadastro" placeholder="Digite seu e-mail" required />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputBox}>
                <label htmlFor="senha-cadastro">Senha</label>
                <div className={styles.inputIcon}>
                  <i className="fas fa-lock"></i>
                  <input type="password" id="senha-cadastro" placeholder="Digite a senha" required />
                </div>
              </div>
              <div className={styles.inputBox}>
                <label htmlFor="confirmar-senha">Confirmar Senha</label>
                <div className={styles.inputIcon}>
                  <i className="fas fa-lock"></i>
                  <input type="password" id="confirmar-senha" placeholder="Confirme a senha" required />
                </div>
              </div>
            </div>

            <p className={styles.termos}>
              Ao criar uma conta você aceita nossos <a href="#">termos de uso e política de privacidade</a>
            </p>

            <button type="submit">Criar Conta</button>

            <p className={styles.loginLink}>
              Já possui uma conta? <Link href="/">Faça login</Link>
            </p>
          </form>
        </section>
      </main>
    </>
  );
}
