function demoteCodeNavLandmarks() {
  document.querySelectorAll("nav.md-code__nav").forEach(function (nav) {
    const replacement = document.createElement("div");
    replacement.className = nav.className;
    replacement.innerHTML = nav.innerHTML;
    nav.replaceWith(replacement);
  });
}

function keepThemeRadiosOutOfTabOrder() {
  document.querySelectorAll('input.md-option[name="__palette"]').forEach(function (input) {
    input.tabIndex = -1;
  });
}

function keepHeaderPinned() {
  document.querySelectorAll(".md-header--a11yst").forEach(function (header) {
    if (header.hidden) header.hidden = false;
    if (header.dataset.a11ystHeaderPinned === "true") return;
    header.dataset.a11ystHeaderPinned = "true";
    new MutationObserver(function () {
      if (header.hidden) header.hidden = false;
    }).observe(header, { attributes: true, attributeFilter: ["hidden"] });
  });
}

var headerScrollProgressReady = false;
var headerScrollProgressTicking = false;

function updateHeaderScrollProgress() {
  var headers = document.querySelectorAll(".md-header--a11yst");
  if (!headers.length) return;

  var doc = document.documentElement;
  var maxScroll = doc.scrollHeight - window.innerHeight;
  var progress =
    maxScroll <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / maxScroll));

  headers.forEach(function (header) {
    header.style.setProperty("--a11yst-scroll-progress", String(progress));
  });
}

function queueHeaderScrollProgress() {
  if (headerScrollProgressTicking) return;
  headerScrollProgressTicking = true;
  requestAnimationFrame(function () {
    headerScrollProgressTicking = false;
    updateHeaderScrollProgress();
  });
}

function initHeaderScrollProgress() {
  updateHeaderScrollProgress();
  if (headerScrollProgressReady) return;
  headerScrollProgressReady = true;
  window.addEventListener("scroll", queueHeaderScrollProgress, { passive: true });
  window.addEventListener("resize", queueHeaderScrollProgress, { passive: true });
}

function bootA11yFixes() {
  demoteCodeNavLandmarks();
  keepThemeRadiosOutOfTabOrder();
  keepHeaderPinned();
  initHeaderScrollProgress();
}

document$.subscribe(bootA11yFixes);

new MutationObserver(bootA11yFixes).observe(document.documentElement, {
  childList: true,
  subtree: true,
});
