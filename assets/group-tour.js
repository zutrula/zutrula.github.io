
    (() => {
      const root = document.getElementById("group-tour-page");
      if (!root) return;
      root.querySelector(".gt-hero > div:first-child")?.classList.add("gt-reveal-copy");
      root.querySelectorAll(".gt-copy, .gt-centered").forEach((item) => item.classList.add("gt-reveal-copy"));
      root.querySelector(".gt-highlights")?.classList.add("gt-reveal-group");
      root.querySelector(".gt-roadmap > div:first-child")?.classList.add("gt-reveal-copy");
      root.querySelector(".gt-roadmap-items")?.classList.add("gt-reveal-group");
      root.querySelector(".gt-final")?.classList.add("gt-reveal");
      const items = [...root.querySelectorAll(".gt-reveal, .gt-reveal-copy, .gt-reveal-group")];
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const embeddedPreview = window.self !== window.top;
      items.forEach((item) => {
        if (!item.matches(".gt-reveal-copy, .gt-reveal-group")) return;
        [...item.children].forEach((child, index) => {
          const step = item.classList.contains("gt-reveal-group") ? 140 : 120;
          child.style.setProperty("--gt-reveal-delay", `${index * step}ms`);
        });
      });
      if (embeddedPreview || reducedMotion || !("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
      }
      root.classList.add("gt-motion-ready");
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {threshold: .14, rootMargin: "0px 0px -7% 0px"});
      window.requestAnimationFrame(() => items.forEach((item) => observer.observe(item)));
    })();
  