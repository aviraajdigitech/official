/* ==========================================================================
   AVIRAAJ DIGITECH - INTERACTIVE 3D & CORE SCRIPT
   High-performance Vanilla JS: 3D Canvas, Card Tilt, Interactive Phone Mockup,
   Animated Counters, and SEO-friendly micro-interactions.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHero3DCanvas();
  init3DCardTilt();
  initPhoneSimulator();
  initStatsCounters();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. NAVBAR SCROLL & MOBILE TOGGLE
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightCurrentSection();
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const link = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (link) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   2. HERO 3D INTERACTIVE CANVAS (Floating Gold & Cyan Geometric Grid & Nodes)
   -------------------------------------------------------------------------- */
function initHero3DCanvas() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, targetX: 0, targetY: 0, radius: 150 };

  function resize() {
    const container = canvas.parentElement;
    width = canvas.width = container.offsetWidth || 500;
    height = canvas.height = container.offsetHeight || 500;
    createParticles();
  }

  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 40;
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 40;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.baseX = this.x;
      this.baseY = this.y;
      this.size = Math.random() * 3 + 1.5;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.color = Math.random() > 0.4 ? 'rgba(212, 175, 55, ' : 'rgba(2, 132, 199, ';
      this.alpha = Math.random() * 0.5 + 0.3;
      this.z = Math.random() * 200 - 100; // 3D depth
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      // Mouse interactivity with 3D parallax
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      // Apply subtle 3D depth shift
      const depthScale = 1 + this.z / 400;
      const drawX = this.x + mouse.targetX * (this.z / 100);
      const drawY = this.y + mouse.targetY * (this.z / 100);
      
      ctx.arc(drawX, drawY, this.size * depthScale, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color + '0.5)';
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((width * height) / 8000);
    const particleCount = Math.min(Math.max(count, 35), 65);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          const opacity = (1 - distance / 110) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
          ctx.lineWidth = 1;
          const ax = particles[a].x + mouse.targetX * (particles[a].z / 100);
          const ay = particles[a].y + mouse.targetY * (particles[a].z / 100);
          const bx = particles[b].x + mouse.targetX * (particles[b].z / 100);
          const by = particles[b].y + mouse.targetY * (particles[b].z / 100);
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }

  resize();
  animate();
}

/* --------------------------------------------------------------------------
   3. 3D CARD TILT ON MOUSEMOVE (Physics-based 3D transform & Glare)
   -------------------------------------------------------------------------- */
function init3DCardTilt() {
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

/* --------------------------------------------------------------------------
   4. INTERACTIVE PHONE SIMULATOR (Live Market Tabs & Real-Time Data Ticker)
   -------------------------------------------------------------------------- */
function initPhoneSimulator() {
  const phoneNavItems = document.querySelectorAll('.phone-nav-item');
  const balanceEl = document.getElementById('phoneBalance');
  const chartPath = document.getElementById('phoneChartPath');
  const chartArea = document.getElementById('phoneChartArea');

  const tabData = {
    'markets': {
      balance: '₹ 2,45,890.00',
      growth: '+14.85% Today',
      color: '#10B981',
      path: 'M 0 60 Q 50 10, 100 40 T 200 20 T 300 5',
      area: 'M 0 60 Q 50 10, 100 40 T 200 20 T 300 5 L 300 80 L 0 80 Z'
    },
    'portfolio': {
      balance: '₹ 8,12,450.50',
      growth: '+28.40% Overall',
      color: '#10B981',
      path: 'M 0 50 Q 70 80, 140 30 T 240 10 T 300 15',
      area: 'M 0 50 Q 70 80, 140 30 T 240 10 T 300 15 L 300 80 L 0 80 Z'
    },
    'algo': {
      balance: '₹ 54,200.00',
      growth: 'Win Rate: 84.6%',
      color: '#D4AF37',
      path: 'M 0 70 Q 60 30, 120 50 T 220 15 T 300 2',
      area: 'M 0 70 Q 60 30, 120 50 T 220 15 T 300 2 L 300 80 L 0 80 Z'
    },
    'wallet': {
      balance: '₹ 1,50,000.00',
      growth: 'Instant Payout Ready',
      color: '#0284C7',
      path: 'M 0 40 Q 80 20, 150 45 T 250 25 T 300 30',
      area: 'M 0 40 Q 80 20, 150 45 T 250 25 T 300 30 L 300 80 L 0 80 Z'
    }
  };

  phoneNavItems.forEach(item => {
    item.addEventListener('click', () => {
      phoneNavItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      const target = item.getAttribute('data-tab');
      if (tabData[target] && balanceEl && chartPath && chartArea) {
        balanceEl.textContent = tabData[target].balance;
        chartPath.setAttribute('d', tabData[target].path);
        chartArea.setAttribute('d', tabData[target].area);
      }
    });
  });

  // Random Micro Live Fluctuation for Stocks
  setInterval(() => {
    const stockPriceNifty = document.getElementById('stockNifty');
    if (stockPriceNifty) {
      const base = 25420.50;
      const delta = (Math.random() - 0.48) * 15;
      const newPrice = (base + delta).toFixed(2);
      stockPriceNifty.textContent = '₹' + Number(newPrice).toLocaleString('en-IN');
    }
  }, 2500);
}

/* --------------------------------------------------------------------------
   5. ANIMATED STAT COUNTERS
   -------------------------------------------------------------------------- */
function initStatsCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  let animated = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = target / 60; // 60 steps

      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = Math.ceil(count) + suffix;
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target + suffix;
        }
      };
      updateCount();
    });
  }

  window.addEventListener('scroll', () => {
    const section = document.querySelector('.hero-stats-row');
    if (!section || animated) return;

    const top = section.getBoundingClientRect().top;
    if (top < window.innerHeight - 50) {
      animated = true;
      runCounters();
    }
  });
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM INTERACTIVE HANDLER
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('formResponse');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value;

      // Compose Mailto as static backup
      const mailtoUrl = `mailto:contact@aviraajdigitech.com?subject=${encodeURIComponent('Inquiry from ' + name + ' - ' + service)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\nService: ' + service + '\n\nMessage:\n' + message)}`;

      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10B981; color: #065F46; padding: 1rem; border-radius: 12px; margin-top: 1rem;">
            <strong>Thank you, ${name}!</strong> Your inquiry has been logged. Opening your default email client to send directly to <b>contact@aviraajdigitech.com</b>...
          </div>
        `;
      }

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 1000);
    });
  }
}
