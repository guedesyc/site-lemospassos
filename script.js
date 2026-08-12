const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initPageLoader() {
  const loader = document.createElement("div");
  loader.className = "page-loader";
  loader.setAttribute("aria-hidden", "true");
  loader.innerHTML = '<img src="./assets/lemos-passos.png" alt="" />';
  document.body.append(loader);
  let navigationTimer;

  function hideLoader({ clearTimer = true } = {}) {
    if (clearTimer) window.clearTimeout(navigationTimer);
    loader.classList.remove("is-visible");
    loader.setAttribute("aria-hidden", "true");
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";
  }

  window.navigateWithLoader = (href) => {
    if (!href) return;

    loader.style.opacity = "";
    loader.style.visibility = "";
    loader.setAttribute("aria-hidden", "false");
    loader.classList.add("is-visible");
    navigationTimer = window.setTimeout(() => {
      window.location.href = href;
    }, reducedMotion ? 80 : 620);
  };

  hideLoader();
  window.addEventListener("load", () => hideLoader({ clearTimer: false }));
  window.addEventListener("pagehide", hideLoader);
  window.addEventListener("beforeunload", hideLoader);
  window.addEventListener("pageshow", () => {
    hideLoader();
    window.requestAnimationFrame(() => hideLoader({ clearTimer: false }));
    window.setTimeout(() => hideLoader({ clearTimer: false }), 80);
  });
  window.addEventListener("popstate", hideLoader);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") hideLoader();
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;

    const url = new URL(link.href, window.location.href);
    const isExternal = url.origin !== window.location.origin;
    const isProtocolAction = ["mailto:", "tel:"].includes(url.protocol);
    const isSamePageHash = url.pathname === window.location.pathname && url.hash;

    if (isExternal || isProtocolAction || isSamePageHash) return;

    event.preventDefault();
    window.navigateWithLoader(url.href);
  });
}

function initIntro() {
  const firstLine = "acima de tudo,";
  const careLeadText = "o ";
  const careWordText = "cuidado.";
  const intro = document.querySelector(".intro");
  const typedLineOne = document.querySelector("#typedLineOne");
  const typedCareLead = document.querySelector("#typedCareLead");
  const typedCareWord = document.querySelector("#typedCareWord");
  const careLine = document.querySelector(".type-line-care");
  const cursor = document.querySelector("#cursor");
  const signature = document.querySelector("#signature");

  if (!intro || !typedLineOne || !typedCareLead || !typedCareWord || !cursor || !signature) return;

  const typeDelay = 128;
  const startDelay = 420;
  const suspenseDelay = 1180;
  const signatureDelay = 720;
  const zoomDelay = 1250;
  const pageDelay = 1550;

  function revealSignature() {
    cursor.remove();
    signature.classList.add("is-visible");
  }

  function enterHome() {
    intro.classList.add("is-zooming");

    window.setTimeout(() => {
      intro.classList.add("is-leaving");
    }, pageDelay - 620);

    window.setTimeout(() => {
      window.location.href = "home.html";
    }, pageDelay);
  }

  function typeText(target, text, delayStart, onComplete) {
    [...text].forEach((character, index) => {
      window.setTimeout(() => {
        target.textContent += character;

        if (index === text.length - 1 && onComplete) {
          onComplete();
        }
      }, delayStart + index * typeDelay);
    });
  }

  if (reducedMotion) {
    typedLineOne.textContent = firstLine;
    typedCareLead.textContent = careLeadText;
    typedCareWord.textContent = careWordText;
    revealSignature();
    window.setTimeout(enterHome, 700);
    return;
  }

  typeText(typedLineOne, firstLine, startDelay, () => {
    window.setTimeout(() => {
      careLine.append(cursor);
      typeText(typedCareLead, careLeadText, 0, () => {
        typeText(typedCareWord, careWordText, 0, () => {
          window.setTimeout(() => {
            revealSignature();
            window.setTimeout(enterHome, zoomDelay);
          }, signatureDelay);
        });
      });
    }, suspenseDelay);
  });
}

