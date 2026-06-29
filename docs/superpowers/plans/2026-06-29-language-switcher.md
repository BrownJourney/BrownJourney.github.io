# Переключение языка (RU / EN) — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить переключатель языка RU/EN в хедер сайта-портфолио; русский — по умолчанию, выбор сохраняется.

**Architecture:** RU остаётся исходным inline-текстом разметки. EN добавляется рядом: текст — через атрибут `data-en`, атрибуты (aria-label/alt) — через `data-en-<attr>`, документ-мета — через объект `DOC_META`, тексты кейсов — через поля `*_en` в массиве `CASES`. Небольшой i18n-модуль в `app.js` (`setLang`/`getLang`/`tr`) меняет всё на лету и пишет выбор в `localStorage`.

**Tech Stack:** Ванильный JS (ES2020+), статический HTML, CSS. Без сборщика и зависимостей. Node — только для dev-скрипта проверки покрытия.

## Global Constraints

- Чистый ванильный JS, без сборщика и внешних зависимостей в рантайме.
- Не менять существующие классы и `id` — `app.js` завязан на них.
- RU остаётся дефолтным inline-текстом в HTML (важно для SEO).
- Любой доступ к `localStorage` обёрнут в `try/catch` (приватный режим).
- Хелпер перевода полей кейса называется `tr` (имя `t` уже занято в цикле `detailTags.forEach((t) => …)` в app.js).
- Технические теги и названия (LangGraph, MCP, RAG, FastAPI, Apache Kafka, LanceDB, TypeScript, Python, Next.js и т.п.) НЕ переводятся.
- Имя бренда «Daniil Lapshin» не переводится.
- Язык по умолчанию — `ru`. Поддерживаемые: `["ru","en"]`.

## Setup (перед Task 1)

Работа ведётся в изолированной ветке/worktree (на старте репозитория ветка `main`, в дереве есть несохранённый `style.css`). Создать ветку, например `feat/language-switcher`, и вести все коммиты в ней.

## Файловая структура

- **Modify `app.js`** — (1) новый i18n-модуль на верхнем уровне (после массива `CASES`, перед IIFE на строке 204); (2) рефактор модала кейса внутри блока `if (caseModal)` (split `openCase` → `fillCase` + `openCase`, трекинг `currentCaseId`, подписка на смену языка); (3) поля `*_en` в каждом объекте `CASES`; (4) вызов `initI18n()` в конце IIFE.
- **Modify `index.html`** — кнопка `.lang-toggle` в `.nav-cta` и в `.mobile-menu`; атрибуты `data-en` / `data-en-<attr>` на всём переводимом контенте.
- **Modify `style.css`** — стили `.lang-toggle`.
- **Create `scripts/check-i18n-coverage.mjs`** — dev-скрипт-чекер покрытия `data-en` (не часть рантайма сайта).

## Глоссарий переводов (для единообразия)

| RU | EN |
|----|----|
| Услуги | Services |
| Процесс | Process |
| Кейсы | Cases |
| FAQ | FAQ |
| Написать в Telegram | Message me on Telegram |
| Посмотреть кейсы | View cases |
| Показать все кейсы | Show all cases |
| AI-продукты / ИИ-продукты | AI products |
| ИИ-агенты | AI agents |
| RAG-системы | RAG systems |
| чат-боты | chatbots |
| CRM | CRMs |
| highload-бэкенды | highload backends |
| от идеи и MVP до надёжного продакшена | from idea and MVP to reliable production |
| современный стек | a modern stack |
| 3+ года | 3+ years |
| опыта в проде | in production |
| опыт 3+ года | 3+ years of experience |
| Под NDA | Under NDA |
| Внутренний продукт банка | Internal bank product |
| Роль | Role |
| Задача | Task |
| Решение | Solution |
| Результат | Result |
| Открыть кейс: … | Open case: … |
| Меню | Menu |

Тексты-абзацы переводить по смыслу, сохраняя тон (профессиональный, лаконичный). `&nbsp;` и `&#8209;` (неразрывный дефис) в EN-значениях можно не сохранять — для английского они не нужны.

---

### Task 1: i18n-движок + кнопка-переключатель (фундамент)

Создаёт работающее переключение на примере навигации. Остальной контент переводится в Task 2–4 тем же механизмом.

