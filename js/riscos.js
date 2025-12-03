// ======================================================
// RISCOS DE SEGURANÇA - VISÃO POR DISPOSITIVO
// ======================================================

const API_BASE = "https://easy-soc-backend.onrender.com/api";

// Verifica login
if (!localStorage.getItem("token")) {
  window.location.href = "index.html";
}

let riscosGlobal = [];

// Carrega tudo e monta visão inicial (dispositivos)
async function carregarRiscos() {
  const loading = document.getElementById("loading");
  const titulo = document.getElementById("titulo-riscos");
  const gridDispositivos = document.getElementById("grid-dispositivos");
  const resumoDispositivos = document.getElementById("resumo-dispositivos");

  const viewDispositivos = document.getElementById("view-dispositivos");
  const viewDetalhes = document.getElementById("view-detalhes");

  viewDispositivos.style.display = "block";
  viewDetalhes.style.display = "none";

  try {
    loading.innerText = "Carregando riscos de segurança...";
    loading.style.display = "block";
    gridDispositivos.innerHTML = "";
    resumoDispositivos.innerText = "Carregando dispositivos com riscos...";

    const res = await fetch(`${API_BASE}/riscos`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json();
    const lista = data.riscos || [];

    riscosGlobal = lista;

    loading.style.display = "none";

    if (lista.length === 0) {
      titulo.innerText = "Riscos de Segurança";
      resumoDispositivos.innerText = "Nenhum risco de segurança encontrado.";
      return;
    }

    // Agrupa por dispositivo
    const mapaDispositivos = {};
    lista.forEach(r => {
      const nome = r.Máquina || "Dispositivo sem nome";
      if (!mapaDispositivos[nome]) {
        mapaDispositivos[nome] = 0;
      }
      mapaDispositivos[nome]++;
    });

    const dispositivos = Object.keys(mapaDispositivos);

    titulo.innerText = "Riscos de Segurança por Dispositivo";
    resumoDispositivos.innerText = `Dispositivos com riscos mapeados: ${dispositivos.length}`;

    gridDispositivos.innerHTML = "";

    dispositivos.forEach(nome => {
      const qtd = mapaDispositivos[nome];

      const card = document.createElement("div");
      card.className = "device-card";

      card.innerHTML = `
        <div class="device-icon">🖥️</div>
        <div class="device-name">${nome}</div>
        <div class="device-count">${qtd} risco(s) de segurança</div>
      `;

      card.onclick = () => abrirDispositivo(nome);

      gridDispositivos.appendChild(card);
    });

  } catch (err) {
    console.error("Erro ao carregar riscos:", err);
    loading.style.display = "block";
    loading.innerText = "Erro ao carregar riscos de segurança.";
  }
}

// Abre a visão de riscos para um dispositivo específico
function abrirDispositivo(nomeDispositivo) {
  const viewDispositivos = document.getElementById("view-dispositivos");
  const viewDetalhes = document.getElementById("view-detalhes");
  const tituloDispositivo = document.getElementById("titulo-dispositivo");
  const listaRiscos = document.getElementById("lista-riscos");
  const loading = document.getElementById("loading");

  viewDispositivos.style.display = "none";
  viewDetalhes.style.display = "block";

  tituloDispositivo.innerText = `Riscos de Segurança no Dispositivo: ${nomeDispositivo}`;
  listaRiscos.innerHTML = "";
  loading.style.display = "none";

  const riscos = riscosGlobal.filter(r => {
    const nome = r.Máquina || "Dispositivo sem nome";
    return nome === nomeDispositivo;
  });

  if (riscos.length === 0) {
    listaRiscos.innerHTML = `<p style="color:#666;text-align:center;">Nenhum risco encontrado para este dispositivo.</p>`;
    return;
  }

  riscos.forEach(r => {
    const nivel = (r.Nível || "").toLowerCase();

    let nivelClass =
      nivel.includes("alto") ? "nivel-alto" :
      nivel.includes("médio") || nivel.includes("medio") ? "nivel-medio" :
      "nivel-baixo";

    const card = document.createElement("div");
    card.className = "card-risco";

    card.innerHTML = `
      <div class="linha">
        <strong>Tipo de Risco:</strong>
        <span>${r.Risco || "-"}</span>
      </div>
      <div class="linha">
        <strong>Dispositivo:</strong>
        <span>${r.Máquina || "-"}</span>
      </div>
      <div class="linha">
        <strong>Nível de Risco:</strong>
        <span class="${nivelClass}">${r.Nível || "-"}</span>
      </div>
      <div class="linha">
        <strong>Resumo:</strong>
        <span>${r.Descrição || "-"}</span>
      </div>
      <div class="linha">
        <strong>Ação Recomendada:</strong>
        <span>${r.Detalhes || "-"}</span>
      </div>
    `;

    listaRiscos.appendChild(card);
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
function abrirModal(r) {
  document.getElementById("modal-bg").style.display = "flex";

  document.getElementById("modal-conteudo").innerHTML = `
    <p><b>Tipo de Risco:</b> ${r.Risco}</p>
    <p><b>Dispositivo:</b> ${r.Máquina}</p>
    <p><b>Nível de Risco:</b> ${r.Nível}</p>
    <p><b>Resumo:</b> ${r.Descrição}</p>
    <p><b>Ação Recomendada:</b> ${r.Detalhes}</p>
  `;
}

function fecharModal() {
  document.getElementById("modal-bg").style.display = "none";
}

// Inicializa
carregarRiscos();
