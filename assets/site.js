(() => {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#navigation');
  const closeMenu = () => {
    nav?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  };
  if (toggle && menu) {
    document.documentElement.classList.add('nav-ready');
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
  }
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    dropdown.addEventListener('toggle', () => {
      if (!dropdown.open) return;
      document.querySelectorAll('.nav-dropdown').forEach(other => {
        if (other !== dropdown) other.open = false;
      });
    });
  });
  document.addEventListener('click', event => {
    if (nav?.contains(event.target)) return;
    closeMenu();
    document.querySelectorAll('.nav-dropdown').forEach(item => item.open = false);
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const openDropdown = document.querySelector('.nav-dropdown[open]');
    if (openDropdown) {
      openDropdown.open = false;
      openDropdown.querySelector('summary').focus();
    } else if (nav?.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  const elements = [...document.querySelectorAll('[data-reveal]')];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer;
  const showAll = () => {
    observer?.disconnect();
    elements.forEach(element => element.classList.add('in-view'));
  };
  if (motion.matches || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    document.documentElement.classList.add('motion-ready');
    elements.forEach(element => observer.observe(element));
  }
  motion.addEventListener('change', event => { if (event.matches) showAll(); });
})();
