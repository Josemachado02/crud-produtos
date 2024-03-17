function SalvarToken(token) {
    localStorage.setItem('token', token);
}

function CarregarToken() {
    return localStorage.getItem('token');
}

function SalvarUsuario(usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
}

function CarregarUsuario() {
    return JSON.parse(localStorage.getItem('usuario'));
}

function SairDoSistema() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.open('login.html', '_self');

}