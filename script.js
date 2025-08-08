// Insert current year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
const hamb = document.querySelector('.hamburger');
hamb && hamb.addEventListener('click', () => {
  const expanded = hamb.getAttribute('aria-expanded') === 'true';
  hamb.setAttribute('aria-expanded', String(!expanded));
  const nav = document.querySelector('.nav');
  if (!nav) return;
  nav.style.display = expanded ? 'none' : 'flex';
});

// Header reveal on scroll
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  if (s > 40) {
    header.style.backdropFilter = 'blur(8px)';
    header.style.background = 'rgba(255,255,255,0.6)';
    header.style.boxShadow = '0 4px 18px rgba(15,15,15,0.04)';
  } else {
    header.style.backdropFilter = 'none';
    header.style.background = 'transparent';
    header.style.boxShadow = 'none';
  }
});

// Simple invite form submission: opens mail client as fallback.
// Replace with server endpoint or Netlify/Form endpoint for production.
function submitInviteForm(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const motivation = document.getElementById('motivation').value.trim();

  // Basic validation
  if (!name || !email || !motivation) {
    alert('Please complete all fields before submitting.');
    return false;
  }

  // Prepare mailto fallback
  const subject = encodeURIComponent('Kaizen Invitation Request — ' + name);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMotivation:\n${motivation}\n\nSource: Kaizen site`);
  const mailto = `mailto:hello@kaizen-team.example?subject=${subject}&body=${body}`;

  // Attempt to POST to an endpoint (uncomment and configure for server)
  // fetch('/api/apply', { method:'POST', body: JSON.stringify({name,email,motivation}), headers:{'Content-Type':'application/json'} })
  //   .then(()=> alert('Application submitted — we will contact you.'))
  //   .catch(()=> window.location.href = mailto);

  // Fallback: open mail client
  window.location.href = mailto;
  return false;
}

// Book a strategy call — placeholder opens WhatsApp or mail
function bookCall() {
  // Replace number/email below with your contact
  const whatsapp = 'https://wa.me/1234567890?text=' + encodeURIComponent('Hi Kaizen — I want to book a strategy call.');
  window.open(whatsapp, '_blank');
}
