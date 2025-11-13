import Head from "next/head";
import { useRef } from "react";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

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

      <main className={styles.container}>
        <section className={styles.leftSide}>
          <h1>Bem-Vindo(a) de volta!</h1>
        </section>

        <section className={styles.rightSide}>
          <h2>Fazer Login</h2>
          <form id="form-login" ref={formLoginRef} onSubmit={handleLogin}>
            <div className={styles.inputBox + " " + styles.fullWidth}>
              <label htmlFor="email-login">E-mail</label>
              <div className={styles.inputIcon}>
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  id="email-login"
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>
            </div>

            <div className={styles.inputBox + " " + styles.fullWidth}>
              <label htmlFor="senha-login">Senha</label>
              <div className={styles.inputIcon}>
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  id="senha-login"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>

            <div className={styles.flexBetween}>
              <label htmlFor="lembrar-me">
                <input type="checkbox" id="lembrar-me" /> Lembrar de mim
              </label>
                <Link href="/recuperar-senha">Esqueceu a senha?</Link>
            </div>

            <button type="submit">Entrar</button>

            <div className={styles.socialLogin}>
              <p>Ou entre com:</p>
              <div className={styles.socialButtons}>
                <button type="button" className={styles.google} aria-label="Entrar com Google">
                  <i className="fab fa-google"></i>
                </button>
                <button type="button" className={styles.facebook} aria-label="Entrar com Facebook">
                  <i className="fab fa-facebook-f"></i>
                </button>
              </div>
            </div>

            <p className={styles.createAccount}>
                Primeira vez aqui? <Link href="/cadastro">Crie sua conta</Link>
            </p>
          </form>
        </section>
      </main>
    </>
  );
}