**Files:**
- Modify: `app.js` (вставка модуля после строки 199; `initI18n()` в конце IIFE)
- Modify: `index.html` (кнопка в `.nav-cta` ~строка 45–50 и в `.mobile-menu` ~строка 53–59; `data-en` на nav-ссылках строки 31–36, 54–58; `data-en-aria-label` на бургере строка 46)
- Modify: `style.css` (стили `.lang-toggle`)

**Interfaces:**
- Produces (верхний уровень app.js, доступны внутри IIFE через замыкание):
  - `getLang(): "ru"|"en"`
  - `setLang(lang: "ru"|"en"): void` — применяет язык ко всему документу
  - `tr(obj: object, field: string): string` — поле объекта по текущему языку (`obj[field+"_en"] ?? obj[field]` для EN)
  - `onLangChange(fn: (lang) => void): void` — подписка на смену языка
  - `initI18n(): void` — снимок RU, навешивание обработчиков, применение сохранённого языка
  - `DOC_META.en` — объект `{htmlLang, title, description, ogTitle, ogDescription, ogLocale}`
- Consumes: ничего (первая задача).

- [ ] **Step 1: Вставить i18n-модуль в `app.js`**

Вставить СРАЗУ после `];` (конец массива `CASES`, строка 199) и ПЕРЕД `(function () {` (строка 204):

```js
/* ============================================================
   i18n — переключение языка RU / EN.
   RU — исходный inline-текст разметки. EN: текст в data-en,
   атрибуты в data-en-<attr>, документ-мета в DOC_META.
   ============================================================ */
const LANG_KEY = "lang";
const SUPPORTED = ["ru", "en"];
const I18N_ATTRS = ["aria-label", "alt", "title", "placeholder"];
let currentLang = "ru";
const langListeners = [];

// Документ-мета. ru заполняется снимком со страницы в captureRuMeta().
const DOC_META = {
  ru: null,
  en: {
    htmlLang: "en",
    title: "Daniil Lapshin — AI Engineer & Fullstack Developer",
    description:
      "Daniil Lapshin — AI Engineer and fullstack developer with 3+ years of experience. AI agents, RAG systems, chatbots, CRMs and highload backends in TypeScript and Python — from MVP to production.",
    ogTitle: "Daniil Lapshin — AI Engineer & Fullstack Developer",
    ogDescription:
      "AI agents, RAG systems, CRMs and web apps on a modern stack — from MVP to reliable production. 3+ years of experience.",
    ogLocale: "en_US",
  },
};

function readStoredLang() {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return SUPPORTED.includes(v) ? v : null;
  } catch (_) {
    return null;
  }
}
function writeStoredLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (_) {
    /* приватный режим — работаем только в памяти */
  }
}

function getLang() {
  return currentLang;
}

// Перевод поля объекта кейса по текущему языку: tr(d, "task").
function tr(obj, field) {
  if (currentLang === "en") return obj[field + "_en"] ?? obj[field];
  return obj[field];
}

// Подписка на смену языка (модал кейса перерисовывает себя).
function onLangChange(fn) {
  langListeners.push(fn);
}

function captureRuMeta() {
  const get = (sel) => {
    const el = document.querySelector(sel);
    return el ? el.getAttribute("content") : null;
  };
  DOC_META.ru = {
    htmlLang: "ru",
    title: document.title,
    description: get('meta[name="description"]'),
    ogTitle: get('meta[property="og:title"]'),
    ogDescription: get('meta[property="og:description"]'),
    ogLocale: get('meta[property="og:locale"]'),
  };
}

// Один раз: сохранить исходные RU-значения для точного возврата на RU.
function snapshotRu() {
  document.querySelectorAll("[data-en]").forEach((el) => {
    if (!el.hasAttribute("data-ru")) el.setAttribute("data-ru", el.textContent);
  });
  I18N_ATTRS.forEach((attr) => {
    document.querySelectorAll(`[data-en-${attr}]`).forEach((el) => {
      const ruName = `data-ru-${attr}`;
      if (!el.hasAttribute(ruName))
        el.setAttribute(ruName, el.getAttribute(attr) ?? "");
    });
  });
}

function applyDocMeta(lang) {
  const m = DOC_META[lang];
  if (!m) return;
  document.documentElement.setAttribute("lang", m.htmlLang);
  if (m.title != null) document.title = m.title;
  const set = (sel, val) => {
    const el = document.querySelector(sel);
    if (el && val != null) el.setAttribute("content", val);
  };
  set('meta[name="description"]', m.description);
  set('meta[property="og:title"]', m.ogTitle);
  set('meta[property="og:description"]', m.ogDescription);
  set('meta[property="og:locale"]', m.ogLocale);
}

function updateToggle(lang) {
  const target = lang === "ru" ? "EN" : "RU";
  document.querySelectorAll(".lang-toggle").forEach((btn) => {
    const label = btn.querySelector(".lang-toggle-label");
    if (label) label.textContent = target;
    btn.setAttribute(
      "aria-label",
      lang === "ru" ? "Switch to English" : "Переключить на русский"
    );
  });
}

function setLang(lang) {
  if (!SUPPORTED.includes(lang)) lang = "ru";
  currentLang = lang;
  writeStoredLang(lang);

  document.querySelectorAll("[data-en]").forEach((el) => {
    const ru = el.getAttribute("data-ru");
    el.textContent =
      lang === "en" ? el.getAttribute("data-en") : ru ?? el.textContent;
  });
  I18N_ATTRS.forEach((attr) => {
    document.querySelectorAll(`[data-en-${attr}]`).forEach((el) => {
      const ru = el.getAttribute(`data-ru-${attr}`);
      const en = el.getAttribute(`data-en-${attr}`);
      el.setAttribute(attr, lang === "en" ? en : ru ?? el.getAttribute(attr));
    });
  });

  applyDocMeta(lang);
  updateToggle(lang);
  langListeners.forEach((fn) => {
    try {
      fn(lang);
    } catch (_) {
      /* слушатель не должен ронять переключение */
    }
  });
}

function initI18n() {
  captureRuMeta();
  snapshotRu();
  document.querySelectorAll(".lang-toggle").forEach((btn) => {
    btn.addEventListener("click", () =>
      setLang(currentLang === "ru" ? "en" : "ru")
    );
  });
  setLang(readStoredLang() ?? "ru");
}
```

