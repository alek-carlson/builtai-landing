// BuiltAI Landing Page - JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Supabase config - initialize after DOM ready to ensure library is loaded
  const SUPABASE_URL = 'https://ulspmxdlkfitzndnysbu.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsc3BteGRsa2ZpdHpuZG55c2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMjM2OTcsImV4cCI6MjA4Mjg5OTY5N30.5P05_lap_5BxsuCICfo7Nr2Da8YgZzs9TS2vG2bd6NI';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Rotating words for hero section
  const rotatingWords = [
    'AI employee',
    'digital assistant',
    'research analyst',
    'content writer',
    'inbox manager',
    'calendar guru',
    'workflow engine',
    'second brain'
  ];

  let currentIndex = 0;
  const rotatingElement = document.getElementById('rotating-word');

  function rotateWord() {
    if (!rotatingElement) return;

    // Fade out
    rotatingElement.style.opacity = '0';
    rotatingElement.style.transform = 'translateY(-10px)';

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % rotatingWords.length;
      rotatingElement.textContent = rotatingWords[currentIndex];
      
      // Fade in
      rotatingElement.style.opacity = '1';
      rotatingElement.style.transform = 'translateY(0)';
    }, 300);
  }

  // Set initial transition
  if (rotatingElement) {
    rotatingElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  }

  // Rotate every 2.5 seconds
  setInterval(rotateWord, 2500);

  // Contact form handling
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        // Submit to Supabase
        const { error } = await supabase
          .from('builtai_leads')
          .insert([{
            email: data.email,
            name: data.name || null,
            message: data.use_case || null,
            company: data.timeline || null, // repurposing company field for timeline
            source: 'landing_page'
          }]);

        if (error) throw error;
        
        formStatus.textContent = '✓ Request sent! I\'ll be in touch within 24 hours.';
        formStatus.className = 'form-status success';
        form.reset();
      } catch (error) {
        console.error('Form submission error:', error);
        formStatus.textContent = 'Something went wrong. Please email directly.';
        formStatus.className = 'form-status error';
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add slight parallax effect to orbs on mouse move
  document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
      const speed = (index + 1) * 10;
      const x = (mouseX - 0.5) * speed;
      const y = (mouseY - 0.5) * speed;
      orb.style.transform = `translate(${x}px, ${y}px)`;
    });
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  // Add visible class styles
  const style = document.createElement('style');
  style.textContent = `
    .section.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
});
