/**
 * a11yst promotional landing — home-only progressive enhancement.
 * No dependencies. Content remains visible without JavaScript.
 */

(function () {
  var revealObserver = null;
  var terminalTimer = null;
  var terminalSkip = null;
  var workflowTrailRaf = null;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function cleanup() {
    if (terminalTimer) {
      window.clearTimeout(terminalTimer);
      terminalTimer = null;
    }
    terminalSkip = null;
    setTerminalSkipVisible(false);
    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }
    if (workflowTrailRaf) {
      cancelAnimationFrame(workflowTrailRaf);
      workflowTrailRaf = null;
    }
  }

  function initReveal(root) {
    var items = root.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    items.forEach(function (item) {
      item.classList.add("a11yst-reveal-visible");
    });

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      return;
    }

    root.classList.add("js-motion-enabled");

    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("a11yst-reveal-pending");
          entry.target.classList.add("a11yst-reveal-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    items.forEach(function (item, index) {
      var rect = item.getBoundingClientRect();
      var inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
      if (inView) {
        item.classList.add("a11yst-reveal-visible");
        return;
      }
      item.classList.remove("a11yst-reveal-visible");
      item.classList.add("a11yst-reveal-pending");
      if (item.hasAttribute("data-reveal-delay")) {
        item.style.transitionDelay = String(Number(item.getAttribute("data-reveal-delay")) * 80) + "ms";
      } else if (index > 0) {
        item.style.transitionDelay = "0ms";
      }
      revealObserver.observe(item);
    });
  }

  function initWorkflow(root) {
    var workflow = root.querySelector("[data-workflow]");
    if (!workflow || !("IntersectionObserver" in window)) return;

    initWorkflowTrail(workflow);

    if (prefersReducedMotion()) return;
    workflow.classList.add("js-workflow-motion");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("a11yst-workflow--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(workflow);
  }

  function initWorkflowTrail(workflow) {
    if (prefersReducedMotion()) return;

    var svg = workflow.querySelector(".a11yst-workflow__trail");
    var pathEl = workflow.querySelector("#a11yst-workflow-trail-path");
    var glowEl = workflow.querySelector(".a11yst-workflow__trail-glow");
    var cards = workflow.querySelectorAll(".a11yst-workflow__item");
    if (!svg || !pathEl || !glowEl || cards.length !== 6) return;

    var glowRadius = 54;
    var glowDuration = 9000;
    var glowFalloff = glowRadius * 2.2;
    var glowAnimStart = null;
    var glowTrailVisible = false;
    var glowLevels = [0, 0, 0, 0, 0, 0];
    var cachedCardData = null;

    var desktopQuery = window.matchMedia("(min-width: 900px)");
    var tabletQuery = window.matchMedia("(min-width: 768px)");

    function cardPoints() {
      var box = workflow.getBoundingClientRect();
      var points = [];
      for (var i = 0; i < cards.length; i += 1) {
        var rect = cards[i].getBoundingClientRect();
        points.push({
          cx: rect.left + rect.width / 2 - box.left,
          cy: rect.top + rect.height / 2 - box.top,
          left: rect.left - box.left,
          right: rect.right - box.left,
          top: rect.top - box.top,
          bottom: rect.bottom - box.top,
        });
      }
      return { box: box, points: points };
    }

    function buildPath(data) {
      var p = data.points;
      var parts = ["M", p[0].cx, p[0].cy];

      if (desktopQuery.matches) {
        var y1 = p[0].cy;
        var y2 = p[3].cy;
        parts.push(
          "L", p[0].right + 2, y1,
          "L", p[1].left - 2, y1,
          "L", p[1].right + 2, y1,
          "L", p[2].left - 2, y1,
          "L", p[2].cx, y1,
          "L", p[2].cx, p[2].bottom + 2,
          "L", p[3].cx, p[3].top - 2,
          "L", p[3].cx, y2,
          "L", p[3].left - 2, y2,
          "L", p[4].right + 2, y2,
          "L", p[4].left - 2, y2,
          "L", p[5].right + 2, y2,
          "L", p[5].cx, y2
        );
      } else if (tabletQuery.matches) {
        var row1 = p[0].cy;
        var row2 = p[2].cy;
        var row3 = p[4].cy;
        parts.push(
          "L", p[0].right + 2, row1,
          "L", p[1].left - 2, row1,
          "L", p[1].cx, row1,
          "L", p[1].cx, p[1].bottom + 2,
          "L", p[2].cx, p[2].top - 2,
          "L", p[2].cx, row2,
          "L", p[2].left - 2, row2,
          "L", p[3].right + 2, row2,
          "L", p[3].cx, row2,
          "L", p[3].cx, p[3].bottom + 2,
          "L", p[4].cx, p[4].top - 2,
          "L", p[4].cx, row3,
          "L", p[4].right + 2, row3,
          "L", p[5].left - 2, row3,
          "L", p[5].cx, row3
        );
      } else {
        for (var i = 1; i < 6; i += 1) {
          parts.push(
            "L", p[i - 1].cx, p[i - 1].bottom + 2,
            "L", p[i].cx, p[i].top - 2
          );
          if (i === 5) parts.push("L", p[i].cx, p[i].cy);
        }
      }

      return parts.join(" ");
    }

    function smoothstep(value) {
      return value * value * (3 - 2 * value);
    }

    function glowStrengthForCard(point, card) {
      var nearestX = Math.max(card.left, Math.min(point.x, card.right));
      var nearestY = Math.max(card.top, Math.min(point.y, card.bottom));
      var dx = point.x - nearestX;
      var dy = point.y - nearestY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist >= glowFalloff) return 0;
      return smoothstep(1 - dist / glowFalloff);
    }

    function updateCardGlows(point, points) {
      for (var i = 0; i < cards.length; i += 1) {
        var target = point && points ? glowStrengthForCard(point, points[i]) : 0;
        glowLevels[i] += (target - glowLevels[i]) * 0.032;
        if (glowLevels[i] < 0.003) glowLevels[i] = 0;
        cards[i].style.setProperty(
          "--a11yst-workflow-glow-opacity",
          glowLevels[i].toFixed(3),
        );
      }
    }

    function tickGlow(now) {
      workflowTrailRaf = requestAnimationFrame(tickGlow);
      if (!glowTrailVisible) {
        updateCardGlows(null, null);
        return;
      }

      var length = pathEl.getTotalLength();
      if (!length) return;

      if (!glowAnimStart) glowAnimStart = now;
      var progress = ((now - glowAnimStart) % glowDuration) / glowDuration;
      var point = pathEl.getPointAtLength(progress * length);
      glowEl.setAttribute("cx", String(point.x));
      glowEl.setAttribute("cy", String(point.y));
      if (!cachedCardData) cachedCardData = cardPoints();
      updateCardGlows(point, cachedCardData.points);
    }

    function updateTrail() {
      cachedCardData = cardPoints();
      svg.setAttribute("viewBox", "0 0 " + cachedCardData.box.width + " " + cachedCardData.box.height);
      pathEl.setAttribute("d", buildPath(cachedCardData));
      workflow.classList.add("a11yst-workflow--trail-ready");
    }

    var resizeTimer = null;
    function scheduleUpdate() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(updateTrail, 80);
    }

    updateTrail();
    workflowTrailRaf = requestAnimationFrame(tickGlow);

    var glowObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          glowTrailVisible = entry.isIntersecting;
          if (!glowTrailVisible) updateCardGlows(null, null);
        });
      },
      { threshold: 0.08 },
    );
    glowObserver.observe(workflow);

    window.addEventListener("resize", scheduleUpdate);
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(scheduleUpdate).observe(workflow);
    }
    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", scheduleUpdate);
      tabletQuery.addEventListener("change", scheduleUpdate);
    }
  }

  function scrollTerminalToBottom(outputEl) {
    var body = outputEl.closest(".a11yst-terminal__body");
    if (body) body.scrollTop = body.scrollHeight;
  }

  function smoothScrollTerminalToBottom(body, done) {
    if (!body) {
      done();
      return;
    }

    var target = Math.max(0, body.scrollHeight - body.clientHeight);
    if (prefersReducedMotion() || target <= body.scrollTop) {
      body.scrollTop = target;
      done();
      return;
    }

    body.scrollTo({ top: target, behavior: "smooth" });
    var fallback = window.setTimeout(done, 900);
    body.addEventListener(
      "scrollend",
      function () {
        window.clearTimeout(fallback);
        done();
      },
      { once: true },
    );
  }

  function endTerminalAnimation(outputEl, body) {
    outputEl.classList.remove("is-typing");
    if (body) body.classList.remove("a11yst-terminal__body--animating");
    setTerminalSkipVisible(false);
    terminalSkip = null;
  }

  function appendTypedChar(outputEl, char, className) {
    if (className) {
      var last = outputEl.lastElementChild;
      if (last && last.classList.contains(className)) {
        last.textContent += char;
        scrollTerminalToBottom(outputEl);
        return;
      }
      var span = document.createElement("span");
      span.className = className;
      span.textContent = char;
      outputEl.appendChild(span);
      scrollTerminalToBottom(outputEl);
      return;
    }

    var lastNode = outputEl.lastChild;
    if (lastNode && lastNode.nodeType === Node.TEXT_NODE) {
      lastNode.textContent += char;
      scrollTerminalToBottom(outputEl);
      return;
    }
    outputEl.appendChild(document.createTextNode(char));
    scrollTerminalToBottom(outputEl);
  }

  function setTerminalSkipVisible(visible) {
    var skipButton = document.querySelector("[data-terminal-skip]");
    if (!skipButton) return;
    skipButton.hidden = !visible;
  }

  function playTerminalAnimation(steps) {
    var outputEl = document.getElementById("a11yst-terminal-output");
    if (!outputEl || !steps || !steps.length) return;

    var body = outputEl.closest(".a11yst-terminal__body");
    var staticHtml = outputEl.innerHTML;
    var stepIndex = 0;
    var charIndex = 0;

    if (terminalTimer) window.clearTimeout(terminalTimer);
    outputEl.innerHTML = "";
    outputEl.classList.add("is-typing");
    if (body) body.classList.add("a11yst-terminal__body--animating");
    scrollTerminalToBottom(outputEl);
    setTerminalSkipVisible(true);

    function finish() {
      scrollTerminalToBottom(outputEl);
      endTerminalAnimation(outputEl, body);
    }

    terminalSkip = function () {
      if (terminalTimer) window.clearTimeout(terminalTimer);
      terminalTimer = null;
      outputEl.innerHTML = staticHtml;
      outputEl.classList.remove("is-typing");
      setTerminalSkipVisible(false);
      terminalSkip = null;
      if (body) body.scrollTop = 0;
      smoothScrollTerminalToBottom(body, function () {
        endTerminalAnimation(outputEl, body);
      });
    };

    function runStep() {
      if (stepIndex >= steps.length) {
        finish();
        return;
      }

      var step = steps[stepIndex];
      if (step.action === "wait") {
        terminalTimer = window.setTimeout(function () {
          stepIndex += 1;
          charIndex = 0;
          runStep();
        }, step.ms);
        return;
      }

      if (step.action !== "type") {
        stepIndex += 1;
        runStep();
        return;
      }

      if (charIndex >= step.text.length) {
        stepIndex += 1;
        charIndex = 0;
        runStep();
        return;
      }

      appendTypedChar(outputEl, step.text.charAt(charIndex), step.class || "");
      charIndex += 1;
      terminalTimer = window.setTimeout(runStep, step.msPerChar || 48);
    }

    runStep();
  }

  function initTerminal(root) {
    var terminal = root.querySelector("[data-terminal]");
    if (!terminal || prefersReducedMotion()) return;

    var skipButton = terminal.querySelector("[data-terminal-skip]");
    if (skipButton) {
      skipButton.addEventListener("click", function () {
        if (terminalSkip) terminalSkip();
      });
    }

    var scriptUrl = new URL("assets/landing/terminal-animation.json", window.location.href).href;

    fetch(scriptUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        playTerminalAnimation(json);
      })
      .catch(function () {
        /* keep static fallback */
      });
  }

  function initHomeHeader() {
    var drawer = document.getElementById("__drawer");
    var mobileNav = document.querySelector(".a11yst-home-header__mobile");

    var header = document.querySelector(".md-header--a11yst-home");
    var heroTitle = document.getElementById("a11yst-hero-title");
    if (!header) return;

    var footer = document.querySelector(".a11yst-site-footer");
    var navSectionIds = [
      "a11yst-workflow-title",
      "a11yst-why-title",
      "a11yst-getting-started",
      "a11yst-community-title",
    ];
    var pinnedNavId = null;
    var navArrived = false;
    var userScrollDetected = false;

    function getNavIdFromHref(href) {
      if (!href || href.charAt(0) !== "#") return null;
      var id = href.slice(1);
      return navSectionIds.indexOf(id) !== -1 ? id : null;
    }

    function getHeaderNavLinks() {
      return Array.prototype.slice.call(header.querySelectorAll('a[href^="#"]'));
    }

    function applyActiveNav(activeId) {
      getHeaderNavLinks().forEach(function (link) {
        var href = link.getAttribute("href") || "";
        var isActive = activeId !== null && href === "#" + activeId;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }

    function syncHeaderBrand() {
      if (!heroTitle) return;
      var headerHeight = header.getBoundingClientRect().height;
      header.classList.toggle(
        "md-header--a11yst-brand",
        heroTitle.getBoundingClientRect().bottom <= headerHeight,
      );
    }

    function resolveNavSection(id) {
      var target = document.getElementById(id);
      if (!target) return null;
      if (
        id === "a11yst-workflow-title" ||
        id === "a11yst-why-title" ||
        id === "a11yst-community-title"
      ) {
        return target.closest(".a11yst-section") || target;
      }
      return target;
    }

    function isSectionReached(id) {
      var section = resolveNavSection(id);
      if (!section) return false;
      var marker = header.getBoundingClientRect().height + 50;
      return section.getBoundingClientRect().top <= marker + 4;
    }

    function computeScrollSpyActiveId() {
      var headerHeight = header.getBoundingClientRect().height;
      var marker = headerHeight + 50;
      var activeId = null;
      var bestScore = -1;

      navSectionIds.forEach(function (id, index) {
        var section = resolveNavSection(id);
        if (!section) return;

        var rect = section.getBoundingClientRect();
        if (rect.bottom <= headerHeight || rect.top >= window.innerHeight) return;

        var visibleTop = Math.max(rect.top, headerHeight);
        var visibleBottom = Math.min(rect.bottom, window.innerHeight);
        var visibleHeight = Math.max(0, visibleBottom - visibleTop);
        if (visibleHeight <= 0) return;

        var score = visibleHeight;
        if (rect.top <= marker) score += 1000;
        if (id === "a11yst-community-title" && rect.top <= window.innerHeight - 80) {
          score += 800;
        }
        score += index * 0.01;

        if (score > bestScore) {
          bestScore = score;
          activeId = id;
        }
      });

      if (heroTitle) {
        var firstSection = resolveNavSection(navSectionIds[0]);
        if (
          heroTitle.getBoundingClientRect().bottom > headerHeight &&
          firstSection &&
          firstSection.getBoundingClientRect().top > marker
        ) {
          activeId = null;
        }
      }

      return activeId;
    }

    function syncHeaderNav() {
      if (pinnedNavId) {
        if (isSectionReached(pinnedNavId)) navArrived = true;
        if (!(navArrived && userScrollDetected)) {
          applyActiveNav(pinnedNavId);
          return;
        }
        pinnedNavId = null;
        navArrived = false;
        userScrollDetected = false;
      }

      applyActiveNav(computeScrollSpyActiveId());
    }

    function smoothScrollToSection(id) {
      var target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    }

    function bindNavLinks(container) {
      container.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
          var id = getNavIdFromHref(link.getAttribute("href") || "");
          if (!id) return;

          event.preventDefault();
          if (drawer) drawer.checked = false;

          pinnedNavId = id;
          navArrived = false;
          userScrollDetected = false;
          applyActiveNav(id);
          smoothScrollToSection(id);
        });
      });
    }

    bindNavLinks(header);
    if (footer) bindNavLinks(footer);

    function onUserScrollIntent() {
      if (pinnedNavId && navArrived) userScrollDetected = true;
    }

    window.addEventListener("wheel", onUserScrollIntent, { passive: true });
    window.addEventListener("touchmove", onUserScrollIntent, { passive: true });
    window.addEventListener("keydown", function (event) {
      var scrollKeys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
      ];
      if (scrollKeys.indexOf(event.key) !== -1) onUserScrollIntent();
    });

    function syncHeader() {
      syncHeaderBrand();
      syncHeaderNav();
    }

    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
    window.addEventListener("resize", syncHeader);
  }

  function getClipboardCopiedLabel() {
    var config = document.getElementById("__config");
    if (!config) return "Copied to clipboard";
    try {
      var translations = JSON.parse(config.textContent).translations;
      return translations["clipboard.copied"] || "Copied to clipboard";
    } catch (error) {
      return "Copied to clipboard";
    }
  }

  function initSetupCopyTooltips(root) {
    var setup = root.querySelector(".a11yst-setup");
    if (!setup || setup.dataset.a11ystCopyInit === "true") return;
    setup.dataset.a11ystCopyInit = "true";

    var copiedLabel = getClipboardCopiedLabel();

    function ensureTooltip(highlight) {
      var tooltip = highlight.querySelector(".a11yst-setup-copy-tooltip");
      if (tooltip) return tooltip;

      tooltip = document.createElement("span");
      tooltip.className = "a11yst-setup-copy-tooltip";
      tooltip.setAttribute("role", "status");
      tooltip.setAttribute("aria-hidden", "true");
      highlight.appendChild(tooltip);
      return tooltip;
    }

    function showTooltip(highlight) {
      var tooltip = ensureTooltip(highlight);
      tooltip.textContent = copiedLabel;
      tooltip.setAttribute("aria-hidden", "false");
      tooltip.classList.add("is-visible");

      if (highlight.dataset.a11ystCopyTooltipTimer) {
        window.clearTimeout(Number(highlight.dataset.a11ystCopyTooltipTimer));
      }

      var hideTimer = window.setTimeout(function () {
        tooltip.classList.remove("is-visible");
        tooltip.setAttribute("aria-hidden", "true");
      }, 2000);
      highlight.dataset.a11ystCopyTooltipTimer = String(hideTimer);
    }

    function bindCopyButton(button) {
      if (button.dataset.a11ystCopyBound === "true") return;

      button.dataset.a11ystCopyBound = "true";
      button.removeAttribute("data-clipboard-target");
      button.removeAttribute("data-clipboard-text");

      button.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();

          var highlight = button.closest(".highlight");
          var pre = button.closest("pre");
          var code = pre ? pre.querySelector("code") : null;
          if (!highlight || !code || !navigator.clipboard) return;

          navigator.clipboard.writeText((code.textContent || "").trim()).then(
            function () {
              showTooltip(highlight);
            },
            function () {
              /* clipboard unavailable */
            },
          );
        },
        true,
      );
    }

    function scanCopyButtons() {
      setup
        .querySelectorAll('.highlight .md-code__button[data-md-type="copy"]')
        .forEach(bindCopyButton);
    }

    scanCopyButtons();
    window.setTimeout(scanCopyButtons, 0);
    window.setTimeout(scanCopyButtons, 250);

    new MutationObserver(scanCopyButtons).observe(setup, {
      childList: true,
      subtree: true,
    });
  }

  function initSetupSelector(root) {
    var setup = root.querySelector("[data-setup-selector]");
    if (!setup) return;

    var steps = Array.prototype.slice.call(
      setup.querySelectorAll(".a11yst-setup__nav .a11yst-setup-step"),
    );
    var panels = Array.prototype.slice.call(
      setup.querySelectorAll(".a11yst-setup__stage .a11yst-setup-step__panel"),
    );
    var mobile = setup.querySelector(".a11yst-setup__mobile");
    var nav = setup.querySelector(".a11yst-setup__nav");
    if (!steps.length || steps.length !== panels.length) return;

    var desktopQuery = window.matchMedia("(min-width: 768px)");

    function isDesktop() {
      return desktopQuery.matches;
    }

    function getActiveIndex() {
      for (var i = 0; i < steps.length; i += 1) {
        if (steps[i].classList.contains("is-active")) return i;
      }
      return 0;
    }

    function updateSetupIndicator() {
      if (!nav) return;

      if (!isDesktop()) {
        nav.style.removeProperty("--a11yst-setup-indicator-top");
        nav.style.removeProperty("--a11yst-setup-indicator-height");
        return;
      }

      var activeStep = nav.querySelector(".a11yst-setup-step.is-active");
      var trigger = activeStep
        ? activeStep.querySelector(".a11yst-setup-step__trigger")
        : null;
      if (!trigger) return;

      var navRect = nav.getBoundingClientRect();
      var triggerRect = trigger.getBoundingClientRect();
      nav.style.setProperty(
        "--a11yst-setup-indicator-top",
        triggerRect.top - navRect.top + "px",
      );
      nav.style.setProperty(
        "--a11yst-setup-indicator-height",
        triggerRect.height + "px",
      );
    }

    function setActive(index) {
      if (index < 0 || index >= steps.length) return;

      steps.forEach(function (step, i) {
        var active = i === index;
        step.classList.toggle("is-active", active);
        var trigger = step.querySelector(".a11yst-setup-step__trigger");
        var panel = panels[i];
        if (trigger) {
          trigger.setAttribute("aria-selected", active ? "true" : "false");
          trigger.tabIndex = active ? 0 : -1;
        }
        if (panel) {
          panel.hidden = isDesktop() ? !active : false;
        }
      });

      window.requestAnimationFrame(updateSetupIndicator);
    }

    function syncLayout() {
      if (mobile) {
        mobile.hidden = isDesktop();
      }

      if (isDesktop()) {
        setActive(getActiveIndex());
        return;
      }

      steps.forEach(function (step, i) {
        step.classList.remove("is-active");
        var trigger = step.querySelector(".a11yst-setup-step__trigger");
        var panel = panels[i];
        if (panel) panel.hidden = false;
        if (trigger) {
          trigger.setAttribute("aria-selected", "false");
          trigger.tabIndex = 0;
        }
      });
    }

    steps.forEach(function (step, index) {
      var trigger = step.querySelector(".a11yst-setup-step__trigger");
      if (!trigger) return;

      trigger.addEventListener("click", function () {
        if (!isDesktop()) return;
        setActive(index);
      });

      trigger.addEventListener("keydown", function (event) {
        if (!isDesktop()) return;

        var next = index;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          next = (index + 1) % steps.length;
          event.preventDefault();
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          next = (index - 1 + steps.length) % steps.length;
          event.preventDefault();
        } else if (event.key === "Home") {
          next = 0;
          event.preventDefault();
        } else if (event.key === "End") {
          next = steps.length - 1;
          event.preventDefault();
        } else {
          return;
        }

        setActive(next);
        var nextTrigger = steps[next].querySelector(".a11yst-setup-step__trigger");
        if (nextTrigger) nextTrigger.focus();
      });
    });

    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", syncLayout);
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(syncLayout);
    }

    window.addEventListener("resize", updateSetupIndicator);

    syncLayout();
  }

  function initWhyAccordion(root) {
    var accordion = root.querySelector(".a11yst-why-accordion");
    if (!accordion) return;

    var items = Array.prototype.slice.call(
      accordion.querySelectorAll(".a11yst-why-accordion__item"),
    );
    if (!items.length) return;

    function setItemState(item, open) {
      var trigger = item.querySelector(".a11yst-why-accordion__trigger");
      var panel = item.querySelector(".a11yst-why-accordion__panel");
      item.classList.toggle("is-active", open);
      if (trigger) trigger.setAttribute("aria-expanded", open ? "true" : "false");
      if (panel) {
        if (open) panel.removeAttribute("inert");
        else panel.setAttribute("inert", "");
      }
    }

    function closeItem(item) {
      setItemState(item, false);
    }

    function openItem(item) {
      setItemState(item, true);
    }

    function scrollAccordionItemIntoView(item) {
      var trigger = item.querySelector(".a11yst-why-accordion__trigger");
      if (!trigger) return;

      var header = document.querySelector(".md-header--a11yst");
      var headerHeight = header ? header.getBoundingClientRect().height : 52;
      var offset = headerHeight + 16;
      var targetTop =
        window.scrollY + trigger.getBoundingClientRect().top - offset;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    }

    function afterAccordionPanelTransitions(panels, callback) {
      if (prefersReducedMotion() || !panels.length) {
        callback();
        return;
      }

      var done = false;
      var pending = panels.slice();

      function finish() {
        if (done) return;
        done = true;
        pending.forEach(function (panel) {
          panel.removeEventListener("transitionend", onTransitionEnd);
        });
        callback();
      }

      function onTransitionEnd(event) {
        if (event.propertyName !== "grid-template-rows") return;

        var index = pending.indexOf(event.target);
        if (index === -1) return;

        pending.splice(index, 1);
        if (!pending.length) finish();
      }

      pending.forEach(function (panel) {
        panel.addEventListener("transitionend", onTransitionEnd);
      });

      window.setTimeout(finish, 320);
    }

    items.forEach(function (item) {
      var trigger = item.querySelector(".a11yst-why-accordion__trigger");
      if (!trigger) return;

      trigger.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-active");
        var previouslyActive = items.filter(function (entry) {
          return entry.classList.contains("is-active");
        });

        items.forEach(closeItem);
        if (!isOpen) {
          openItem(item);

          var animatingPanels = [];
          previouslyActive.forEach(function (entry) {
            if (entry === item) return;
            var panel = entry.querySelector(".a11yst-why-accordion__panel");
            if (panel) animatingPanels.push(panel);
          });

          var openedPanel = item.querySelector(".a11yst-why-accordion__panel");
          if (openedPanel) animatingPanels.push(openedPanel);

          afterAccordionPanelTransitions(animatingPanels, function () {
            scrollAccordionItemIntoView(item);
          });
        }
      });
    });
  }

  function initHome() {
    var root = document.querySelector(".a11yst-landing");
    if (!root) return;
    if (root.dataset.a11ystHomeInit === "true") return;
    root.dataset.a11ystHomeInit = "true";

    cleanup();
    initHomeHeader();
    initReveal(root);
    initWorkflow(root);
    initTerminal(root);
    initSetupCopyTooltips(root);
    initSetupSelector(root);
    initWhyAccordion(root);
  }

  function boot() {
    initHome();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(boot);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("pagehide", cleanup);
})();
