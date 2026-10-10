const formulario = document.getElementById("form-login");

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const login = document.getElementById("login").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const mensagem = document.getElementById("mensagem-login");

    if (login === "" || senha === "") {
        mensagem.textContent = "Preencha o login e a senha.";
        return;
    }

    window.location.href = "home.html";
});