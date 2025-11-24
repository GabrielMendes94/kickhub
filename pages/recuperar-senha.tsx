import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/auth/recuperar-senha",
    permanent: false,
  },
});

export default function RecuperarSenhaRedirect() {
  return null;
}
