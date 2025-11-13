// ======================================================
// DASHBOARD - Easy SOC
// ======================================================

const API_BASE = "https://easy-soc-backend.onrender.com/api";

// pegar cliente salvo no login
const CLIENTE = localStorage.getItem("cliente");

// Verificar login
if (!localStorage.getItem("token") || !CLIENTE) {
  window.location.href = "index.html";
}

// Logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("cliente");
  window.location.href = "index.html";
}

async function carregarDashboard() {
  try {
    console.log("🔍 Buscando dados do cliente:", CLIENTE);

    const response = await fetch(`${API_BASE}/resumo/${CLIENTE}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    });

    if (response.status === 401) {
      logout();
      return;
    }

    const data = await response.json();
    console.log("📊 Dados recebidos:", data);

    // atualizar cards com IDs corretos
    document.getElementById("c-total").innerText = data.maquinasTotais;
    document.getElementById("c-seguras").innerText = data.maquinasSeguras;
    document.getElementById("c-vuln").innerText = data.vulnerabilidades;
    document.getElementById("c-riscos").innerText = data.riscos;
    document.getElementById("c-inc").innerText = data.incidentes;

    criarGrafico(data);

  } catch (err) {
    console.error("❌ Erro ao carregar dashboard:", err);
  }
}

function criarGrafico(data) {
  const ctx = document.getElementById("grafico").getContext("2d");

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
      plugins: { legend: { display: false } }
    }
  });
}

carregarDashboard();
