(function () {
  function ensureViewportFitCover() {
    var viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return;

    var content = viewport.getAttribute("content") || "";
    if (content.indexOf("viewport-fit=cover") === -1) {
      viewport.setAttribute("content", content + ", viewport-fit=cover");
    }
  }

  function injectMobileStyles() {
    if (document.getElementById("mobile-layout-style")) return;

    var style = document.createElement("style");
    style.id = "mobile-layout-style";
    style.textContent = [
      ":root { --safe-top: env(safe-area-inset-top, 0px); }",
      "@media (max-width: 820px) {",
      "  body { padding-top: 0; }",
      "  .topbar {",
      "    position: sticky;",
      "    top: 0;",
      "    z-index: 1200;",
      "    min-height: calc(56px + var(--safe-top));",
      "    height: auto;",
      "    padding-top: var(--safe-top) !important;",
      "    padding-left: 12px !important;",
      "    padding-right: 12px !important;",
      "    gap: 10px;",
      "  }",
      "  .topbar-controls {",
      "    display: flex;",
      "    align-items: center;",
      "    gap: 6px;",
      "    flex: 0 0 auto;",
      "  }",
      "  .topbar-title {",
      "    flex: 1 1 auto;",
      "    min-width: 0;",
      "    text-align: center;",
      "    font-size: 17px !important;",
      "    white-space: nowrap;",
      "    overflow: hidden;",
      "    text-overflow: ellipsis;",
      "    margin-right: 28px;",
      "  }",
      "  .hamburger, .back-btn {",
      "    width: 36px;",
      "    height: 36px;",
      "    border: 0;",
      "    border-radius: 9px;",
      "    display: inline-flex;",
      "    align-items: center;",
      "    justify-content: center;",
      "    font-size: 23px;",
      "    line-height: 1;",
      "    color: #fff;",
      "    background: rgba(255,255,255,0.14);",
      "    cursor: pointer;",
      "    margin: 0 !important;",
      "    padding: 0;",
      "    -webkit-tap-highlight-color: transparent;",
      "  }",
      "  .back-btn { font-size: 20px; }",
      "  .content, .content-wrapper { padding-top: 14px; }",
      "}",
    ].join("\n");

    document.head.appendChild(style);
  }

  function fallbackRoute() {
    var file = (location.pathname.split("/").pop() || "").toLowerCase();
    if (!file || file === "index.html") return "index.html";
    return "dashboard.html";
  }

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = fallbackRoute();
  }

  function enhanceTopbar() {
    var topbar = document.querySelector(".topbar");
    if (!topbar) return;

    var hamburger = topbar.querySelector(".hamburger");
    var title = topbar.querySelector(".topbar-title");

    if (!hamburger || !title) return;

    if (hamburger.tagName !== "BUTTON") {
      var menuBtn = document.createElement("button");
      menuBtn.className = "hamburger";
      menuBtn.type = "button";
      menuBtn.setAttribute("aria-label", "Abrir menu");
      menuBtn.textContent = hamburger.textContent || "☰";

      var inlineOnclick = hamburger.getAttribute("onclick");
      if (inlineOnclick) {
        menuBtn.setAttribute("onclick", inlineOnclick);
      } else {
        menuBtn.addEventListener("click", function () {
          if (typeof window.abrirMenu === "function") {
            window.abrirMenu();
          }
        });
      }

      hamburger.replaceWith(menuBtn);
      hamburger = menuBtn;
    }

    if (!topbar.querySelector(".back-btn")) {
      var backBtn = document.createElement("button");
      backBtn.className = "back-btn";
      backBtn.type = "button";
      backBtn.setAttribute("aria-label", "Voltar tela");
      backBtn.textContent = "\u2039";
      backBtn.addEventListener("click", goBack);

      var controls = document.createElement("div");
      controls.className = "topbar-controls";
      controls.appendChild(hamburger);
      controls.appendChild(backBtn);

      topbar.insertBefore(controls, title);
    }

    window.voltarTela = goBack;
  }

  document.addEventListener("DOMContentLoaded", function () {
    ensureViewportFitCover();
    injectMobileStyles();
    enhanceTopbar();
  });
})();
