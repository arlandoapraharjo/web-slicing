document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul a');

  const projectCards = document.querySelectorAll('.project-card');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Header Elevation & Active Nav Highlighting
  let ticking = false;

  const updateHeaderAndNav = () => {
    const scrolled = window.scrollY;

    // Header Elevation
    header.classList.toggle('scrolled', scrolled > 20);

    // ScrollSpy Active Nav Highlighting
    let current = '';
    sections.forEach((sec) => {
      if (scrolled >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderAndNav);
      ticking = true;
    }
  }, { passive: true });

  // Initial call to set positions
  updateHeaderAndNav();

  // 2. 3D Card Perspective Tilt & Dynamic Glare Spotlight (Cursor Following)
  if (!prefersReducedMotion) {
    projectCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Position dynamic light reflection (glare following cursor)
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Compute subtle 3D tilt angles (card follows cursor)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // 3. Projects Pagination Controller
  const pages = document.querySelectorAll('.projects-page');
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  const currentNumEl = document.getElementById('current-page-num');
  const totalNumEl = document.getElementById('total-page-num');

  if (pages.length > 0 && prevBtn && nextBtn) {
    let currentPage = 1;
    const totalPages = pages.length;

    if (totalNumEl) {
      totalNumEl.textContent = String(totalPages).padStart(2, '0');
    }

    const setPage = (newPage) => {
      currentPage = newPage;

      pages.forEach((page) => {
        const pageNum = parseInt(page.getAttribute('data-page'), 10);
        page.classList.toggle('active', pageNum === currentPage);
      });

      if (currentNumEl) {
        currentNumEl.textContent = String(currentPage).padStart(2, '0');
      }

      prevBtn.disabled = currentPage <= 1;
      nextBtn.disabled = currentPage >= totalPages;

      // Scroll smoothly to top of projects section
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        const headerHeight = header ? header.offsetHeight : 70;
        const targetScroll = projectsSection.offsetTop - headerHeight;
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
    };

    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        setPage(currentPage - 1);
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        setPage(currentPage + 1);
      }
    });
  }

  // 4. Mobile Hamburger Navigation
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navMenu.classList.contains('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navMenu.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    };

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking nav links
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        toggleMenu(false);
        navToggle.focus();
      }
    });
  }

  // 5. Smooth scroll for Hero Contact Button
  const heroContactBtn = document.getElementById('hero-contact-btn');
  if (heroContactBtn) {
    heroContactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const headerHeight = header ? header.offsetHeight : 70;
        const targetScroll = contactSection.offsetTop - headerHeight;
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
    });
  }
});
