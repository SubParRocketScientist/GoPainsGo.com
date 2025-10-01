// Modern optimized JavaScript with performance improvements
class GopainsgoWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.setTheme();
    this.initAnimations();
    this.initIntersectionObserver();
  }

  bindEvents() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', this.toggleTheme.bind(this));
    }

    // Hamburger menu
    const hamburger = document.getElementById('hamburger-menu');
    const sideMenu = document.getElementById('side-menu');
    const closeBtn = document.querySelector('.close-side-menu');

    if (hamburger && sideMenu && closeBtn) {
      hamburger.addEventListener('click', () => this.toggleMenu(sideMenu, true));
      closeBtn.addEventListener('click', () => this.toggleMenu(sideMenu, false));
      
      // Close menu on outside click
      document.addEventListener('click', (e) => {
        if (sideMenu.classList.contains('open') && 
            !sideMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
          this.toggleMenu(sideMenu, false);
        }
      });
    }

    // Retailer buttons
    this.bindRetailerButtons();

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', this.smoothScroll.bind(this));
    });
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }

  setTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', defaultTheme);
  }

  toggleMenu(menu, open) {
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  bindRetailerButtons() {
    document.querySelectorAll('.retailer-card[data-url]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const url = button.getAttribute('data-url');
        if (url) {
          // Add click animation
          button.style.transform = 'scale(0.95)';
          setTimeout(() => {
            button.style.transform = '';
            window.open(url, '_blank', 'noopener,noreferrer');
          }, 150);
        }
      });
    });
  }

  smoothScroll(e) {
    const targetId = e.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      e.preventDefault();
      const headerOffset = 100;
      const elementPosition = targetElement.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  initAnimations() {
    // Floating elements animation improvements
    document.querySelectorAll('.float-element').forEach((element, index) => {
      element.style.animationDelay = `${index * 0.5}s`;
    });

    // Add hover effects to cards
    document.querySelectorAll('.glass-panel').forEach(panel => {
      panel.addEventListener('mouseenter', this.addHoverGlow.bind(this));
      panel.addEventListener('mouseleave', this.removeHoverGlow.bind(this));
    });
  }

  addHoverGlow(e) {
    e.currentTarget.style.boxShadow = '0 30px 60px rgba(16, 185, 129, 0.2)';
  }

  removeHoverGlow(e) {
    e.currentTarget.style.boxShadow = '';
  }

  initIntersectionObserver() {
    // Optimize animations with Intersection Observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .retailer-card, .product-card').forEach(el => {
      observer.observe(el);
    });
  }

  // Utility functions
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
}

// Global functions for backward compatibility
window.scrollToRetailers = () => {
  const retailersSection = document.getElementById('retailers');
  if (retailersSection) {
    retailersSection.scrollIntoView({ behavior: 'smooth' });
  }
};

// Performance optimizations
const preloadImages = () => {
  const imageUrls = [
    'images/logo.png',
    // Add other critical images here
  ];
  
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new GopainsgoWebsite();
    preloadImages();
  });
} else {
  new GopainsgoWebsite();
  preloadImages();
}

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause expensive operations when page is hidden
    document.querySelectorAll('.float-element').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  } else {
    // Resume animations when page is visible
    document.querySelectorAll('.float-element').forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }
});

// Resize handler with debouncing
window.addEventListener('resize', GopainsgoWebsite.debounce(() => {
  // Handle responsive adjustments if needed
  const sideMenu = document.getElementById('side-menu');
  if (sideMenu && window.innerWidth > 768 && sideMenu.classList.contains('open')) {
    sideMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
}, 250));

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .catch(err => console.log('Service worker registration failed'));
  });
}

// Add CSS classes for better animation control
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .animate-in {
      animation: none;
    }
    
    .float-element {
      animation: none !important;
    }
  }
`;
document.head.appendChild(style);