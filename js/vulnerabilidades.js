// ======================================================
// FALHAS DE SEGURANÇA - VISÃO POR DISPOSITIVO
// ======================================================

const API_BASE = "https://easy-soc-backend.onrender.com/api";

// Verifica login
if (!localStorage.getItem("token")) {
  window.location.href = "index.html";
}

let vulnerabilidadesGlobal = [];

// Carrega tudo e monta visão inicial (dispositivos)
async function carregarVulnerabilidades() {
  const loading = document.getElementById("loading");
  const titulo = document.getElementById("titulo-vuln");
  const gridDispositivos = document.getElementById("grid-dispositivos");
  const resumoDispositivos = document.getElementById("resumo-dispositivos");

  const viewDispositivos = document.getElementById("view-dispositivos");
  const viewDetalhes = document.getElementById("view-detalhes");

  viewDispositivos.style.display = "block";
  viewDetalhes.style.display = "none";

  try {
    loading.innerText = "Carregando falhas de segurança...";
    loading.style.display = "block";
    gridDispositivos.innerHTML = "";
    resumoDispositivos.innerText = "Carregando dispositivos com falhas...";

    const res = await fetch(`${API_BASE}/vulnerabilidades`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json();
    const lista = data.vulnerabilidades || [];

    vulnerabilidadesGlobal = lista;

    loading.style.display = "none";

    if (lista.length === 0) {
      titulo.innerText = "Falhas de Segurança";
      resumoDispositivos.innerText = "Nenhuma falha de segurança encontrada.";
      return;
    }

    // Agrupa por dispositivo
    const mapaDispositivos = {};
    lista.forEach(v => {
      const nome = v.Máquina || "Dispositivo sem nome";
      if (!mapaDispositivos[nome]) {
        mapaDispositivos[nome] = 0;
      }
      mapaDispositivos[nome]++;
    });

    const dispositivos = Object.keys(mapaDispositivos);

    titulo.innerText = "Falhas de Segurança por Dispositivo";
    resumoDispositivos.innerText = `Dispositivos com falhas de segurança: ${dispositivos.length}`;

    gridDispositivos.innerHTML = "";

    dispositivos.forEach(nome => {
      const qtd = mapaDispositivos[nome];

      const card = document.createElement("div");
      card.className = "device-card";

      card.innerHTML = `
        <div class="device-icon">🖥️</div>
        <div class="device-name">${nome}</div>
        <div class="device-count">${qtd} falha(s) de segurança</div>
      `;

      card.onclick = () => abrirDispositivo(nome);

      gridDispositivos.appendChild(card);
    });

  } catch (err) {
    console.error("Erro:", err);
    loading.style.display = "block";
    loading.innerText = "Erro ao carregar falhas de segurança.";
  }
}

// Abre a visão de falhas para um dispositivo específico
function abrirDispositivo(nomeDispositivo) {
  const viewDispositivos = document.getElementById("view-dispositivos");
  const viewDetalhes = document.getElementById("view-detalhes");
  const tituloDispositivo = document.getElementById("titulo-dispositivo");
  const listaFalhas = document.getElementById("lista-falhas");
  const loading = document.getElementById("loading");

  viewDispositivos.style.display = "none";
  viewDetalhes.style.display = "block";

  tituloDispositivo.innerText = `Falhas de Segurança no Dispositivo: ${nomeDispositivo}`;
  listaFalhas.innerHTML = "";
  loading.style.display = "none";

  const falhas = vulnerabilidadesGlobal.filter(v => {
    const nome = v.Máquina || "Dispositivo sem nome";
    return nome === nomeDispositivo;
  });

  if (falhas.length === 0) {
    listaFalhas.innerHTML = `<p style="color:#666;text-align:center;">Nenhuma falha encontrada para este dispositivo.</p>`;
    return;
  }

  falhas.forEach(v => {
    const sev = (v.Severidade || "").toLowerCase();

    let sevClass =
      sev.includes("critical") ? "status-critical" :
      sev.includes("alta") || sev.includes("high") ? "status-high" :
      sev.includes("média") || sev.includes("medium") ? "status-medium" :
      "status-low";

    const card = document.createElement("div");
    card.className = "card-vuln";

    card.innerHTML = `
      <div class="linha">
        <strong>Tipo da Falha:</strong>
        <span>${v.CVE || "-"}</span>
      </div>
      <div class="linha">
        <strong>Nível de Risco:</strong>
        <span class="${sevClass}">${v.Severidade || "-"}</span>
      </div>
      <div class="linha">
        <strong>Resumo:</strong>
        <span>${v.Descrição || "-"}</span>
      </div>
      <div class="linha">
        <strong>Ação Recomendada:</strong>
        <span>${v.Detalhes || "-"}</span>
      </div>
    `;

    listaFalhas.appendChild(card);
  });
}

// Voltar para visão de dispositivos
function voltarParaDispositivos() {
  const viewDispositivos = document.getElementById("view-dispositivos");
  const viewDetalhes = document.getElementById("view-detalhes");

  viewDetalhes.style.display = "none";
  viewDispositivos.style.display = "block";
}

// MODAL (opcional, se quiser usar depois)
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

// Inicializa
carregarVulnerabilidades();
