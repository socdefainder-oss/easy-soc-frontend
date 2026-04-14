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
      "  .pull-refresh-indicator {",
      "    position: fixed;",
      "    left: 50%;",
      "    top: calc(var(--safe-top) + 6px);",
      "    transform: translate(-50%, -120%);",
      "    z-index: 1300;",
      "    background: #1a1f36;",
      "    color: #fff;",
      "    border-radius: 999px;",
      "    font-size: 12px;",
      "    line-height: 1;",
      "    padding: 8px 12px;",
      "    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);",
      "    opacity: 0;",
      "    transition: transform 0.18s ease, opacity 0.18s ease;",
      "    pointer-events: none;",
      "  }",
      "  .pull-refresh-indicator.show { opacity: 1; transform: translate(-50%, 0); }",
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

  function setupPullToRefresh() {
    if (window.matchMedia("(min-width: 821px)").matches) return;

    if (document.getElementById("pull-refresh-indicator")) return;

    var indicator = document.createElement("div");
    indicator.id = "pull-refresh-indicator";
    indicator.className = "pull-refresh-indicator";
    indicator.textContent = "Puxe para atualizar";
    document.body.appendChild(indicator);

    var startY = null;
    var dragDistance = 0;
    var pulling = false;
    var threshold = 92;

    function isAtTop() {
      return window.scrollY <= 0 && document.documentElement.scrollTop <= 0;
    }

    function showIndicator(distance) {
      var progress = Math.min(distance / threshold, 1);
      indicator.classList.add("show");
      indicator.style.opacity = String(Math.max(0.45, progress));
      indicator.style.transform = "translate(-50%, " + (progress * 10) + "px)";
      indicator.textContent = distance >= threshold ? "Solte para atualizar" : "Puxe para atualizar";
    }

    function hideIndicator() {
      indicator.classList.remove("show");
      indicator.style.transform = "translate(-50%, -120%)";
      indicator.style.opacity = "0";
      indicator.textContent = "Puxe para atualizar";
    }

    document.addEventListener(
      "touchstart",
      function (e) {
        if (e.touches.length !== 1) return;
        startY = e.touches[0].clientY;
        dragDistance = 0;
        pulling = isAtTop();
      },
      { passive: true }
    );

    document.addEventListener(
      "touchmove",
      function (e) {
        if (!pulling || startY === null || e.touches.length !== 1) return;

        var currentY = e.touches[0].clientY;
        dragDistance = Math.max(0, currentY - startY);

        if (dragDistance > 0) {
          showIndicator(dragDistance);
          e.preventDefault();
        }
      },
      { passive: false }
    );

    document.addEventListener(
      "touchend",
      function () {
        if (!pulling) {
          startY = null;
          return;
        }

        var shouldRefresh = dragDistance >= threshold;
        startY = null;
        dragDistance = 0;
        pulling = false;
        hideIndicator();

        if (shouldRefresh) {
          location.reload();
        }
      },
      { passive: true }
    );

    document.addEventListener(
      "touchcancel",
      function () {
        startY = null;
        dragDistance = 0;
        pulling = false;
        hideIndicator();
      },
      { passive: true }
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    ensureViewportFitCover();
    injectMobileStyles();
    enhanceTopbar();
    setupPullToRefresh();
  });
})();
