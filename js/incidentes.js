// ======================================================
// INCIDENTES - AGRUPADO POR DISPOSITIVO
// ======================================================

const API_BASE = "https://easy-soc-backend.onrender.com/api";

// Verifica login
if (!localStorage.getItem("token")) {
  window.location.href = "index.html";
}

async function carregarIncidentes() {
  const loading = document.getElementById("loading");
  const listaHtml = document.getElementById("lista-incidentes");
  const titulo = document.getElementById("titulo-incidentes");

  try {
    loading.innerText = "Carregando incidentes de segurança...";
    listaHtml.innerHTML = "";

    const res = await fetch(`${API_BASE}/incidentes`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json();
    const lista = data.incidentes || [];

    loading.style.display = "none";

    if (lista.length === 0) {
      titulo.innerText = "Incidentes de Segurança";
      listaHtml.innerHTML = `<p style="text-align:center;color:#555;">Nenhum incidente encontrado.</p>`;
      return;
    }

    // ------------ 1) AGRUPAR POR DISPOSITIVO ------------
    const porDispositivo = {};

    lista.forEach(i => {
      const nomeMaquina = i.Máquina || i.Maquina || "Dispositivo sem nome";

      if (!porDispositivo[nomeMaquina]) {
        porDispositivo[nomeMaquina] = {
          nome: nomeMaquina,
          totalIncidentes: 0,
          incidentes: []
        };
      }

      porDispositivo[nomeMaquina].totalIncidentes++;
      porDispositivo[nomeMaquina].incidentes.push(i);
    });

    const dispositivos = Object.values(porDispositivo);

    titulo.innerText = "Incidentes de Segurança por Dispositivo";

    // Texto acima dos cards
    const infoDiv = document.createElement("div");
    infoDiv.style.marginBottom = "15px";
    infoDiv.style.color = "#555";
    infoDiv.innerText = `Dispositivos com incidentes registrados: ${dispositivos.length}`;
    listaHtml.appendChild(infoDiv);

    // ------------ 2) GRID DE DISPOSITIVOS (QUADRANTES) ------------
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
    grid.style.gap = "18px";

    dispositivos.forEach(info => {
      const deviceCard = document.createElement("div");
      deviceCard.style.background = "#ffffff";
      deviceCard.style.borderRadius = "14px";
      deviceCard.style.boxShadow = "0 2px 10px rgba(0,0,0,0.08)";
      deviceCard.style.padding = "18px 10px";
      deviceCard.style.textAlign = "center";
      deviceCard.style.cursor = "pointer";
      deviceCard.style.transition = "0.2s";

      deviceCard.onmouseover = () => {
        deviceCard.style.transform = "translateY(-3px)";
        deviceCard.style.boxShadow = "0 4px 14px rgba(0,0,0,0.12)";
      };
      deviceCard.onmouseout = () => {
        deviceCard.style.transform = "none";
        deviceCard.style.boxShadow = "0 2px 10px rgba(0,0,0,0.08)";
      };

      // Ícone igual ao de Falhas/Riscos
      deviceCard.innerHTML = `
        <div style="font-size:40px;margin-bottom:8px;">🖥️</div>
        <div style="font-weight:600;margin-bottom:4px;">
          ${info.nome}
        </div>
        <div style="color:#666;font-size:14px;">
          ${info.totalIncidentes} incidente(s) de segurança
        </div>
      `;

      // Ao clicar, abre modal com incidentes daquele dispositivo
      deviceCard.onclick = () => {
        abrirModalDispositivo(info);
      };

      grid.appendChild(deviceCard);
    });

    listaHtml.appendChild(grid);

  } catch (err) {
    console.error("Erro ao carregar incidentes:", err);
    loading.innerText = "Erro ao carregar incidentes.";
  }
}

// ------------ 3) MODAL COM INCIDENTES DO DISPOSITIVO ------------
function abrirModalDispositivo(infoDispositivo) {
  const modalBg = document.getElementById("modal-bg");
  const modalConteudo = document.getElementById("modal-conteudo");

  let html = `<p><b>Dispositivo:</b> ${infoDispositivo.nome}</p>`;
  html += `<hr style="margin:10px 0;">`;

  infoDispositivo.incidentes.forEach((i, idx) => {
    const status = (i.Status || "").toLowerCase();
    let statusClass =
      status.includes("aberto") ? "status-aberto" :
      status.includes("andamento") ? "status-andamento" :
      "status-fechado";

    html += `
      <div style="margin-bottom:12px;">
        <p><b>Incidente #${idx + 1}</b></p>
        <p><b>Código:</b> ${i.ID || "-"}</p>
        <p><b>Tipo de Incidente:</b> ${i.Tipo || "-"}</p>
        <p><b>Situação:</b> <span class="${statusClass}">${i.Status || "-"}</span></p>
        <p><b>Data/Hora:</b> ${i.Data || "-"}</p>
        <p><b>Resumo:</b> ${i.Detalhes || "-"}</p>
      </div>
      <hr style="margin:10px 0;">
    `;
  });

  modalConteudo.innerHTML = html;
  modalBg.style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal-bg").style.display = "none";
}

carregarIncidentes();
