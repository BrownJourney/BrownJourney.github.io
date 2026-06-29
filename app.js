/*
 * Daniil Lapshin — портфолио. Ванильный скрипт интерактива.
 * Порт клиентского острова (бывш. components/landing/interactions.tsx):
 * работает над статической разметкой index.html по тем же классам/id —
 * nav, мобильное меню, reveal-анимации, счётчики, FAQ, табы процесса,
 * курсор-glow, карусель кейсов и модал кейса с галереей/лайтбоксом.
 * Подключается с defer, поэтому DOM уже разобран к моменту запуска.
 */

/* ============================================================
   Данные кейсов — единый источник для модала с детальным кейсом.
   Пути к обложкам/галерее указывают в папку /public.
   ============================================================ */
const CASES = [
  {
    id: "sber",
    year: 2026,
    title: "Сбер",
    shotAlt: "Сбер — ИИ-агент и RAG над дизайн-системой",
    cardTags: [{ label: "AI Engineer" }, { label: "LLM / RAG", alt: true }],
    cardTask: "Дать инженерам и дизайнерам ИИ-помощника по дизайн-системе.",
    cardResult:
      "Универсальный агент со скиллами, MCP-сервер с RAG и чат-бот для дизайнеров.",
    kicker: "Кейс · AI Engineer",
    summary:
      "Универсальный ИИ-агент, MCP-сервер с RAG над внутренней дизайн-системой и чат-бот для дизайнеров.",
    detailTags: ["LangGraph", "MCP", "RAG", "Apache Kafka", "FastAPI", "LanceDB"],
    task: "Дать инженерам и дизайнерам быстрый доступ к знаниям по внутренней дизайн-системе и автоматизировать рутину тестирования и дизайна.",
    solution:
      "Разработал универсального ИИ-агента с системой скиллов и интегрировал его с Apache Kafka для аудита и отказоустойчивости. Построил MCP-сервер с RAG над дизайн-системой и на его основе — чат-бот, который отвечает дизайнерам на вопросы по системе.",
    result:
      "Команды получают ответы по дизайн-системе за секунды, а агентская платформа легко расширяется новыми скиллами и масштабируется.",
    role: "Роль: AI Engineer · TypeScript, Python, LangGraph, MCP, Kafka",
    nda: true,
    ndaSub: "Внутренний продукт банка",
    image: "public/cases/sber-nda.png",
    gallery: [],
  },
  {
    id: "antiques",
    year: 2026,
    title: "Антикварный салон",
    shotAlt: "Антикварный салон — сайт с онлайн-оценкой антиквариата",
    cardTags: [{ label: "Сайт под ключ" }, { label: "SEO", alt: true }],
    cardTask: "Сделать антикварному салону полноценный корпоративный сайт с каталогом и онлайн-оценкой по фото.",
    cardResult:
      "Многостраничный сайт с каталогом, админкой и SEO — поток обращений из поиска.",
    kicker: "Кейс · Сайт под ключ",
    summary:
      "Многостраничный корпоративный сайт для антикварного салона в Москве: скупка, продажа, онлайн-оценка по фото и каталог предметов с админкой для наполнения.",
    detailTags: ["Next.js", "Многостраничный", "SEO", "Каталог", "Админка", "Формы заявок"],
    task: "Сделать салону полноценный корпоративный сайт, который объясняет услуги скупки и оценки антиквариата, продвигается в поиске и собирает заявки от клиентов.",
    solution:
      "Спроектировал и собрал многостраничный сайт с фирменным «антикварным» стилем: онлайн-оценка по фото, каталог предметов, страницы услуг и контактов. Сделал админ-панель для самостоятельного наполнения каталога, настроил формы заявок, адаптив и SEO-оптимизацию под поисковый трафик.",
    result:
      "Салон получил полноценный сайт для бизнеса: клиенты отправляют фото на оценку и оставляют заявки, контент-менеджер сам наполняет каталог через админку, а SEO приводит обращения из поиска.",
    role: "Роль: дизайн и разработка · Next.js, SEO, админка",
    image: "public/cases/antiques.png",
    imagePosition: "center top",
    gallery: [
      { image: "public/cases/antiques-3.jpg", wide: true },
      { image: "public/cases/antiques-1.jpg" },
      { image: "public/cases/antiques-4.jpg" },
      { image: "public/cases/antiques-5.jpg" },
      { image: "public/cases/antiques-6.jpg" },
      { image: "public/cases/antiques-2.png", wide: true },
    ],
  },
  {
    id: "astra",
    year: 2025,
    title: "Astra",
    shotAlt: "Astra — ИИ-ответы на маркетплейсах",
    cardTags: [{ label: "Fullstack" }, { label: "Маркетплейсы", alt: true }],
    cardTask: "Развить SaaS для автоматических ИИ-ответов продавцам.",
    cardResult:
      "Скорость вывода фич ×2, ИИ дорос до агентского воркфлоу с RAG.",
    kicker: "Кейс · Fullstack",
    summary:
      "SaaS для автоматических ИИ-ответов продавцам на Wildberries, Ozon и Яндекс.Маркете.",
    detailTags: [
      "TypeScript",
      "React",
      "Express.js",
      "PostgreSQL",
      "RabbitMQ",
      "pg_vector",
      "Docker",
    ],
    task: "Развить продукт автоматических ИИ-ответов на маркетплейсах и ускорить вывод новых фич в продакшен.",
    solution:
      "Перевёл микросервисы на единую базу, внедрил автотесты и smoke-проверки, развил ИИ от простых вызовов LLM до агентского воркфлоу с RAG. Интегрировал API маркетплейсов (Wildberries, Ozon, Яндекс.Маркет) и собрал веб-версию на React.",
    result:
      "Скорость вывода фич в продакшен выросла в 2 раза, ключевые системы покрыты автотестами, а ИИ-ответы стали точнее за счёт RAG.",
    role: "Роль: Fullstack-разработчик · astrahelper.ru",
    image: "public/cases/astra.png",
    imagePosition: "center 60%",
    gallery: [
      { image: "public/cases/astra-1.png", portrait: true },
      { image: "public/cases/astra-2.png", portrait: true },
      { image: "public/cases/astra-3.png", portrait: true },
      { image: "public/cases/astra-4.png", portrait: true },
    ],
  },
  {
    id: "inspection",
    year: 2024,
    title: "EasyCarInspection",
    shotAlt: "EasyCarInspection — онлайн-осмотры авто для Uber, Lyft и Turo",
    cardTags: [{ label: "Fullstack" }, { label: "Next.js + WordPress", alt: true }],
    cardTask: "Сделать сайт для продажи онлайн-отчётов об осмотре авто.",
    cardResult:
      "Гибрид WordPress + Next.js с оплатой Stripe и конверсией 4–5% в день.",
    kicker: "Кейс · Fullstack",
    summary:
      "Сайт для продажи быстрых онлайн-отчётов об осмотре авто для водителей Uber, Lyft и Turo.",
    detailTags: ["Next.js", "WordPress", "Stripe", "Google Ads", "Google API"],
    task: "Построить сайт, где водители Uber, Lyft и Turo заказывают и быстро получают отчёт об осмотре автомобиля.",
    solution:
      "Разработал гибридный сайт на WordPress и Next.js, интегрировал приём оплат через Stripe и автоматическую отправку готовых отчётов на почту клиентам. Собрал админ-панель, где заказчик видит и обрабатывает все заявки. Дополнительно настроил рекламные кампании в Google Ads.",
    result:
      "Заказчик получил готовый продукт с автоматической выдачей отчётов и админкой, а кампании в Google Ads вышли на конверсию около 4–5% в день.",
    role: "Роль: Fullstack-разработчик · Next.js, WordPress, Stripe, Google Ads",
    image: "public/cases/inspection.png",
    gallery: [
      { image: "public/cases/inspection-1.png", wide: true },
      { image: "public/cases/inspection-2.png" },
      { image: "public/cases/inspection-3.png" },
    ],
  },
  {
    id: "marking",
    year: 2024,
    title: "Маркировки",
    shotAlt: "Маркировки — сервис маркировки товаров «Честный знак»",
    cardTags: [{ label: "MVP" }, { label: "Next.js", alt: true }],
    cardTask: "Запустить сервис, упрощающий маркировку товаров.",
    cardResult: "Рабочий MVP на Next.js: приём и обработка заявок на маркировку.",
    kicker: "Кейс · MVP",
    summary:
      "MVP веб-сервиса, который облегчает продавцам маркировку товаров в «Честном знаке».",
    detailTags: ["Next.js", "API", "PostgreSQL"],
    task: "Быстро собрать MVP сервиса, который берёт на себя рутину маркировки товаров и приём заявок от продавцов.",
    solution:
      "Разработал MVP на Next.js с серверным API и базой на PostgreSQL: приём и обработка заявок на маркировку, хранение данных и понятный интерфейс для продавцов.",
    result:
      "Заказчик получил рабочую первую версию сервиса, готовую принимать заявки и проверять гипотезу на реальных пользователях.",
    role: "Роль: разработка MVP · Next.js, API, PostgreSQL",
    image: "public/cases/marking.png",
    gallery: [
      { image: "public/cases/marking-1.png", wide: true },
      { image: "public/cases/marking-2.png" },
      { image: "public/cases/marking-3.png" },
      { image: "public/cases/marking-4.png", wide: true },
      { image: "public/cases/marking-5.png" },
      { image: "public/cases/marking-7.png" },
      { image: "public/cases/marking-6.png", wide: true },
    ],
  },
  {
    id: "dealcenter",
    year: 2023,
    title: "DealCenter",
    shotAlt: "DealCenter — CRM для автобизнеса",
    cardTags: [{ label: "CRM" }, { label: "Highload", alt: true }],
    cardTask: "Построить CRM для автокредитного бизнеса с нуля до прода.",
    cardResult:
      "Highload-CRM с интеграциями Stripe, DocuSign и ETL — работа команды ×2.",
    kicker: "Кейс · CRM",
    summary:
      "CRM для англоязычного бизнеса аренды автомобилей: автоматизация ключевых процессов с нуля до продакшена.",
    detailTags: [
      "Express.js",
      "Python",
      "MongoDB",
      "Redis",
      "GraphQL",
      "Docker",
      "Nginx",
    ],
    task: "Создать с нуля CRM для автобизнеса и автоматизировать ключевые бизнес-процессы под highload-нагрузку.",
    solution:
      "Спроектировал и реализовал клиент-серверную архитектуру под highload, сделал интеграции со Stripe, DocuSign и JotForm, настроил ETL-пайплайны из Monday и автоматическую первичную фильтрацию лидов с помощью ИИ-агентов.",
    result:
      "Запустил CRM в продакшен, сократил ручной труд и ускорил обработку данных и работу сотрудников примерно в 2 раза.",
    role: "Роль: Fullstack-разработчик",
    image: "public/cases/dealcenter.png",
    gallery: [
      { image: "public/cases/dealcenter-1.png", wide: true },
      { image: "public/cases/dealcenter-2.png" },
      { image: "public/cases/dealcenter-3.png" },
      { image: "public/cases/dealcenter-4.png" },
      { image: "public/cases/dealcenter-5.png" },
      { image: "public/cases/dealcenter-6.png" },
      { image: "public/cases/dealcenter-7.png" },
      { image: "public/cases/dealcenter-8.png", wide: true },
    ],
  },
];

