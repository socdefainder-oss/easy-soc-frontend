// js/login.js
async function login() {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const msg = document.getElementById("msg");

  msg.textContent = "";

  try {
    const response = await fetch("https://easy-soc-backend.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (!response.ok) {
      msg.textContent = data.erro || "Falha no login";
      return;
    }

    // Armazena o token e cliente no navegador
    localStorage.setItem("token", data.token);
    localStorage.setItem("cliente", data.cliente);

    // Redireciona para o dashboard
    window.location.href = "dashboard.html";
  } catch (err) {
    msg.textContent = "Erro de conexão com o servidor.";
    console.error(err);
  }
}