- [ ] **Step 2: Вызвать `initI18n()` в конце IIFE**

Найти закрытие IIFE (строка `})();` в самом конце `app.js`). ПЕРЕД ним добавить отдельной строкой:

```js
  initI18n();
```

(Вызов в конце IIFE гарантирует, что подписки модала из Task 3 уже зарегистрированы к моменту первого `setLang`.)

- [ ] **Step 3: Добавить кнопку-переключатель в `.nav-cta`**

В `index.html` внутри `<div class="nav-cta">` ПЕРЕД `<button class="burger" …>` (строка 46) вставить:

```html
      <button class="lang-toggle" type="button" aria-label="Switch to English">
        <svg class="lang-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M3 12h18"></path>
          <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18"></path>
        </svg>
        <span class="lang-toggle-label">EN</span>
      </button>
```

- [ ] **Step 4: Добавить кнопку-переключатель в `.mobile-menu`**

В `index.html` внутри `<div class="mobile-menu" id="mobileMenu">` ПЕРВЫМ дочерним элементом (перед строкой 54 `<a href="#services">Услуги</a>`) вставить ту же кнопку:

```html
      <button class="lang-toggle" type="button" aria-label="Switch to English">
        <svg class="lang-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M3 12h18"></path>
          <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18"></path>
        </svg>
        <span class="lang-toggle-label">EN</span>
      </button>
```

- [ ] **Step 5: Перевести навигацию (`data-en`) и бургер**

В `index.html`:

Nav-ссылки (строки 31–36):
```html
    <div class="nav-links">
      <a href="#services" data-en="Services">Услуги</a>
      <a href="#process" data-en="Process">Процесс</a>
      <a href="#cases" data-en="Cases">Кейсы</a>
      <a href="#faq" data-en="FAQ">FAQ</a>
    </div>
```

Nav-CTA ссылка «Кейсы» (строка 38) и подпись Telegram (строка 44):
```html
      <a href="#cases" class="btn btn-ghost" style="padding:11px 18px;font-size:14px" data-en="Cases">Кейсы</a>
```
```html
        <span class="nav-tg-label" data-en="Telegram">Telegram</span>
```
(«Telegram» одинаков в обоих языках — `data-en` оставляем для единообразия; на результат не влияет.)

