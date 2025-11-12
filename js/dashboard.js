// ======================================================
// DASHBOARD - Easy SOC
// ======================================================

// URL do backend no Render
const API_BASE = "https://easy-soc-backend.onrender.com/api";

// Cliente fixo por enquanto (depois vamos puxar do login)
const CLIENTE = "alphatech";

// Verificar login
if (!localStorage.getItem("token")) {
  window.location.href = "index.html";
}

// Logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// ------------------------------------------------------
// Função principal: carregar dados do backend
// ------------------------------------------------------
async function carregarDashboard() {
  try {
    console.log("🔍 Buscando dados do cliente:", CLIENTE);

    // Enviar token no header
    const response = await fetch(`${API_BASE}/resumo/${CLIENTE}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    });

    if (response.status === 401) {
      console.warn("🔒 Token inválido ou expirado. Redirecionando para login.");
      logout();
      return;
    }

    if (!response.ok) {
      throw new Error("Erro ao buscar dados");
    }

    const data = await response.json();
    console.log("📊 Dados recebidos:", data);

    // Preencher cards
    document.getElementById("card-total").innerText = data.maquinasTotais;
    document.getElementById("card-seguras").innerText = data.maquinasSeguras;
    document.getElementById("card-vulns").innerText = data.vulnerabilidades;
    document.getElementById("card-riscos").innerText = data.riscos;
    document.getElementById("card-incidentes").innerText = data.incidentes;

    // Mostrar dashboard e esconder loading
    document.getElementById("loading").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    // Gráfico
    criarGrafico(data);

  } catch (err) {
    console.error("❌ Erro ao carregar dashboard:", err);
    document.getElementById("loading").innerText =
      "Erro ao carregar dados. Verifique o backend.";
  }
}

// ------------------------------------------------------
// Criar gráfico VRI (Vulnerabilidades / Riscos / Incidentes)
// ------------------------------------------------------
function criarGrafico(data) {
  const ctx = document.getElementById("chartVRI").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Vulnerabilidades", "Riscos", "Incidentes"],
      datasets: [
        {
          label: "Quantidade",
          data: [data.vulnerabilidades, data.riscos, data.incidentes],
          backgroundColor: ["#0d6efd", "#ffc107", "#dc3545"],
          borderRadius: 10
        }
      ]
    },
    options: {
      plugins: { legend: { display: false } },
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#eee" }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

// Executar ao abrir a página
carregarDashboard();
