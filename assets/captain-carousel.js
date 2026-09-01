(() => {
  document.querySelectorAll('.cap-carousel').forEach(root => {
  const slides = [...root.querySelectorAll('.cap-carousel-slide')];
  const buttons = [...root.querySelectorAll('[data-feature]')];
  const stage = root.querySelector('.cap-carousel-stage');
  const tabs = root.querySelector('.cap-carousel-tabs');
  const picker = root.querySelector('[data-feature-picker]');
  const prev = root.querySelector('[data-carousel-prev]');
  const nextControl = root.querySelector('[data-carousel-next]');
  const play = root.querySelector('[data-carousel-play]');
  const count = root.querySelector('[data-carousel-count]');
  const announcement = root.querySelector('[data-carousel-announcement]');
  const progress = root.querySelector('.cap-carousel-progress span');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let timer;
  let progressAnimation;
  let inView = false;
  let hovering = false;
  let userPaused = motion.matches;
  let pointer;
  let suppressClickUntil=0;

  const interval = () => {
    const value = getComputedStyle(root).getPropertyValue('--carousel-interval').trim();
    const number = parseFloat(value);
    return Number.isFinite(number) && number > 0 ? Math.max(2000, number * (value.endsWith('ms') ? 1 : 1000)) : 5000;
  };
  const stop = () => {
    clearTimeout(timer);
    progressAnimation?.cancel();
    progressAnimation = undefined;
  };
  const schedule = () => {
    stop();
    play.querySelector('[data-play-label]').textContent = userPaused ? 'Play' : 'Pause';
    play.querySelector('[data-play-icon]').textContent = userPaused ? '▶' : 'Ⅱ';
    play.setAttribute('aria-label', userPaused ? 'Play automatic slides' : 'Pause automatic slides');
    stage.setAttribute('aria-live', 'off');
    if (userPaused || !inView || hovering || document.hidden) return;
    const duration = interval();
    if (!motion.matches && progress.animate) {
      progressAnimation = progress.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}], {duration,fill:'forwards'});
    }
    timer = setTimeout(() => select(index + 1, false), duration);
  };
  const centerTab = () => {
    if(!tabs) return;
    const active = buttons[index].getBoundingClientRect();
    const strip = tabs.getBoundingClientRect();
    tabs.scrollTo({left:tabs.scrollLeft + active.left - strip.left - (strip.width-active.width)/2, behavior:motion.matches?'auto':'smooth'});
  };
  const select = (next, manual=true) => {
    const previous = index;
    index = (next + slides.length) % slides.length;
    if (manual) userPaused = true;
    root.style.setProperty('--carousel-shift',next < previous ? '-12px':'12px');
    slides.forEach((slide,i) => {
      slide.classList.toggle('is-active',i===index);
      slide.setAttribute('aria-hidden',String(i!==index));
      slide.inert = i!==index;
      buttons[i]?.setAttribute('aria-pressed',String(i===index));
    });
    if(picker) {
      picker.value=String(index);
      const previousLabel=slides[(index-1+slides.length)%slides.length].dataset.featureLabel;
      const nextLabel=slides[(index+1)%slides.length].dataset.featureLabel;
      prev.querySelector('[data-prev-label]').textContent=previousLabel;
      nextControl.querySelector('[data-next-label]').textContent=nextLabel;
      prev.setAttribute('aria-label',`Previous feature: ${previousLabel}`);
      nextControl.setAttribute('aria-label',`Next feature: ${nextLabel}`);
    }
    count.textContent = String(index+1).padStart(2,'0');
    if (manual) announcement.textContent = slides[index].getAttribute('aria-label');
    centerTab();
    schedule();
  };

  buttons.forEach((button,i) => button.addEventListener('click',() => select(i)));
  picker?.addEventListener('change',() => select(Number(picker.value)));
  prev.addEventListener('click',() => select(index-1));
  nextControl.addEventListener('click',() => select(index+1));
  play.addEventListener('click',() => { userPaused=!userPaused; schedule(); });
  root.addEventListener('keydown',event => {
    if(event.target.tagName==='SELECT') return;
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key==='Home' ? 0 : event.key==='End' ? slides.length-1 : index+(event.key==='ArrowRight'?1:-1);
    select(next);
    if (tabs?.contains(document.activeElement)) buttons[index].focus({preventScroll:true});
  });
  root.addEventListener('focusin',event => {
    if (play.contains(event.target)) return;
    userPaused=true;
    schedule();
  });
  stage.addEventListener('pointerenter',event => { if(event.pointerType==='mouse') { hovering=true; schedule(); } });
  stage.addEventListener('pointerleave',event => { if(event.pointerType==='mouse') { hovering=false; schedule(); } });
  stage.addEventListener('pointerdown',event => {
    if(event.pointerType==='mouse' && event.button!==0) return;
    if(event.target.closest('a,button')) return;
    pointer={x:event.clientX,y:event.clientY};
  });
  stage.addEventListener('pointerup',event => {
    if(!pointer) return;
    const dx=event.clientX-pointer.x, dy=event.clientY-pointer.y;
    pointer=undefined;
    if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.4) {
      suppressClickUntil=performance.now()+350;
      select(index+(dx<0?1:-1));
    }
  });
  stage.addEventListener('click',event => {
    if(performance.now()<suppressClickUntil) { event.preventDefault(); event.stopPropagation(); }
  },true);
  stage.addEventListener('pointercancel',() => { pointer=undefined; });
  document.addEventListener('visibilitychange',schedule);
  motion.addEventListener('change',() => { userPaused=true; schedule(); });
  root.classList.add('is-ready');
  root.querySelector('.cap-carousel-controls').hidden=false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView=entries[0].isIntersecting;
      schedule();
    },{rootMargin:'0px 0px -30% 0px',threshold:0}).observe(stage);
  } else {
    // Retain manual controls when visibility-aware autoplay is unavailable.
    userPaused=true;
  }
  schedule();
  });
})();