Бургер (строка 46) — перевод `aria-label`:
```html
      <button class="burger" id="burger" aria-label="Меню" data-en-aria-label="Menu" aria-expanded="false" aria-controls="mobileMenu">
```

Мобильное меню (строки 54–58):
```html
      <a href="#services" data-en="Services">Услуги</a>
      <a href="#process" data-en="Process">Процесс</a>
      <a href="#cases" data-en="Cases">Кейсы</a>
      <a href="#faq" data-en="FAQ">FAQ</a>
      <a href="https://t.me/brojuy" target="_blank" rel="noopener noreferrer" data-en="Message me on Telegram">Написать в Telegram</a>
```

- [ ] **Step 6: Стили `.lang-toggle` в `style.css`**

Добавить в конец `style.css` (значения переменных взяты из существующей палитры; если переменных с такими именами нет — заменить на используемые в файле, ориентируясь на стиль `.btn-ghost`):

```css
/* ===== Переключатель языка ===== */
.lang-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 12px;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  color: var(--text, #1d1d1f);
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}
.lang-toggle:hover {
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.28);
}
.lang-toggle:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
.lang-toggle-icon {
  width: 16px;
  height: 16px;
}
.lang-toggle-label {
  letter-spacing: 0.02em;
}
/* в мобильном меню кнопка занимает свою строку */
.mobile-menu .lang-toggle {
  align-self: flex-start;
}
```

- [ ] **Step 7: Проверка в браузере**

Открыть `index.html` в браузере (или `python3 -m http.server` в корне и зайти на `http://localhost:8000`).
Ожидаемо:
- В хедере есть кнопка `🌐 EN`. Клик → ссылки навигации становятся `Services / Process / Cases / FAQ`, подпись кнопки меняется на `RU`, `<html lang>` = `en` (DevTools → Elements), `<title>` меняется на английский.
- Повторный клик возвращает русский.
- Перезагрузка страницы (F5) сохраняет последний выбранный язык.
- Мобильное меню (узкий вьюпорт): кнопка переключателя там тоже есть и работает.

- [ ] **Step 8: Commit**

```bash
git add app.js index.html style.css
git commit -m "feat(i18n): add language toggle engine and header switcher"
```

---

### Task 2: Перевод hero, услуг и процесса (`data-en` в index.html)

Чисто контентная задача: проставить `data-en` / `data-en-<attr>` на текстовых элементах секций hero, transition, services, process. Логику не трогаем.

**Files:**
- Modify: `index.html` (секции от `<header class="hero">` строка 62 до конца секции процесса перед `<section id="cases">` строка 390)

**Interfaces:**
- Consumes: механизм `data-en` из Task 1.
- Produces: ничего нового (контент).

- [ ] **Step 1: Перевести hero**

По образцу (строки 68–91). Каждый видимый текстовый элемент получает `data-en`; `alt` фото — `data-en-alt`.

> **Ключевое правило (корректность):** `data-en` подменяет `textContent`, что СТИРАЕТ вложенные теги. А снимок `data-ru` хранит только текст без тегов — поэтому вложенная разметка (`<em>`, иконки) пропадёт даже при возврате на RU. Поэтому: `data-en` вешаем ТОЛЬКО на элементы-листья, содержащие чистый текст. Если внутри есть форматирующие теги — вешаем `data-en` на каждый такой внутренний тег и оборачиваем остаток текста в свой `<span data-en>`. Сам тег при этом сохраняется (меняется лишь его `textContent`), стиль остаётся в обоих языках. Неразрывные пробелы (`&nbsp;`, `&#8209;`) — это символы, а не теги, и `textContent` их сохраняет.