/* ============================================================
   Инициализация интерактива
   ============================================================ */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* nav: shadow on scroll + hide when scrolling down */
  const nav = document.getElementById("nav");
  let lastY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (nav) {
        nav.classList.toggle("scrolled", y > 24);
        if (y > 520 && y > lastY + 4) nav.classList.add("hide");
        else if (y < lastY - 4 || y < 520) nav.classList.remove("hide");
      }
      lastY = y;
    },
    { passive: true }
  );

  /* mobile menu */
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  if (burger && menu) {
    const setMenu = (open) => {
      menu.classList.toggle("open", open);
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Закрыть меню" : "Меню");
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", () => {
      setMenu(!menu.classList.contains("open"));
    });
    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setMenu(false));
    });
  }

  /* scroll reveals */
  const reveals = document.querySelectorAll(".reveal:not(.in)");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* animated counters */
  function animateCount(el) {
    const target = parseFloat(el.getAttribute("data-count") ?? "0");
    if (reduce) {
      el.textContent = String(target);
      return;
    }
    const dur = 1500;
    let start = null;
    function frame(t) {
      if (start === null) start = t;
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = String(target);
    }
    requestAnimationFrame(frame);
  }
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  /* FAQ accordion */
  document.querySelectorAll(".qa").forEach((qa) => {
    const btn = qa.querySelector(".qa-q");
    const ans = qa.querySelector(".qa-a");
    if (!btn || !ans) return;
    btn.addEventListener("click", () => {
      const open = qa.classList.contains("open");
      document.querySelectorAll(".qa.open").forEach((o) => {
        if (o !== qa) {
          o.classList.remove("open");
          const a = o.querySelector(".qa-a");
          if (a) a.style.maxHeight = "";
        }
      });
      if (open) {
        qa.classList.remove("open");
        ans.style.maxHeight = "";
      } else {
        qa.classList.add("open");
        ans.style.maxHeight = ans.scrollHeight + "px";
      }
    });
  });
  window.addEventListener(
    "resize",
    () => {
      const openQa = document.querySelector(".qa.open");
      if (openQa) {
        const a = openQa.querySelector(".qa-a");
        if (a) a.style.maxHeight = a.scrollHeight + "px";
      }
    },
    { passive: true }
  );

  /* hero stat cards reveal */
  const hero = document.querySelector(".hero");
  if (hero) {
    if (reduce) {
      hero.setAttribute("data-inview", "");
    } else {
      requestAnimationFrame(() => {
        setTimeout(() => {
          hero.setAttribute("data-inview", "");
        }, 220);
      });
    }
  }

  /* PROCESS flow — список этапов слева, карточка справа */
  const flow = document.querySelector(".flow");
  if (flow) {
    const fItems = Array.prototype.slice.call(flow.querySelectorAll(".flow-item"));
    const fPanels = Array.prototype.slice.call(flow.querySelectorAll(".flow-panel"));
    let fActive = 0;
    const fActivate = (i) => {
      if (i === fActive) return;
      fActive = i;
      fItems.forEach((it, n) => {
        const on = n === i;
        it.classList.toggle("on", on);
        it.setAttribute("aria-selected", on ? "true" : "false");
        it.tabIndex = on ? 0 : -1;
      });
      fPanels.forEach((p, n) => p.classList.toggle("on", n === i));
    };
    fItems.forEach((it, i) => {
      it.addEventListener("mouseenter", () => fActivate(i));
      it.addEventListener("focus", () => fActivate(i));
      it.addEventListener("click", () => fActivate(i));
      it.addEventListener("keydown", (e) => {
        let n;
        if (e.key === "ArrowDown" || e.key === "ArrowRight")
          n = (i + 1) % fItems.length;
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
          n = (i - 1 + fItems.length) % fItems.length;
        else if (e.key === "Home") n = 0;
        else if (e.key === "End") n = fItems.length - 1;
        else return;
        e.preventDefault();
        fActivate(n);
        fItems[n].focus();
      });
    });
  }

  /* cursor glow (элемента нет — no-op, как в концепте) */
  const cg = document.getElementById("cursorGlow");
  const fine = matchMedia("(pointer:fine)").matches;
  if (cg && (reduce || !fine)) {
    cg.style.display = "none";
  } else if (cg) {
    let tx = innerWidth / 2;
    let ty = innerHeight * 0.3;
    let cx = tx;
    let cy = ty;
    window.addEventListener(
      "mousemove",
      (e) => {
        tx = e.clientX;
        ty = e.clientY;
      },
      { passive: true }
    );
    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      cg.style.left = cx + "px";
      cg.style.top = cy + "px";
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* CASES — detail popup */
  const caseModal = document.getElementById("caseModal");
  if (caseModal) {
    const cmHero = document.getElementById("cmHero");
    const cmKicker = document.getElementById("cmKicker");
    const cmTitle = document.getElementById("cmTitle");
    const cmSummary = document.getElementById("cmSummary");
    const cmTags = document.getElementById("cmTags");
    const cmTask = document.getElementById("cmTask");
    const cmSolution = document.getElementById("cmSolution");
    const cmResult = document.getElementById("cmResult");
    const cmRole = document.getElementById("cmRole");
    const cmGallery = document.getElementById("cmGallery");
    const cmScroll = caseModal.querySelector(".cm-scroll");
    let caseLastFocus = null;

    // лайтбокс: клик по скриншоту галереи открывает его крупно,
    // со стрелками и перелистыванием всех фото кейса
    const lightbox = document.createElement("div");
    lightbox.className = "cm-lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    const lightboxImg = document.createElement("img");
    lightboxImg.alt = "";
    const mkLbBtn = (cls, label, path) => {
      const b = document.createElement("button");
      b.className = "cm-lb-btn " + cls;
      b.type = "button";
      b.setAttribute("aria-label", label);
      b.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        path +
        "</svg>";
      return b;
    };
    const lbPrev = mkLbBtn("prev", "Предыдущее фото", '<path d="M15 6l-6 6 6 6"/>');
    const lbNext = mkLbBtn("next", "Следующее фото", '<path d="M9 6l6 6-6 6"/>');
    const lbClose = mkLbBtn("close", "Закрыть", '<path d="M18 6 6 18M6 6l12 12"/>');
    const lbCount = document.createElement("div");
    lbCount.className = "cm-lb-count";
    lightbox.append(lbPrev, lightboxImg, lbNext, lbClose, lbCount);
    document.body.appendChild(lightbox);

    let lbImages = [];
    let lbIndex = 0;
    const renderLb = () => {
      if (!lbImages.length) return;
      lightboxImg.src = lbImages[lbIndex];
      const multi = lbImages.length > 1;
      lbPrev.style.display = multi ? "" : "none";
      lbNext.style.display = multi ? "" : "none";
      lbCount.style.display = multi ? "" : "none";
      lbCount.textContent = lbIndex + 1 + " / " + lbImages.length;
    };
    const lbGo = (delta) => {
      if (!lbImages.length) return;
      lbIndex = (lbIndex + delta + lbImages.length) % lbImages.length;
      renderLb();
    };
    const openLightbox = (src) => {
      lbImages = cmGallery
        ? Array.prototype.slice
            .call(cmGallery.querySelectorAll("img"))
            // только видимые скрины (на мобилке часть скрыта) — листаем их
            .filter((im) => im.offsetParent !== null)
            .map((im) => im.src)
        : [src];
      lbIndex = Math.max(0, lbImages.indexOf(src));
      renderLb();
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    };
    const closeLightbox = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
    };
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    lightboxImg.addEventListener("click", (e) => e.stopPropagation());
    lbPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      lbGo(-1);
    });
    lbNext.addEventListener("click", (e) => {
      e.stopPropagation();
      lbGo(1);
    });
    lbClose.addEventListener("click", (e) => {
      e.stopPropagation();
      closeLightbox();
    });

    // мобильная галерея-карусель: горизонтальный скролл + стрелки + счётчик
    const cmGalWrap = caseModal.querySelector(".cm-gallery-wrap");
    const cmGalPrev = caseModal.querySelector("[data-gal-prev]");
    const cmGalNext = caseModal.querySelector("[data-gal-next]");
    const cmGalCount = document.getElementById("cmGalleryCount");
    const galStep = () => (cmGallery ? cmGallery.clientWidth + 10 : 0);
    const galMobile = () => window.matchMedia("(max-width:520px)").matches;
    const updateGallery = () => {
      if (!cmGallery || !cmGalWrap) return;
      const slides = cmGallery.querySelectorAll("img, .case-ph");
      // галерея из вертикальных скринов (Astra) на мобилке — статичная сетка,
      // а не карусель: стрелки/счётчик не нужны
      const multi =
        slides.length > 1 &&
        galMobile() &&
        !cmGallery.classList.contains("phones-grid");
      cmGalWrap.classList.toggle("has-nav", multi);
      if (!multi) return;
      const step = galStep();
      const max = cmGallery.scrollWidth - cmGallery.clientWidth - 1;
      const idx = step > 0 ? Math.round(cmGallery.scrollLeft / step) : 0;
      const cur = Math.max(0, Math.min(slides.length - 1, idx));
      if (cmGalCount) cmGalCount.textContent = cur + 1 + " / " + slides.length;
      if (cmGalPrev) cmGalPrev.disabled = cmGallery.scrollLeft <= 1;
      if (cmGalNext) cmGalNext.disabled = cmGallery.scrollLeft >= max;
    };
    // мгновенный сдвиг на один слайд (snap фиксирует кадр); свайпом на
    // телефоне листается нативно-плавно. behavior:"smooth" опускаем —
    // при scroll-snap mandatory он ненадёжен в части браузеров
    cmGalPrev?.addEventListener("click", () => {
      cmGallery?.scrollBy({ left: -galStep() });
      updateGallery();
    });
    cmGalNext?.addEventListener("click", () => {
      cmGallery?.scrollBy({ left: galStep() });
      updateGallery();
    });
    let galRaf = null;
    cmGallery?.addEventListener(
      "scroll",
      () => {
        if (galRaf) return;
        galRaf = requestAnimationFrame(() => {
          galRaf = null;
          updateGallery();
        });
      },
      { passive: true }
    );
    window.addEventListener("resize", updateGallery);

    const openCase = (id) => {
      const d = CASES.find((c) => c.id === id);
      if (!d) return;
      caseLastFocus = document.activeElement;
      if (cmHero) {
        if (d.nda) {
          cmHero.classList.add("nda");
          cmHero.innerHTML =
            '<svg class="nda-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>' +
            '<span class="nda-title">Под NDA</span>' +
            '<span class="nda-sub">' +
            (d.ndaSub ?? "") +
            "</span>";
        } else {
          cmHero.classList.remove("nda");
          cmHero.textContent = d.title;
        }
        if (d.image) {
          const cover = document.createElement("img");
          cover.src = d.image;
          cover.alt = "";
          cover.style.cssText =
            "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:" +
            (d.imagePosition || "center");
          cover.addEventListener("error", () => cover.remove());
          cmHero.appendChild(cover);
        }
      }
      if (cmKicker) cmKicker.textContent = d.kicker;
      if (cmTitle) cmTitle.textContent = d.title;
      if (cmSummary) cmSummary.textContent = d.summary;
      if (cmTask) cmTask.textContent = d.task;
      if (cmSolution) cmSolution.textContent = d.solution;
      if (cmResult) cmResult.textContent = d.result;
      if (cmRole) cmRole.textContent = d.role;
      if (cmTags) {
        cmTags.innerHTML = "";
        d.detailTags.forEach((t) => {
          const s = document.createElement("span");
          s.className = "ctag";
          s.textContent = t;
          cmTags.appendChild(s);
        });
      }
      if (cmGallery) {
        cmGallery.innerHTML = "";
        let row = null;
        let rowCount = 0;
        d.gallery.forEach((g) => {
          if (!g.image) {
            row = null;
            rowCount = 0;
            const ph = document.createElement("div");
            ph.className = g.wide ? "case-ph wide" : "case-ph";
            cmGallery.appendChild(ph);
            return;
          }
          const img = document.createElement("img");
          img.src = g.image;
          img.alt = "";
          img.loading = "lazy";
          img.addEventListener("error", () => img.remove());
          img.addEventListener("click", () => openLightbox(img.src));
          if (g.wide) {
            row = null;
            rowCount = 0;
            img.className = "wide";
            cmGallery.appendChild(img);
          } else if (g.portrait) {
            // вертикальные скриншоты телефона — до 4 в ряд
            if (!row || rowCount >= 4 || row.dataset.kind !== "phones") {
              row = document.createElement("div");
              row.className = "cm-row phones";
              row.dataset.kind = "phones";
              cmGallery.appendChild(row);
              rowCount = 0;
            }
            img.className = "portrait";
            row.appendChild(img);
            rowCount++;
          } else {
            // обычные (широкие) скрины группируем по 2 в строку: равная
            // ширина и фиксированное соотношение сторон → высоты не «скачут»
            if (!row || rowCount >= 2 || row.dataset.kind === "phones") {
              row = document.createElement("div");
              row.className = "cm-row";
              cmGallery.appendChild(row);
              rowCount = 0;
            }
            row.appendChild(img);
            rowCount++;
          }
        });
        // галерея целиком из вертикальных скринов (Astra) — на мобилке
        // раскладываем сеткой 2-в-ряд, а не растянутой горизонтальной каруселью
        const allPhones =
          d.gallery.length > 0 && d.gallery.every((g) => g.portrait);
        cmGallery.classList.toggle("phones-grid", allPhones);
      }
      if (cmScroll) cmScroll.scrollTop = 0;
      if (cmGallery) cmGallery.scrollLeft = 0;
      requestAnimationFrame(updateGallery);
      caseModal.classList.add("open");
      caseModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-lock");
    };
    const closeCase = () => {
      closeLightbox();
      caseModal.classList.remove("open");
      caseModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-lock");
      if (caseLastFocus && caseLastFocus.focus) {
        try {
          caseLastFocus.focus();
        } catch {
          /* noop */
        }
      }
    };
    document.querySelectorAll(".case[data-case]").forEach((card) => {
      card.addEventListener("click", () =>
        openCase(card.getAttribute("data-case") ?? "")
      );
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openCase(card.getAttribute("data-case") ?? "");
        }
      });
    });
    caseModal.querySelectorAll("[data-case-close]").forEach((b) => {
      b.addEventListener("click", (e) => {
        e.preventDefault();
        closeCase();
      });
    });
    document.addEventListener("keydown", (e) => {
      if (lightbox.classList.contains("open")) {
        if (e.key === "Escape") closeLightbox();
        else if (e.key === "ArrowLeft") lbGo(-1);
        else if (e.key === "ArrowRight") lbGo(1);
        return;
      }
      if (e.key === "Escape" && caseModal.classList.contains("open")) closeCase();
    });
  }

  /* case cover images — fall back to the placeholder if the file is missing */
  document.querySelectorAll(".case-shot img").forEach((img) => {
    img.addEventListener("error", () => img.remove());
  });

  /* мобилка: «показать все кейсы» раскрывает скрытые карточки (4-я и далее) */
  const casesGrid = document.getElementById("casesGrid");
  const casesMore = document.getElementById("casesMore");
  if (casesGrid && casesMore) {
    casesMore.addEventListener("click", () => {
      const expanded = casesGrid.classList.toggle("show-all");
      casesMore.setAttribute("aria-expanded", expanded ? "true" : "false");
      casesMore.textContent = expanded ? "Свернуть" : "Показать все кейсы";
    });
  }

  /* carousel (элементов нет — no-op, как в концепте) */
  const vp = document.getElementById("casesViewport");
  if (vp) {
    const track = document.getElementById("casesTrack");
    const prevBtn = document.getElementById("casesPrev");
    const nextBtn = document.getElementById("casesNext");
    const dotsWrap = document.getElementById("casesDots");
    if (track && prevBtn && nextBtn && dotsWrap) {
      const cards = track.children;
      let dots = [];
      const step = () => {
        if (cards.length < 2)
          return cards.length ? cards[0].offsetWidth : vp.clientWidth;
        return cards[1].offsetLeft - cards[0].offsetLeft;
      };
      const perView = () => {
        const s = step();
        return s > 0 ? Math.max(1, Math.round(vp.clientWidth / s)) : 1;
      };
      const pages = () => Math.max(1, cards.length - perView() + 1);
      const buildDots = () => {
        const n = pages();
        if (dots.length === n) return;
        dotsWrap.innerHTML = "";
        dots = [];
        for (let i = 0; i < n; i++) {
          const idx = i;
          const d = document.createElement("button");
          d.className = "cs-dot";
          d.type = "button";
          d.setAttribute("role", "tab");
          d.setAttribute("aria-label", "Группа кейсов " + (idx + 1));
          d.addEventListener("click", () =>
            vp.scrollTo({ left: idx * step(), behavior: "smooth" })
          );
          dotsWrap.appendChild(d);
          dots.push(d);
        }
      };
      const update = () => {
        buildDots();
        const s = step();
        if (s <= 0) return;
        const max = vp.scrollWidth - vp.clientWidth - 1;
        prevBtn.disabled = vp.scrollLeft <= 1;
        nextBtn.disabled = vp.scrollLeft >= max;
        const idx = Math.max(
          0,
          Math.min(dots.length - 1, Math.round(vp.scrollLeft / s))
        );
        dots.forEach((d, n) => {
          d.classList.toggle("on", n === idx);
          d.setAttribute("aria-selected", n === idx ? "true" : "false");
        });
      };
      prevBtn.addEventListener("click", () =>
        vp.scrollBy({ left: -step(), behavior: "smooth" })
      );
      nextBtn.addEventListener("click", () =>
        vp.scrollBy({ left: step(), behavior: "smooth" })
      );
      let raf = null;
      vp.addEventListener(
        "scroll",
        () => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            raf = null;
            update();
          });
        },
        { passive: true }
      );
      window.addEventListener("resize", () => {
        dots = [];
        update();
      });
      update();
    }
  }
})();
