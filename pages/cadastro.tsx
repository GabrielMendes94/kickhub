import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/auth/cadastro",
    permanent: false,
  },
});

export default function CadastroRedirect() {
  return null;
}
