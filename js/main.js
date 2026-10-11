(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  root.classList.add("js");

  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 3200);
  }

  function updateClock() {
    var clock = document.getElementById("clock");
    if (!clock) return;
    var now = new Date();
    var h = String(now.getHours()).padStart(2, "0");
    var m = String(now.getMinutes()).padStart(2, "0");
    var s = String(now.getSeconds()).padStart(2, "0");
    clock.textContent = h + ":" + m + ":" + s;
  }

  function updateYear() {
    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function updateScrollProgress() {
    var bar = document.getElementById("scrollProgress");
    if (!bar) return;
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, progress)) + "%";
  }

  function setActiveNav() {
    var page = body.getAttribute("data-page") || "";
    var links = document.querySelectorAll(".site-nav a");
    links.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var isActive = false;
      if (page === "home" && href === "index.html") isActive = true;
      if (page === "about" && href === "about.html") isActive = true;
      if (page === "projects" && href === "projects.html") isActive = true;
      if (page === "timeline" && href === "timeline.html") isActive = true;
      if (page === "contact" && href === "contact.html") isActive = true;
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function initNavToggle() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    var scrim = document.getElementById("navScrim");
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
      if (scrim) {
        scrim.classList.toggle("is-open", open);
        scrim.setAttribute("aria-hidden", open ? "false" : "true");
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });

    if (scrim) {
      scrim.addEventListener("click", function () {
        setOpen(false);
      });
    }
  }

  function handleHashTarget() {
    var hash = window.location.hash;
    if (!hash) return;
    var target = document.querySelector(hash);
    if (!target) return;
    window.setTimeout(function () {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

  function initPageTransitions() {
    document.querySelectorAll("a[data-link]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        var href = link.getAttribute("href");
        if (!href || href.indexOf("mailto:") === 0 || href.indexOf("http") === 0) return;

        if (href.charAt(0) === "#") {
          event.preventDefault();
          var target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          return;
        }

        event.preventDefault();
        root.classList.add("is-leaving");
        window.setTimeout(function () {
          window.location.href = href;
        }, 250);
      });
    });
  }

  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  function typeTerminal(lines) {
    var terminal = document.getElementById("terminal");
    if (!terminal) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function addLine(text, className) {
      var p = document.createElement("p");
      p.className = "terminal-line " + (className || "");
      p.textContent = text;
      terminal.appendChild(p);
      return p;
    }

    function typeText(element, text, speed) {
      return new Promise(function (resolve) {
        if (reduced) {
          element.textContent = text;
          resolve();
          return;
        }
        var index = 0;
        var timer = window.setInterval(function () {
          index += 1;
          element.textContent = text.slice(0, index);
          if (index >= text.length) {
            window.clearInterval(timer);
            resolve();
          }
        }, speed);
      });
    }

    function wait(ms) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, reduced ? 20 : ms);
      });
    }

    async function run() {
      terminal.innerHTML = "";
      addLine("HGX//dev", "muted");
      await wait(360);

      for (var i = 0; i < lines.length; i++) {
        var prompt = document.createElement("p");
        prompt.className = "terminal-line";
        terminal.appendChild(prompt);

        var promptText = document.createElement("span");
        promptText.className = "terminal-prompt";
        promptText.textContent = lines[i].prompt + " $";
        prompt.appendChild(promptText);

        var cmd = document.createElement("span");
        cmd.className = "terminal-cmd";
        prompt.appendChild(cmd);
        await typeText(cmd, " " + lines[i].cmd, 48);
        await wait(lines[i].wait || 240);

        if (lines[i].out) {
          var out = document.createElement("p");
          out.className = "terminal-line terminal-out";
          terminal.appendChild(out);
          await typeText(out, lines[i].out, 12);
        }
        await wait(320);
      }

      var cursorLine = addLine("", "");
      var caret = document.createElement("span");
      caret.className = "terminal-caret";
      cursorLine.appendChild(caret);
    }

    run();
  }

  function initTerminal() {
    if (!document.getElementById("terminal")) return;
    var lines = [
      {
        prompt: "hgx@dev",
        cmd: "whoami",
        out: "HGXdev — builder / curious learner",
        wait: 220
      },
      {
        prompt: "hgx@dev",
        cmd: "cat stack.txt",
        out: "python · java · js · electron · ai-tools",
        wait: 180
      },
      {
        prompt: "hgx@dev",
        cmd: "./deploy --target production",
        out: "OK · 23 modules · 0 errors",
        wait: 420
      }
    ];
    typeTerminal(lines);
  }

  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    var status = document.getElementById("formStatus");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = (form.elements.name.value || "").trim();
      var contact = (form.elements.contact.value || "").trim();
      var message = (form.elements.message.value || "").trim();
      if (!name || !message) {
        if (status) status.textContent = "请先填写称呼和想聊的内容。";
        return;
      }
      if (status) status.textContent = "信号已记录（演示模式，未真正发送）。";
      showToast("当前为前端演示表单，尚未接入发送服务。");
      form.reset();
    });
  }

  function initTodoCards() {
    document.querySelectorAll("[data-todo]").forEach(function (item) {
      item.addEventListener("click", function () {
        showToast("这条联系方式还没补充，可以先通过微信小程序找到我。");
      });
    });
  }

  ready(function () {
    updateClock();
    updateYear();
    updateScrollProgress();
    setActiveNav();
    initNavToggle();
    initPageTransitions();
    initReveal();
    initTerminal();
    initContactForm();
    initTodoCards();
    handleHashTarget();

    window.setInterval(updateClock, 1000);
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
    window.addEventListener("popstate", function () {
      root.classList.remove("is-leaving");
      setActiveNav();
    });
  });
})();