`<h1>` содержит `<em>` — переводим `<em>` и остаток отдельно, чтобы курсив сохранился:
```html
          <h1 class="reveal in" data-d="1"><em data-en="AI products">AI&#8209;продукты</em><span data-en=", that work for business">, которые работают на&nbsp;бизнес</span></h1>
          <p class="hero-sub reveal in" data-d="2" data-en="I design AI agents, RAG systems, chatbots, CRMs and highload backends — from idea and MVP to reliable production on a modern stack.">Проектирую ИИ-агентов, RAG-системы, чат-боты, CRM и&nbsp;highload-бэкенды&nbsp;— от&nbsp;идеи и&nbsp;MVP до&nbsp;надёжного продакшена на&nbsp;современном стеке.</p>
```
(`hero-sub` — чистый `<p>` без тегов, поэтому `data-en` на нём самом.)
Кнопки hero (строки 71–78) — текст в кнопке Telegram идёт текстом вместе с SVG; чтобы `data-en` не затёр SVG, обернуть текст в `<span>` и перевести span:
```html
            <a href="https://t.me/brojuy" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg">
              <span data-en="Message me on Telegram">Написать в Telegram</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M22 3 11 14"></path>
                <path d="M22 3 15 21l-4-7-7-4 18-7Z"></path>
              </svg>
            </a>
            <a href="#cases" class="btn btn-ghost btn-lg" data-en="View cases">Посмотреть кейсы</a>
```
(`data-en` на внутреннем `<span>`, а не на `<a>` — иначе SVG-иконка была бы стёрта; это прямое следствие ключевого правила выше.)

Фото (строка 85) и бейдж (строки 88–90):
```html
            <img src="public/me.jpg" alt="Даниил Лапшин — AI Engineer и fullstack-разработчик" data-en-alt="Daniil Lapshin — AI Engineer and fullstack developer" width="1200" height="1600">
```
```html
            <div class="hb-eyebrow" data-en="AI Engineer · Fullstack">AI Engineer · Fullstack</div>
            <div class="hb-num" data-en="3+ years">3+ года</div>
            <div class="hb-cap" data-en="in production">опыта в&nbsp;проде</div>
```

- [ ] **Step 2: Перевести секции transition, services, process**

Прочитать `index.html` строки 97–388. На каждый видимый текстовый элемент (заголовки секций, подзаголовки, карточки услуг, шаги процесса, табы) добавить `data-en="…"` с переводом по глоссарию. Применять правило о дочерних тегах из Step 1 (оборачивать текст в `<span>` там, где внутри есть иконки/SVG). Технические термины не переводить.

Пример паттерна (заголовок секции «Услуги» — подставить реальный русский подзаголовок из файла и его перевод):
```html
        <h2 class="sec-title" data-en="Services">Услуги</h2>
        <p class="sec-sub" data-en="<английский перевод реального подзаголовка>"><реальный русский подзаголовок из файла></p>
```

- [ ] **Step 3: Проверка в браузере**

Переключить на EN. Hero, услуги, процесс полностью на английском; иконки/кнопки не сломаны; переключение туда-обратно корректно.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(i18n): translate hero, services and process sections"
```

---

### Task 3: Кейсы — карточки + поля `*_en` + модал

Карточки (статичный HTML) переводятся через `data-en`; данные модала — через поля `*_en` в `CASES`; `openCase` разбивается на `fillCase` + `openCase` и подписывается на смену языка.

**Files:**
- Modify: `index.html` (секция cases, строки 389–575: заголовок секции, карточки `.case`, `data-en-aria-label`, `data-en-alt`, текст карточек, кнопка `#casesMore` строка 575)
- Modify: `app.js` (поля `*_en` в каждом объекте `CASES` строки 14–199; рефактор блока модала строки 556–700)

**Interfaces:**
- Consumes: `tr(obj, field)`, `onLangChange(fn)`, `getLang()`, `currentLang` из Task 1.
- Produces: поля `title_en, summary_en, task_en, solution_en, result_en, kicker_en, role_en` (все кейсы) и `ndaSub_en` (кейс `sber`). Функция `fillCase(d)` и переменная `currentCaseId` внутри блока модала.

- [ ] **Step 1: Добавить поля `*_en` в массив `CASES`**

В каждый из 6 объектов `CASES` добавить параллельные английские поля рядом с русскими. Полный образец для кейса `sber` (строки 15–37) — добавляемые поля выделены:

