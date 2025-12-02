// ======================================================
// FALHAS DE SEGURANÇA - MOBILE
// ======================================================

const API_BASE = "https://easy-soc-backend.onrender.com/api";

// Verifica login
if (!localStorage.getItem("token")) {
  window.location.href = "index.html";
}

async function carregarVulnerabilidades() {
  const loading = document.getElementById("loading");
  const listaHtml = document.getElementById("lista-vulnerabilidades");
  const titulo = document.getElementById("titulo-vuln");

  try {
    loading.innerText = "Carregando falhas de segurança...";
    listaHtml.innerHTML = "";

    const res = await fetch(`${API_BASE}/vulnerabilidades`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json();
    const lista = data.vulnerabilidades || [];

    loading.style.display = "none";
    titulo.innerText = `Falhas encontradas: ${lista.length}`;

    if (lista.length === 0) {
      listaHtml.innerHTML = `<p style="color:#666;text-align:center;">Nenhuma falha de segurança encontrada.</p>`;
      return;
    }

    lista.forEach(v => {
      const sev = (v.Severidade || "").toLowerCase();

      let sevClass =
        sev.includes("critical") ? "status-critical" :
        sev.includes("alta") || sev.includes("high") ? "status-high" :
        sev.includes("média") || sev.includes("medium") ? "status-medium" :
        "status-low";

      const card = document.createElement("div");
      card.className = "card-vuln";

      card.innerHTML = `
        <div class="linha"><strong>Tipo da Falha:</strong> <span>${v.CVE}</span></div>
        <div class="linha"><strong>Dispositivo:</strong> <span>${v.Máquina}</span></div>
        <div class="linha"><strong>Nível de Risco:</strong> <span class="${sevClass}">${v.Severidade}</span></div>
        <button class="ver-btn" onclick='abrirModal(${JSON.stringify(v)})'>Ver detalhes</button>
      `;

      listaHtml.appendChild(card);
    });

  } catch (err) {
    console.error("Erro:", err);
    loading.innerText = "Erro ao carregar falhas.";
  }
}

// MODAL
function abrirModal(v) {
  document.getElementById("modal-bg").style.display = "flex";

  document.getElementById("modal-conteudo").innerHTML = `
    <p><b>Tipo da Falha:</b> ${v.CVE}</p>
    <p><b>Dispositivo:</b> ${v.Máquina}</p>
    <p><b>Nível de Risco:</b> ${v.Severidade}</p>
    <p><b>Resumo:</b> ${v.Descrição}</p>
    <p><b>Ação Recomendada:</b> ${v.Detalhes}</p>
  `;
}

function fecharModal() {
  document.getElementById("modal-bg").style.display = "none";
}

carregarVulnerabilidades();
