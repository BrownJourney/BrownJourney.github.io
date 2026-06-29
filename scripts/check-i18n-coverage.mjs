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