```js
  {
    id: "sber",
    year: 2026,
    title: "Сбер",
    title_en: "Sber",
    shotAlt: "Сбер — ИИ-агент и RAG над дизайн-системой",
    cardTags: [{ label: "AI Engineer" }, { label: "LLM / RAG", alt: true }],
    cardTask: "Дать инженерам и дизайнерам ИИ-помощника по дизайн-системе.",
    cardResult:
      "Универсальный агент со скиллами, MCP-сервер с RAG и чат-бот для дизайнеров.",
    kicker: "Кейс · AI Engineer",
    kicker_en: "Case · AI Engineer",
    summary:
      "Универсальный ИИ-агент, MCP-сервер с RAG над внутренней дизайн-системой и чат-бот для дизайнеров.",
    summary_en:
      "A universal AI agent, an MCP server with RAG over the internal design system, and a chatbot for designers.",
    detailTags: ["LangGraph", "MCP", "RAG", "Apache Kafka", "FastAPI", "LanceDB"],
    task: "Дать инженерам и дизайнерам быстрый доступ к знаниям по внутренней дизайн-системе и автоматизировать рутину тестирования и дизайна.",
    task_en:
      "Give engineers and designers fast access to knowledge about the internal design system and automate routine testing and design work.",
    solution:
      "Разработал универсального ИИ-агента с системой скиллов и интегрировал его с Apache Kafka для аудита и отказоустойчивости. Построил MCP-сервер с RAG над дизайн-системой и на его основе — чат-бот, который отвечает дизайнерам на вопросы по системе.",
    solution_en:
      "Built a universal AI agent with a skills system and integrated it with Apache Kafka for auditing and fault tolerance. Built an MCP server with RAG over the design system and, on top of it, a chatbot that answers designers' questions about the system.",
    result:
      "Команды получают ответы по дизайн-системе за секунды, а агентская платформа легко расширяется новыми скиллами и масштабируется.",
    result_en:
      "Teams get answers about the design system in seconds, and the agent platform scales and easily extends with new skills.",
    role: "Роль: AI Engineer · TypeScript, Python, LangGraph, MCP, Kafka",
    role_en: "Role: AI Engineer · TypeScript, Python, LangGraph, MCP, Kafka",
    nda: true,
    ndaSub: "Внутренний продукт банка",
    ndaSub_en: "Internal bank product",
    image: "public/cases/sber-nda.png",
    gallery: [],
  },
```

Для остальных 5 кейсов (`antiques`, `astra`, `inspection`, `marking`, `dealcenter`) добавить тот же набор полей `*_en`, переведя их существующие RU-значения по глоссарию: обязательно `title_en, kicker_en, summary_en, task_en, solution_en, result_en, role_en`; `ndaSub_en` — только если у кейса есть `nda: true`. Поля `cardTask`/`cardResult`/`shotAlt` НЕ дублируем в `CASES` — карточки переводятся в HTML (Step 3). `detailTags`/`cardTags` не переводим.

- [ ] **Step 2: Рефактор модала — split `fillCase`/`openCase` + трекинг + подписка**

В `app.js` внутри блока `if (caseModal) {`:

(a) Сразу после строки `if (caseModal) {` (строка 415) объявить трекинг открытого кейса:
```js
    let currentCaseId = null;
```

(b) Заменить функцию `openCase` (строки 556–661) на пару `fillCase` + `openCase`. `fillCase` отвечает за текст (он перерисовывается при смене языка), `openCase` — за состояние, галерею и открытие:

```js
    const fillCase = (d) => {
      if (cmHero) {
        if (d.nda) {
          cmHero.classList.add("nda");
          cmHero.innerHTML =
            '<svg class="nda-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>' +
            '<span class="nda-title">' +
            (currentLang === "en" ? "Under NDA" : "Под NDA") +
            "</span>" +
            '<span class="nda-sub">' +
            (tr(d, "ndaSub") ?? "") +
            "</span>";
        } else {
          cmHero.classList.remove("nda");
          cmHero.textContent = tr(d, "title");
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
      if (cmKicker) cmKicker.textContent = tr(d, "kicker");
      if (cmTitle) cmTitle.textContent = tr(d, "title");
      if (cmSummary) cmSummary.textContent = tr(d, "summary");
      if (cmTask) cmTask.textContent = tr(d, "task");
      if (cmSolution) cmSolution.textContent = tr(d, "solution");
      if (cmResult) cmResult.textContent = tr(d, "result");
      if (cmRole) cmRole.textContent = tr(d, "role");
      if (cmTags) {
        cmTags.innerHTML = "";
        d.detailTags.forEach((tag) => {
          const s = document.createElement("span");
          s.className = "ctag";
          s.textContent = tag;
          cmTags.appendChild(s);
        });
      }
    };

    const openCase = (id) => {
      const d = CASES.find((c) => c.id === id);
      if (!d) return;
      caseLastFocus = document.activeElement;
      currentCaseId = id;
      fillCase(d);
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
```

