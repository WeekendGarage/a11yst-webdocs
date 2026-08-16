"use strict";

const form = document.querySelector("[data-report-filters]");
const articles = Array.from(document.querySelectorAll("[data-finding]"));
const count = document.querySelector("[data-result-count]");

if (form instanceof HTMLFormElement && count instanceof HTMLElement) {
  const controls = Array.from(form.querySelectorAll("select"));

  const update = () => {
    const visibleFingerprints = new Set();
    let visibleCards = 0;
    for (const article of articles) {
      if (!(article instanceof HTMLElement)) continue;
      const matches = controls.every((control) => {
        if (!(control instanceof HTMLSelectElement) || control.value === "") return true;
        return article.dataset[control.name] === control.value;
      });
      article.hidden = !matches;
      if (matches) {
        visibleCards += 1;
        if (article.dataset.fingerprint) {
          visibleFingerprints.add(article.dataset.fingerprint);
        }
      }
    }
    const visible = visibleFingerprints.size > 0 ? visibleFingerprints.size : visibleCards;
    count.textContent = visible + (visible === 1 ? " finding shown" : " findings shown");
  };

  form.addEventListener("change", update);
  form.addEventListener("reset", () => {
    window.setTimeout(update, 0);
  });
  update();
}
