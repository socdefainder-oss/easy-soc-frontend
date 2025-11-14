const API_BASE = "https://easy-soc-backend.onrender.com/api";
const TOKEN = localStorage.getItem("token");
const CLIENTE = localStorage.getItem("cliente");

if (!TOKEN || !CLIENTE) {
  window.location.href = "index.html";
}

let incidentes = [];

// Converte risco em severidade
function calcularSeveridade(riscoNum) {
  if (riscoNum >= 80) return "Alta";
  if (riscoNum >= 40) return "Média";
  return "Baixa";
}

function classeSeveridade(sev) {
  const s = sev.toLowerCase();
  if (s === "alta") return "sev-alta";
  if (s === "média" || s === "media") return "sev-media";
  return "sev-baixa";
}

async function carregarIncidentes() {
  try {
    const res = await fetch(`${API_BASE}/resumo/${CLIENTE}`, {
      headers: {
        "Authorization": "Bearer " + TOKEN
      }
    });

    const data = await res.json();

    const maquinas = data.detalhes?.maquinas || [];
    incidentes = [];

    maquinas.forEach((m, idx) => {
      const qtdInc = Number(m.Incidentes || 0);

      if (qtdInc > 0) {
        const riscoNum = Number(m.Riscos || 0);
        const sev = calcularSeveridade(riscoNum);

        incidentes.push({
          id: `${CLIENTE}-${m.Hostname || "Maq"}-${idx + 1}`,
          hostname: m.Hostname || "-",
          status: m.Status || "-",
          risco: riscoNum,
          ultimaAtualizacao: m["ÚltimaAtualização"] || "-",
          severidade: sev,
          raw: m
        });
      }
    });

    console.log("🔎 Incidentes gerados:", incidentes);

    preencherTabela(incidentes);

  } catch (err) {
    console.error("Erro ao carregar incidentes:", err);
  }
}

function preencherTabela(lista) {
  const tbody = document.getElementById("tabela-incidentes");
  tbody.innerHTML = "";

  if (!lista.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6">Nenhum incidente encontrado para este cliente.</td>`;
    tbody.appendChild(tr);
    return;
  }

  lista.forEach(inc => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${inc.id}</td>
      <td>${inc.hostname}</td>
      <td class="${classeSeveridade(inc.severidade)}">${inc.severidade}</td>
      <td>${inc.risco}</td>
      <td>${inc.ultimaAtualizacao}</td>
      <td><button onclick='abrirModal(${JSON.stringify(inc)})'>Ver</button></td>
    `;

    tbody.appendChild(tr);
  });
}

// Busca
document.getElementById("busca-inc").addEventListener("input", e => {
  const texto = e.target.value.toLowerCase();

  const filtrados = incidentes.filter(inc =>
    inc.id.toLowerCase().includes(texto) ||
    inc.hostname.toLowerCase().includes(texto) ||
    (inc.status || "").toLowerCase().includes(texto) ||
    inc.severidade.toLowerCase().includes(texto)
  );

  preencherTabela(filtrados);
});

// Filtro de severidade
document.getElementById("filtro-sev").addEventListener("change", e => {
  const sev = e.target.value; // alta, media, baixa, todas

  if (sev === "todas") {
    preencherTabela(incidentes);
    return;
  }

  const filtrados = incidentes.filter(inc =>
    inc.severidade.toLowerCase().startsWith(sev)
  );

  preencherTabela(filtrados);
});

// Modal
function abrirModal(inc) {
  const m = inc.raw || {};

  document.getElementById("modal-bg").style.display = "flex";

  document.getElementById("modal-conteudo").innerHTML = `
    <p><b>Incidente:</b> ${inc.id}</p>
    <p><b>Máquina:</b> ${inc.hostname}</p>
    <p><b>Status da máquina:</b> ${m.Status || "-"}</p>
    <p><b>Severidade:</b> ${inc.severidade} <span class="tag">Risco: ${inc.risco}</span></p>
    <hr>
    <p><b>IP:</b> ${m.IP || "-"}</p>
    <p><b>Sistema Operacional:</b> ${m.OS || "-"}</p>
    <p><b>Política:</b> ${m.Política || "-"}</p>
    <p><b>Online:</b> ${m.Online || "-"}</p>
    <p><b>Vulnerabilidades:</b> ${m.Vulnerabilidades || 0}</p>
    <p><b>Incidentes na máquina:</b> ${m.Incidentes || 0}</p>
    <p><b>Última atualização:</b> ${m["ÚltimaAtualização"] || "-"}</p>
  `;
}

function fecharModal() {
  document.getElementById("modal-bg").style.display = "none";
}

// Inicia
carregarIncidentes();