(c) В функции `closeCase` (строки 662–674) добавить сброс трекинга — первой строкой тела:
```js
    const closeCase = () => {
      currentCaseId = null;
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
```

(d) Сразу ПОСЛЕ определения `closeCase` зарегистрировать перерисовку открытого модала при смене языка:
```js
    onLangChange(() => {
      if (!currentCaseId) return;
      const d = CASES.find((c) => c.id === currentCaseId);
      if (d) fillCase(d);
    });
```

- [ ] **Step 3: Перевести карточки кейсов в `index.html`**

Заголовок секции (строки ~390–398) и кнопку `#casesMore` (строка 575):
```html
      <button class="cases-more" id="casesMore" type="button" aria-controls="casesGrid" aria-expanded="false" data-en="Show all cases">Показать все кейсы</button>
```
Для каждой `<article class="case" …>` (sber строка 400, antiques 435, astra 463, inspection 491, marking 519, dealcenter 547):
- `aria-label="Открыть кейс: X"` → добавить `data-en-aria-label="Open case: X_en"`
- `<img … alt="…">` → добавить `data-en-alt="…"`
- видимый текст карточки (задача/результат/подписи) → `data-en="…"` на текстовых элементах (тех-теги вроде `AI Engineer`, `LLM / RAG` не трогаем).

Образец для карточки `sber` (строка 400 и `<img>` строка 411):
```html
        <article class="case" data-case="sber" tabindex="0" role="button" aria-haspopup="dialog" aria-label="Открыть кейс: Сбер" data-en-aria-label="Open case: Sber">
```
```html
            <img src="public/cases/sber-nda.png" alt="Сбер — ИИ-агент и RAG над дизайн-системой" data-en-alt="Sber — AI agent and RAG over the design system">
```
Прочитать строки 400–574 и проставить `data-en` на каждый видимый русский текст внутри карточек по тому же принципу.

- [ ] **Step 4: Проверка в браузере**

- На EN заголовки/тексты карточек и их `aria-label`/`alt` английские.
- Клик по карточке открывает модал на английском (заголовок, kicker, summary, задача/решение/результат, роль). Для `sber` бейдж «Under NDA», подпись «Internal bank product».
- При ОТКРЫТОМ модале клик по переключателю меняет язык текста модала, не закрывая его и не сбрасывая галерею.
- Возврат на RU — всё по-русски. Тех-теги в модале неизменны.

- [ ] **Step 5: Commit**

```bash
git add index.html app.js
git commit -m "feat(i18n): translate case cards and localize case modal"
```

---

### Task 4: Перевод FAQ, контактов и футера + проверка документ-меты

**Files:**
- Modify: `index.html` (секции FAQ, контакты/футер — строки 576–739; повторно проверить теги `<head>` строки 1–22 — менять их НЕ нужно, EN-значения уже в `DOC_META.en`)

**Interfaces:**
- Consumes: механизм `data-en` (Task 1), `DOC_META.en` (Task 1).

- [ ] **Step 1: Перевести FAQ и футер**

Прочитать `index.html` строки 576–739. На каждый видимый текстовый элемент (вопросы и ответы FAQ, заголовки, контактные подписи, текст футера, повтор nav в футере строки ~660–670) добавить `data-en="…"`. Ссылки-`<a>` с иконками — оборачивать текст в `<span data-en>` (правило из Task 2 Step 1). Год/копирайт с не-переводимым текстом не трогать; «Написать в Telegram» → `data-en="Message me on Telegram"`.

- [ ] **Step 2: Сверить значения `DOC_META.en`**

Открыть `<head>` (строки 5–14) и убедиться, что английские `title`/`description`/`og:*` в `DOC_META.en` (Task 1) корректно соответствуют по смыслу русским. При необходимости отредактировать `DOC_META.en` в `app.js`. `og:locale` для EN = `en_US`.

- [ ] **Step 3: Проверка в браузере**

