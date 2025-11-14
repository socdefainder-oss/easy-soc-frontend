<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Easy SOC — Máquinas</title>

  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">

  <style>
    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      background: #f5f7fb;
      display: flex;
    }

    /* SIDEBAR */
    .sidebar {
      width: 230px;
      height: 100vh;
      background: #1a1f36;
      color: white;
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
    }

    .sidebar a {
      padding: 12px;
      margin-bottom: 8px;
      color: #c7d1e8;
      text-decoration: none;
      border-radius: 6px;
      cursor: pointer;
      display: block;
      font-size: 15px;
      transition: 0.2s;
    }

    .sidebar .active {
      background: #4c8bfd;
      color: white;
    }

    .content {
      margin-left: 250px;
      padding: 25px;
      width: calc(100% - 250px);
    }

    h1 {
      margin-top: 0;
      font-size: 26px;
      margin-bottom: 25px;
    }

    table {
      width: 100%;
      background: white;
      border-radius: 12px;
      padding: 10px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      border-collapse: collapse;
    }

    th, td {
      padding: 12px;
      font-size: 15px;
      border-bottom: 1px solid #eee;
      text-align: left;
    }

    th {
      background: #f0f3f9;
      font-weight: 600;
    }

    .status-ok { color: #28a745; font-weight: bold; }
    .status-risk { color: #ffc107; font-weight: bold; }
    .status-vuln { color: #dc3545; font-weight: bold; }

    .busca-filtros {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    input {
      padding: 10px;
      width: 240px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }

    select {
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }

    /* MODAL */
    .modal-bg {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      justify-content: center;
      align-items: center;
    }

    .modal {
      background: white;
      padding: 25px;
      border-radius: 12px;
      width: 450px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }

    .modal h2 {
      margin-top: 0;
    }

    .close-btn {
      background: #dc3545;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      border: none;
      float: right;
    }
  </style>
</head>

<body>

  <!-- SIDEBAR -->
  <div class="sidebar">
    <h2>Easy SOC</h2>
    <a href="dashboard.html">Dashboard</a>
    <a class="active">Máquinas</a>
    <a id="menu-incidentes">Incidentes</a>
    <a id="menu-config">Configurações</a>
    <a id="menu-sair">Sair</a>
  </div>

  <!-- CONTEÚDO -->
  <div class="content">
    <h1>Máquinas</h1>

    <div class="busca-filtros">
      <input id="busca" type="text" placeholder="Pesquisar máquina...">
      <select id="filtro">
        <option value="todas">Todas</option>
        <option value="seguro">Seguras</option>
        <option value="infectado">Infectadas</option>
        <option value="risco">Com Risco</option>
      </select>
    </div>

    <table>
      <thead>
        <tr>
          <th>Hostname</th>
          <th>Sistema</th>
          <th>Status</th>
          <th>Vulnerabilidades</th>
          <th>Detalhes</th> <!-- ALTERADO AQUI -->
        </tr>
      </thead>
      <tbody id="tabela-maquinas"></tbody>
    </table>
  </div>

  <!-- MODAL -->
  <div id="modal-bg" class="modal-bg">
    <div class="modal">
      <button class="close-btn" onclick="fecharModal()">Fechar</button>
      <h2>Detalhes da Máquina</h2>
      <div id="modal-conteudo"></div>
    </div>
  </div>

  <script src="js/maquinas.js"></script>

</body>

</html>
