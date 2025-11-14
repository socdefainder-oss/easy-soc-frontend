const API_BASE = "https://easy-soc-backend.onrender.com/api";
const TOKEN = localStorage.getItem("token");
const CLIENTE = localStorage.getItem("cliente");

if (!TOKEN || !CLIENTE) window.location.href = "index.html";

let maquinas = [];

// Carregar dados do backend
async function carregarMaquinas() {
  try {
    const res = await fetch(`${API_BASE}/resumo/${CLIENTE}`, {
      headers: {
        "Authorization": "Bearer " + TOKEN
      }
    });

    const data = await res.json();

    maquinas = data.detalhes.maquinas;

    console.log("🔍 Máquinas recebidas:", maquinas);

    preencherTabela(maquinas);

  } catch (err) {
    console.error("Erro ao carregar máquinas:", err);
  }
}

function preencherTabela(lista) {
  const tbody = document.getElementById("tabela-maquinas");
  tbody.innerHTML = "";

  lista.forEach(m => {
    
    const status = m.Status ? m.Status.toLowerCase() : "desconhecido";

    const statusClass =
      status.includes("seguro") ? "status-ok" :
      status.includes("infect") ? "status-vuln" :
      status.includes("risco") ? "status-risk" :
      "status-vuln";

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${m.Hostname || "-"}</td>
      <td>${m.OS || "-"}</td>
      <td class="${statusClass}">${m.Status || "-"}</td>
      <td>${m.Vulnerabilidades || 0}</td>
      <td><button onclick='abrirModal(${JSON.stringify(m)})'>Ver</button></td>
    `;

    tbody.appendChild(tr);
  });
}

// ----------------------
// Filtros de busca
// ----------------------
document.getElementById("busca").addEventListener("input", e => {
  const texto = e.target.value.toLowerCase();

  const filtradas = maquinas.filter(m =>
    m.Hostname.toLowerCase().includes(texto) ||
    m.OS.toLowerCase().includes(texto) ||
    m.Status.toLowerCase().includes(texto)
  );

  preencherTabela(filtradas);
});

// ----------------------
// Filtro por status
// ----------------------
document.getElementById("filtro").addEventListener("change", e => {
  const filtro = e.target.value;

  if (filtro === "todas") {
    preencherTabela(maquinas);
    return;
  }

  const filtradas = maquinas.filter(m =>
    m.Status.toLowerCase().includes(filtro)
  );

  preencherTabela(filtradas);
});

// ----------------------
// Modal
// ----------------------
function abrirModal(m) {
  document.getElementById("modal-bg").style.display = "flex";

  document.getElementById("modal-conteudo").innerHTML = `
    <p><b>Hostname:</b> ${m.Hostname}</p>
    <p><b>Status:</b> ${m.Status}</p>
    <p><b>IP:</b> ${m.IP}</p>
    <p><b>Sistema Operacional:</b> ${m.OS}</p>
    <p><b>Última Atualização:</b> ${m["ÚltimaAtualização"]}</p>
    <p><b>Vulnerabilidades:</b> ${m.Vulnerabilidades}</p>
    <p><b>Riscos:</b> ${m.Riscos}</p>
    <p><b>Incidentes:</b> ${m.Incidentes}</p>
    <p><b>Política:</b> ${m.Política}</p>
    <p><b>Online:</b> ${m.Online}</p>
  `;
}

function fecharModal() {
  document.getElementById("modal-bg").style.display = "none";
}

carregarMaquinas();

