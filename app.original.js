// ===== Supabase Configuration =====
// Replace these with your Supabase project credentials
const SUPABASE_URL = 'YOUR_SUPABASE_URL';  // e.g., 'https://abc123.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// ===== Form Handler =====
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Collect form data
  const formData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    use_case: document.getElementById('use_case').value.trim(),
    timeline: document.getElementById('timeline').value,
    submitted_at: new Date().toISOString()
  };

  // Validate
  if (!formData.name || !formData.email) {
    showStatus('Please fill in all required fields.', 'error');
    return;
  }

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  try {
    // Check if Supabase is configured
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
      // Dev mode: just log to console
      console.log('Form submission (Supabase not configured):', formData);
      showStatus('Thanks! I\'ll be in touch within 24 hours.', 'success');
      form.reset();
    } else {
      // Production: send to Supabase
      const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showStatus('Thanks! I\'ll be in touch within 24 hours.', 'success');
        form.reset();
      } else {
        const error = await response.text();
        console.error('Supabase error:', error);
        showStatus('Something went wrong. Please try again or email directly.', 'error');
      }
    }
  } catch (err) {
    console.error('Submission error:', err);
    showStatus('Something went wrong. Please try again or email directly.', 'error');
  }

  // Reset button
  submitBtn.textContent = originalText;
  submitBtn.disabled = false;
});

function showStatus(message, type) {
  status.textContent = message;
  status.className = 'form-status ' + type;

  // Clear after 5 seconds
  setTimeout(() => {
    status.textContent = '';
    status.className = 'form-status';
  }, 5000);
}

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Rotating Word Animation =====
const words = [
  'employee',
  'assistant',
  'researcher',
  'writer',
  'scheduler',
  'inbox manager',
  'content creator',
  'analyst'
];

let currentIndex = 0;
const rotatingWord = document.getElementById('rotating-word');

function rotateWord() {
  // Fade out
  rotatingWord.classList.remove('fade-in');
  rotatingWord.classList.add('fade-out');

  setTimeout(() => {
    // Change word
    currentIndex = (currentIndex + 1) % words.length;
    rotatingWord.textContent = words[currentIndex];

    // Fade in
    rotatingWord.classList.remove('fade-out');
    rotatingWord.classList.add('fade-in');
  }, 250);
}

// Start rotation
if (rotatingWord) {
  rotatingWord.classList.add('fade-in');
  setInterval(rotateWord, 1800);
}