function initFrontsExplorer() {
  const frontItems = document.querySelectorAll(".front-item");
  const frontPreview = document.querySelector(".front-preview");
  const frontPreviewImage = document.querySelector("#frontPreviewImage");
  const frontPreviewLabel = document.querySelector("#frontPreviewLabel");
  const frontPreviewIndex = document.querySelector(".front-preview-index");

  if (!frontItems.length || !frontPreview || !frontPreviewImage || !frontPreviewLabel || !frontPreviewIndex) return;

  const frontData = {
    grupo: {
      label: "O Grupo LemosPassos",
      index: "01 / 04",
      image: "./assets/hero-kitchen.png",
      alt: "Cozinha profissional do Grupo LemosPassos",
      href: "home.html#groupPage",
    },
    atuacoes: {
      label: "Atuações",
      index: "02 / 04",
      image: "./assets/hero-kitchen.png",
      alt: "Operação alimentícia profissional",
      href: "solucoes.html",
    },
    trabalhe: {
      label: "Trabalhe Conosco",
      index: "03 / 04",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=85",
      alt: "Equipe diversa reunida em ambiente de trabalho",
      href: "trabalhe-conosco.html",
    },
    contatos: {
      label: "Contatos",
      index: "04 / 04",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
      alt: "Pessoas diversas em reunião",
      href: "contato.html",
    },
  };

  function activateFront(item) {
    const data = frontData[item.dataset.front];
    if (!data) return;

    frontItems.forEach((frontItem) => {
      const isActive = frontItem === item;
      frontItem.classList.toggle("is-active", isActive);
      frontItem.setAttribute("aria-selected", String(isActive));
    });

    frontPreview.classList.add("is-changing", "is-visible");
    window.setTimeout(() => {
      frontPreviewImage.src = data.image;
      frontPreviewImage.alt = data.alt;
      frontPreviewLabel.textContent = data.label;
      frontPreviewIndex.textContent = data.index;
      frontPreview.classList.remove("is-changing");
    }, reducedMotion ? 0 : 180);
  }

  function moveFrontPreview(event) {
    if (window.innerWidth <= 720) return;

    const previewWidth = frontPreview.offsetWidth || 270;
    const previewHeight = frontPreview.offsetHeight || 360;
    const left = Math.min(event.clientX, window.innerWidth - previewWidth - 28);
    const top = Math.min(event.clientY, window.innerHeight - previewHeight - 28);

    frontPreview.style.left = `${Math.max(20, left)}px`;
    frontPreview.style.top = `${Math.max(20, top)}px`;
  }

  function hideFrontPreview() {
    if (window.innerWidth > 720) frontPreview.classList.remove("is-visible");
  }

  frontItems.forEach((item) => {
    item.addEventListener("mouseenter", (event) => {
      moveFrontPreview(event);
      activateFront(item);
    });
    item.addEventListener("mousemove", moveFrontPreview);
    item.addEventListener("mouseleave", hideFrontPreview);
    item.addEventListener("focus", () => {
      if (window.innerWidth > 720) {
        frontPreview.style.left = `${window.innerWidth / 2 - 135}px`;
        frontPreview.style.top = `${window.innerHeight / 2 - 180}px`;
      }
      activateFront(item);
    });
    item.addEventListener("click", () => {
      const data = frontData[item.dataset.front];
      if (data) window.navigateWithLoader(data.href);
    });
  });
}

function initActuationCards() {
  const actuationCards = document.querySelectorAll(".actuation-card");
  if (!actuationCards.length) return;

  actuationCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (card.dataset.href) {
        window.navigateWithLoader(card.dataset.href);
        return;
      }

      actuationCards.forEach((item) => item.classList.remove("is-active"));
      card.classList.add("is-active");
    });
  });
}

function initCounters() {
  const counters = document.querySelectorAll(".group-stat strong[data-target]");
  if (!counters.length) return;

  function animateCounter(counter, duration = 10000) {
    const target = Number(counter.dataset.target);
    const startTime = performance.now();
    const format = new Intl.NumberFormat("pt-BR");

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = `+${format.format(Math.floor(target * eased))}`;

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    }

    window.requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      counters.forEach((counter) => {
        if (reducedMotion) {
          counter.textContent = `+${new Intl.NumberFormat("pt-BR").format(Number(counter.dataset.target))}`;
        } else if (!counter.dataset.started) {
          counter.dataset.started = "true";
          animateCounter(counter);
        }
      });

      observer.disconnect();
    });
  }, { threshold: 0.35 });

  counterObserver.observe(counters[0].closest(".group-stats"));
}

function initMailForms() {
  const careerForm = document.querySelector("#careerForm");
  const contactForm = document.querySelector("#contactForm");

  function openMailForm(form, recipient, subjectPrefix) {
    const data = new FormData(form);
    const name = data.get("name") || "";
    const email = data.get("email") || "";
    const subject = data.get("subject") || data.get("area") || "Contato pelo site";
    const message = data.get("message") || "";
    const bodyLines = [
      `Nome: ${name}`,
      `E-mail: ${email}`,
      data.get("area") ? `Área de interesse: ${data.get("area")}` : "",
      "",
      "Mensagem:",
      message,
      "",
      form === careerForm ? "Observação: anexar currículo a este e-mail antes de enviar." : "",
    ].filter(Boolean);

    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(`${subjectPrefix}: ${subject}`)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    window.location.href = mailto;
  }

  if (careerForm) {
    careerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!careerForm.reportValidity()) return;
      openMailForm(careerForm, "curriculos@lemospassos.com", "Currículo pelo site");
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      openMailForm(contactForm, "vanessasilva@lemospassos.com", "Contato pelo site");
    });
  }
}

initPageLoader();
initIntro();
initFrontsExplorer();
initActuationCards();
initCounters();
initMailForms();
