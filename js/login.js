let Email = document.querySelector("#email");
let Password = document.querySelector("#senha");
let btnEntrar = document.querySelector("#btn-entrar");

btnEntrar.addEventListener("click", FazerLogin);

function FazerLogin() {
    let emailDigitado = Email.value.toLowerCase();
    let senhaDigitado = Password.value;

    autenticar(emailDigitado, senhaDigitado)
}

function autenticar(email, senha) {
    const URL = 'http://localhost:3400/login';

    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    })
        .then(response => response = response.json())
        .then(response => {

            if (!!response.mensagem) {
                document.querySelector("#erro-login").innerHTML = response.mensagem;
                Email.focus();
                return;
            }

            mostrarLoading();

            SalvarToken(response.token);
            SalvarUsuario(response.usuario);

            setTimeout(() => {
                window.open('Controle-estoque.html', '_self');
            }, 3000)

        })
        .catch(erro => {
            console.log(erro);
        })

}

function mostrarLoading() {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    const divCaixaLogin = document.querySelector('div.caixa-login');
    divCaixaLogin.style.display = 'none';

}