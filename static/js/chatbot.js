/*!
 * Zyntra Support Chatbot — chatbot.js
 * Drop in /static/chatbot.js
 * Requires: marked.js (loaded via CDN or locally)
 * Backend: POST /agent → { response: "..." }
 */

(function () {
  "use strict";

  /* ── Load marked if not already present ── */
  function loadMarked(cb) {
    if (window.marked) return cb();
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    s.onload = cb;
    document.head.appendChild(s);
  }

  function init() {
    if (window.marked) {
      marked.setOptions({ breaks: true, gfm: true });
    }

    /* ── Inject HTML — each element appended directly to <body>
          so position:fixed is always relative to the viewport,
          never trapped inside a stacking context from a wrapper div ── */

    document.body.insertAdjacentHTML("beforeend", `
      <div id="zc-overlay"></div>`);

    document.body.insertAdjacentHTML("beforeend", `
      <div id="zc-modal" role="dialog" aria-modal="true" aria-label="Zyntra Support Chat">
        <div class="zc-header">
          <div class="zc-av">🤖</div>
          <div class="zc-info">
            <h2>Zyntra AI Support Agent</h2>
            <p><span class="zc-dot-live"></span>Online · replies instantly</p>
          </div>
          <button class="zc-close" id="zc-close-btn" aria-label="Close chat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div id="zc-chat">
          <div class="zc-welcome" id="zc-welcome">
            <div class="zc-w-logo">🤖</div>
            <h3>Hi there! How can we help?</h3>
            <p>Ask us about Web Development, POS Systems,<br/>AI Solutions, pricing, or anything else.</p>
          </div>
        </div>
        <div class="zc-quick-wrap" id="zc-quick-wrap">
          <button class="zc-quick-btn" data-msg="Tell me about your web development services">Web Development</button>
          <button class="zc-quick-btn" data-msg="Tell me about your POS systems">POS Systems</button>
          <button class="zc-quick-btn" data-msg="Tell me about your AI solutions">AI Solutions</button>
          <button class="zc-quick-btn" data-msg="What are your pricing options?">Pricing</button>
        </div>
        <div class="zc-input-bar">
          <textarea id="zc-input" rows="1" placeholder="Message Zyntra support…"></textarea>
          <button id="zc-send" aria-label="Send">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <div class="zc-footer-brand">
          Powered by <a href="/" tabindex="-1">Zyntra</a>
        </div>
      </div>`);

    document.body.insertAdjacentHTML("beforeend", `
      <button id="zc-fab" aria-label="Open Zyntra support chat">
        <div id="zc-badge">1</div>
        <svg class="zc-icon-chat" width="24" height="24" viewBox="0 0 24 24"
             fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <svg class="zc-icon-close" width="20" height="20" viewBox="0 0 24 24"
             fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>`);

    /* ── Refs ── */
    const fab       = document.getElementById("zc-fab");
    const modal     = document.getElementById("zc-modal");
    const overlay   = document.getElementById("zc-overlay");
    const closeBtn  = document.getElementById("zc-close-btn");
    const chat      = document.getElementById("zc-chat");
    const input     = document.getElementById("zc-input");
    const sendBtn   = document.getElementById("zc-send");
    const badge     = document.getElementById("zc-badge");
    const quickWrap = document.getElementById("zc-quick-wrap");

    let isOpen   = false;
    let firstMsg = true;
    let history  = [];

    /* ── Open / Close ── */
    function openChat() {
      isOpen = true;
      modal.classList.add("zc-show");
      overlay.classList.add("zc-show");
      fab.classList.add("zc-open");
      badge.classList.remove("zc-show");
      setTimeout(() => input.focus(), 320);
    }

    function closeChat() {
      isOpen = false;
      modal.classList.remove("zc-show");
      overlay.classList.remove("zc-show");
      fab.classList.remove("zc-open");
    }

    fab.addEventListener("click", () => (isOpen ? closeChat() : openChat()));
    closeBtn.addEventListener("click", closeChat);
    overlay.addEventListener("click", closeChat);

    /* Show badge after 2.5s */
    setTimeout(() => badge.classList.add("zc-show"), 2500);

    /* ── Auto-resize textarea ── */
    input.addEventListener("input", () => {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 100) + "px";
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });

    sendBtn.addEventListener("click", send);

    /* ── Quick replies ── */
    quickWrap.querySelectorAll(".zc-quick-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        input.value = btn.dataset.msg || btn.textContent;
        send();
      });
    });

    /* ── Add message ── */
    function addMessage(role, content) {
      const welcome = document.getElementById("zc-welcome");
      if (welcome) welcome.remove();
      if (firstMsg) {
        quickWrap.style.display = "none";
        firstMsg = false;
      }

      const msg = document.createElement("div");
      msg.className = `zc-msg zc-${role}`;

      const av = document.createElement("div");
      av.className = "zc-bav";
      av.textContent = role === "bot" ? "🤖" : "🧑";

      const bubble = document.createElement("div");
      bubble.className = "zc-bubble";

      if (role === "bot" && window.marked) {
        bubble.innerHTML = marked.parse(content);
      } else {
        bubble.textContent = content;
      }

      msg.appendChild(av);
      msg.appendChild(bubble);
      chat.appendChild(msg);
      chat.scrollTop = chat.scrollHeight;

      history.push({ role: role === "bot" ? "assistant" : "user", content });
    }

    /* ── Typing indicator ── */
    function showTyping() {
      const msg = document.createElement("div");
      msg.className = "zc-msg zc-bot zc-typing";
      msg.id = "zc-typing";
      msg.innerHTML = `
        <div class="zc-bav">🤖</div>
        <div class="zc-bubble">
          <div class="zc-dot"></div>
          <div class="zc-dot"></div>
          <div class="zc-dot"></div>
        </div>`;
      chat.appendChild(msg);
      chat.scrollTop = chat.scrollHeight;
    }

    function removeTyping() {
      const t = document.getElementById("zc-typing");
      if (t) t.remove();
    }

    /* ── Send ── */
    async function send() {
      const text = input.value.trim();
      if (!text) return;

      addMessage("user", text);
      input.value = "";
      input.style.height = "auto";
      sendBtn.disabled = true;
      showTyping();

      try {
        const res = await fetch("/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: text }),
        });

        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        removeTyping();
        addMessage("bot", data.response);

        if (!isOpen) badge.classList.add("zc-show");
      } catch (err) {
        removeTyping();
        addMessage(
          "bot",
          `⚠️ **Something went wrong.** ${err.message}\n\nPlease try again or email us at **zyntrasoftwaresolution@gmail.com**.`,
        );
      } finally {
        sendBtn.disabled = false;
        input.focus();
      }
    }
  }

  /* ── Bootstrap ── */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => loadMarked(init));
  } else {
    loadMarked(init);
  }
})();