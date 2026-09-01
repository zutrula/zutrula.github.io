
    (() => {
      const root = document.getElementById("captain-crm-page");
      if (!root) return;
      root.querySelector(".cap-hero > div:first-child")?.classList.add("cap-reveal-copy");
      root.querySelectorAll(".cap-copy, .cap-centered").forEach((item) => item.classList.add("cap-reveal-copy"));
      root.querySelector(".cap-benefits")?.classList.add("cap-reveal-group");
      root.querySelector(".cap-final")?.classList.add("cap-reveal");
      const items = [...root.querySelectorAll(".cap-reveal, .cap-reveal-copy, .cap-reveal-group")];
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const embeddedPreview = window.self !== window.top;
      items.forEach((item) => {
        if (!item.matches(".cap-reveal-copy, .cap-reveal-group")) return;
        [...item.children].forEach((child, index) => {
          const step = item.classList.contains("cap-reveal-group") ? 140 : 120;
          child.style.setProperty("--cap-reveal-delay", `${index * step}ms`);
        });
      });
      if (embeddedPreview || reducedMotion || !("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
      }
      root.classList.add("cap-motion-ready");
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {threshold: .14, rootMargin: "0px 0px -7% 0px"});
      window.requestAnimationFrame(() => items.forEach((item) => observer.observe(item)));
    })();
  