Переключить на EN: FAQ и футер полностью английские. В DevTools → Elements: `<html lang="en">`, `<title>` английский, `<meta name="description">` английский, `<meta property="og:locale" content="en_US">`. Возврат на RU восстанавливает русские значения меты.

- [ ] **Step 4: Commit**

```bash
git add index.html app.js
git commit -m "feat(i18n): translate FAQ and footer, finalize SEO meta"
```

---

### Task 5: Dev-чекер покрытия `data-en` + финальная проверка

**Files:**
- Create: `scripts/check-i18n-coverage.mjs`

**Interfaces:**
- Consumes: ничего (читает `index.html` как текст).

- [ ] **Step 1: Написать скрипт-чекер**

Создать `scripts/check-i18n-coverage.mjs`:

```js
#!/usr/bin/env node
/*
 * Эвристическая проверка покрытия переводами.
 * Находит в index.html видимый русский текст у элементов без data-en.
 * Запуск из корня проекта: node scripts/check-i18n-coverage.mjs
 * Это dev-инструмент, не часть рантайма сайта.
 *
 * Ограничения: не проверяет атрибуты (alt/aria-label) — их сверяем вручную;
 * эвристика по последнему открывающему тегу может давать ложные срабатывания
 * на вложенной разметке — это нормально для чек-листа.
 */
import { readFileSync } from "node:fs";

const url = new URL("../index.html", import.meta.url);
const html = readFileSync(url, "utf8");

// Убираем зоны без переводимого видимого текста.
const stripped = html
  .replace(/<head[\s\S]*?<\/head>/i, "")
  .replace(/<script[\s\S]*?<\/script>/gi, "")
  .replace(/<style[\s\S]*?<\/style>/gi, "")
  .replace(/<svg[\s\S]*?<\/svg>/gi, "");

const CYR = /[А-Яа-яЁё]/;
const tokenRe = /<([a-zA-Z][^>]*)>|([^<]+)/g;
const missing = [];
let lastOpenTag = "";
let m;
while ((m = tokenRe.exec(stripped))) {
  if (m[1] !== undefined) {
    if (!m[1].startsWith("/")) lastOpenTag = m[1];
  } else {
    const text = m[2].trim();
    if (text && CYR.test(text) && !/\bdata-en\b/.test(lastOpenTag)) {
      missing.push({
        tag: lastOpenTag.slice(0, 60),
        text: text.replace(/\s+/g, " ").slice(0, 70),
      });
    }
  }
}

if (missing.length === 0) {
  console.log("OK: весь видимый русский текст имеет data-en.");
  process.exit(0);
}
console.log(`Без data-en — ${missing.length} фрагм.:`);
for (const x of missing) console.log(`  <${x.tag}> → "${x.text}"`);
process.exit(1);
```

- [ ] **Step 2: Запустить чекер и закрыть пробелы**

Run: `node scripts/check-i18n-coverage.mjs`
Ожидаемо: `OK: весь видимый русский текст имеет data-en.`
Если перечислены фрагменты — для каждого настоящего пропуска вернуться в `index.html` и добавить `data-en` (ложные срабатывания на вложенной разметке/копирайте — задокументировать, оставить). Повторять, пока не останутся только осознанно непереводимые строки.

- [ ] **Step 3: Финальные ручные сценарии**

Открыть сайт (`python3 -m http.server` → `http://localhost:8000`) и пройти:
1. RU→EN переключает ВЕСЬ видимый текст (nav, hero, услуги, процесс, карточки, FAQ, футер, мобильное меню).
2. F5 сохраняет выбранный язык.
3. Модал кейса открывается на текущем языке; переключение при открытом модале меняет его текст, не закрывая.
4. `<html lang>`, `<title>`, `<meta description>`, `og:locale` меняются (DevTools).
5. `aria-label`/`alt` переключаются (DevTools).
6. Приватный режим браузера (localStorage недоступен): переключение всё равно работает в рамках сессии, без ошибок в консоли.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-i18n-coverage.mjs
git commit -m "chore(i18n): add data-en coverage checker script"
```

---

## Зависимости задач

- Task 1 — фундамент, первым.
- Task 2, Task 4 — независимы между собой, оба зависят только от Task 1 (контент).
- Task 3 — зависит от Task 1 (использует `tr`/`onLangChange`).
- Task 5 — последним (проверяет результат Task 1–4).
