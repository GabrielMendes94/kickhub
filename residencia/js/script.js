// Validação cadastro
const formCadastro = document.getElementById('form-cadastro');
if(formCadastro) {
  formCadastro.addEventListener('submit', e => {
    e.preventDefault();

    const senha = document.getElementById('senha-cadastro').value.trim();
    const confirmarSenha = document.getElementById('confirmar-senha').value.trim();

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem! Tente novamente.');
      return;
    }

    alert('Cadastro realizado com sucesso!');
    formCadastro.reset();
  });
}

// Validação login
const formLogin = document.getElementById('form-login');
if(formLogin) {
  formLogin.addEventListener('submit', e => {
    e.preventDefault();

    alert('Login efetuado com sucesso (simulado).');
    formLogin.reset();
  });
}

// Validação recuperar senha
const formRecuperar = document.getElementById('form-recuperar');
if(formRecuperar) {
  formRecuperar.addEventListener('submit', e => {
    e.preventDefault();

    alert('Código de verificação enviado ao email (simulado).');
    formRecuperar.reset();
  });
}