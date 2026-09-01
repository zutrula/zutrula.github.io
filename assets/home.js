
    (() => {
      const root = document.getElementById("zutrula-homepage-blueprint");
      if (!root) return;

      const stories = {
        group: {
          color: "#16bca9", kicker: "Group Tour",
          title: "One departure. Hundreds of details. One dashboard.",
          description: "Connect leads, inventory, payments, manifests, documents and reminders across the full departure.",
          rows: [["Lead pipeline and inventory", "In view"], ["Passenger manifest", "Updated"], ["Payments and reminders", "Connected"]],
          label: "Operational view", value: "Departure ready", note: "The current status stays visible across the group."
        },
        website: {
          color: "#5368ff", kicker: "Ready-made Website",
          title: "Publish the tour. Capture the enquiry.",
          description: "Build and publish attractive, mobile-friendly tour pages that support enquiries, campaigns and checkout.",
          rows: [["Tour page", "Published"], ["Mobile experience", "Ready"], ["Enquiry and checkout", "Connected"]],
          label: "Customer view", value: "Campaign ready", note: "The published tour is ready to share across your campaigns."
        },
        itinerary: {
          color: "#ff786b", kicker: "Itinerary Generation",
          title: "Build the itinerary. Price the trip. Move the customer forward.",
          description: "Create the day-by-day plan, add choices and pricing, publish it and manage customer revisions.",
          rows: [["Day-by-day plan", "Built"], ["Costing and pricing", "Added"], ["Customer itinerary", "Shared"]],
          label: "Customer journey", value: "Ready to review", note: "The itinerary and quote move forward as one workflow."
        },
        marketing: {
          color: "#ffc04d", kicker: "Marketing Campaigns",
          title: "The right trip. The right audience. A smarter campaign.",
          description: "Use customer travel patterns and system-driven segments to build more focused campaign audiences.",
          rows: [["Travel pattern", "Analysed"], ["Customer segment", "Created"], ["Campaign audience", "Prepared"]],
          label: "Audience view", value: "Segment ready", note: "Customer context helps shape a more relevant campaign."
        },
        performance: {
          color: "#8b62e8", kicker: "Agent Performance",
          title: "Make performance visible. Make growth easier to lead.",
          description: "Track performance, activities, tasks and growth while giving each team member the right access and responsibility.",
          rows: [["Lead activity", "Visible"], ["Tasks and calendar", "Tracked"], ["Team growth", "In view"]],
          label: "Team view", value: "Progress visible", note: "Managers and agents work from the same clear picture."
        },
        documents: {
          color: "#42a5f5", kicker: "Documents & Suppliers",
          title: "Collect securely. Fulfil clearly. Keep the trail intact.",
          description: "Collect passenger documents through secure links and keep supplier requests, confirmations, invoices and payments connected.",
          rows: [["Passenger documents", "Collected"], ["Supplier RFQ", "Tracked"], ["Invoice and payment", "Recorded"]],
          label: "Fulfilment view", value: "Trail complete", note: "Passenger and supplier work stays organized beyond WhatsApp."
        }
      };

      const buttons = [...root.querySelectorAll(".zhp-story-step")];
      const scrollSection = root.querySelector(".zhp-scroll-section");
      const scrollStory = root.querySelector(".zhp-scroll-story");
      const stage = root.querySelector(".zhp-story-stage");
      const windowPanel = root.querySelector(".zhp-story-window");
      const kicker = root.querySelector(".zhp-story-kicker");
      const heading = root.querySelector(".zhp-story-heading");
      const description = root.querySelector(".zhp-story-description");
      const rows = [...root.querySelectorAll(".zhp-story-row")];
      const spotlightLabel = root.querySelector(".zhp-story-spotlight-label");
      const spotlightValue = root.querySelector(".zhp-story-spotlight-value");
      const spotlightNote = root.querySelector(".zhp-story-spotlight-copy");
      const progress = root.querySelector(".zhp-story-progress span");
      const counter = root.querySelector(".zhp-story-counter span");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const embeddedPreview = window.self !== window.top;
      const revealItems = [...root.querySelectorAll(".zhp-reveal-copy, .zhp-reveal-visual, .zhp-reveal-group")];
      let changeTimer;
      let scrollFrame;

      root.querySelectorAll("[data-product-carousel]").forEach((carousel) => {
        const slides = [...carousel.querySelectorAll("[data-product-slide]")];
        const dots = [...carousel.querySelectorAll("[data-carousel-dot]")];
        const previous = carousel.querySelector("[data-carousel-prev]");
        const next = carousel.querySelector("[data-carousel-next]");
        let activeIndex = 0;
        let autoplayTimer;

        const showSlide = (index) => {
          activeIndex = (index + slides.length) % slides.length;
          slides.forEach((slide, slideIndex) => {
            const active = slideIndex === activeIndex;
            slide.classList.toggle("is-active", active);
            slide.setAttribute("aria-hidden", String(!active));
          });
          dots.forEach((dot, dotIndex) => dot.setAttribute("aria-current", String(dotIndex === activeIndex)));
        };

        const stopAutoplay = () => clearTimeout(autoplayTimer);
        const startAutoplay = () => {
          stopAutoplay();
          if (reducedMotion || document.hidden || slides.length < 2) return;
          autoplayTimer = setTimeout(() => {
            showSlide(activeIndex + 1);
            startAutoplay();
          }, 5000);
        };

        previous?.addEventListener("click", () => { showSlide(activeIndex - 1); startAutoplay(); });
        next?.addEventListener("click", () => { showSlide(activeIndex + 1); startAutoplay(); });
        dots.forEach((dot, dotIndex) => dot.addEventListener("click", () => { showSlide(dotIndex); startAutoplay(); }));
        carousel.addEventListener("pointerenter", stopAutoplay);
        carousel.addEventListener("pointerleave", startAutoplay);
        carousel.addEventListener("focusin", stopAutoplay);
        carousel.addEventListener("focusout", (event) => { if (!carousel.contains(event.relatedTarget)) startAutoplay(); });
        document.addEventListener("visibilitychange", () => document.hidden ? stopAutoplay() : startAutoplay());
        startAutoplay();
      });

      revealItems.forEach((item) => {
        if (!item.matches(".zhp-reveal-copy, .zhp-reveal-group")) return;
        [...item.children].forEach((child, index) => {
          const step = item.classList.contains("zhp-reveal-group") ? 140 : 120;
          child.style.setProperty("--zhp-reveal-delay", `${index * step}ms`);
        });
      });

      if (embeddedPreview || reducedMotion || !("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
      } else {
        root.classList.add("zhp-motion-ready");
        const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        }, {threshold: .14, rootMargin: "0px 0px -7% 0px"});
        window.requestAnimationFrame(() => revealItems.forEach((item) => revealObserver.observe(item)));
      }

      const selectStory = (button) => {
        const story = stories[button.dataset.story];
        if (!story || button.getAttribute("aria-pressed") === "true") return;
        buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        buttons.forEach((item) => item.style.setProperty("--zu-active", stories[item.dataset.story].color));
        windowPanel.classList.add("is-switching");
        clearTimeout(changeTimer);
        // Read the CSS fade duration so the single animation pace setting
        // also controls when the next module's content is swapped in.
        const fadeMilliseconds = parseFloat(getComputedStyle(windowPanel).transitionDuration) * 1000 || 0;
        changeTimer = setTimeout(() => {
          stage.style.setProperty("--zu-active", story.color);
          kicker.textContent = story.kicker;
          heading.textContent = story.title;
          description.textContent = story.description;
          rows.forEach((row, index) => {
            row.children[1].textContent = story.rows[index][0];
            row.children[2].textContent = story.rows[index][1];
          });
          spotlightLabel.textContent = story.label;
          spotlightValue.textContent = story.value;
          spotlightNote.textContent = story.note;
          const storyIndex = buttons.indexOf(button);
          progress.style.width = `${((storyIndex + 1) / buttons.length) * 100}%`;
          counter.textContent = String(storyIndex + 1).padStart(2, "0");
          windowPanel.classList.remove("is-switching");
        }, reducedMotion ? 0 : fadeMilliseconds);
      };

      const manualStory = () => reducedMotion || window.matchMedia("(max-width: 900px), (max-height: 679px)").matches;
      const updateScrollStory = () => {
        scrollFrame = undefined;
        if (manualStory()) return;
        const rect = scrollStory.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
        const scrollRange = Math.max(1, scrollStory.offsetHeight - window.innerHeight);
        const travelled = Math.min(scrollRange, Math.max(0, -rect.top));
        const storyIndex = Math.min(buttons.length - 1, Math.floor((travelled / scrollRange) * buttons.length));
        selectStory(buttons[storyIndex]);
      };

      const requestScrollUpdate = () => {
        if (scrollFrame) return;
        scrollFrame = window.requestAnimationFrame(updateScrollStory);
      };

      buttons.forEach((button, index) => {
        button.style.setProperty("--zu-active", stories[button.dataset.story].color);
        button.addEventListener("click", () => {
          if (manualStory()) { selectStory(button); return; }
          const scrollRange = Math.max(1, scrollStory.offsetHeight - window.innerHeight);
          const sectionTop = window.scrollY + scrollStory.getBoundingClientRect().top;
          const target = sectionTop + (scrollRange * index) / (buttons.length - 1);
          window.scrollTo({top: target, behavior: reducedMotion ? "auto" : "smooth"});
        });
      });

      if ("IntersectionObserver" in window) {
        const entranceObserver = new IntersectionObserver((entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          scrollSection.classList.add("is-in-view");
          entranceObserver.disconnect();
        }, {threshold: 0.05});
        entranceObserver.observe(scrollSection);
      } else {
        scrollSection.classList.add("is-in-view");
      }

      window.addEventListener("scroll", requestScrollUpdate, {passive: true});
      window.addEventListener("resize", requestScrollUpdate, {passive: true});
      updateScrollStory();
    })();
  