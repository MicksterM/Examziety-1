// ========== FORM HANDLING ========== 

const signupForm = document.getElementById('signupForm');
const paymentModal = document.getElementById('paymentModal');
const closeModal = document.querySelector('.close');
const stripeButton = document.getElementById('stripeButton');

// Handle form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect form data
    const formData = {
        email: document.getElementById('email').value,
        timestamp: new Date().toISOString()
    };

    // If name/mobile fields exist in other contexts, capture them safely
    const nameInput = document.getElementById('name');
    const mobileInput = document.getElementById('mobile');
    if (nameInput) formData.name = nameInput.value;
    if (mobileInput) formData.mobile = mobileInput.value;

    try {
        // Option A: Send to your backend
        // const response = await fetch('/api/signup', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
        
        // For now, store locally and show payment modal
        localStorage.setItem('examzietySignup', JSON.stringify(formData));
        
        // Show payment modal
        paymentModal.style.display = 'block';
        
    } catch (error) {
        console.error('Signup error:', error);
        alert('There was an issue with your signup. Please try again.');
    }
});

// Close modal when X is clicked
closeModal.addEventListener('click', () => {
    paymentModal.style.display = 'none';
});

// Close modal when clicking outside content
window.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
        paymentModal.style.display = 'none';
    }
});

// Stripe button handler
stripeButton.addEventListener('click', () => {
    // Get stored signup data
    const signupData = JSON.parse(localStorage.getItem('examzietySignup'));
    
    // Redirect to Stripe
    // IMPLEMENTATION READY: Replace with your actual Stripe integration
    // Option 1: Redirect to Stripe Checkout
    window.location.href = `https://checkout.stripe.com/pay/cs_test_example#fidlock=${encodeURIComponent(JSON.stringify(signupData))}`;
    
    // Option 2: Use Stripe.js to create checkout
    // stripe.redirectToCheckout({
    //     sessionId: 'cs_test_example'
    // });
    
    // Option 3: Open Stripe payment page in modal
    // For development, show a placeholder
    alert('Redirecting to Stripe payment page...\n\nName: ' + signupData.name + '\nEmail: ' + signupData.email);
});

// ========== SMOOTH SCROLLING ========== 

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== SCROLL ANIMATIONS ========== 

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease forwards';
        }
    });
}, observerOptions);

// Observe cards and section elements
document.querySelectorAll('.problem-card, .benefit-card, .instructor-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ========== STICKY HEADER ON SCROLL ========== 

let lastScrollTop = 0;
const scrollThreshold = 100;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add subtle background change to hero on scroll (optional)
    const heroSection = document.querySelector('.hero');
    if (scrollTop > scrollThreshold) {
        heroSection.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    } else {
        heroSection.style.boxShadow = 'none';
    }
});

// ========== FORM VALIDATION ========== 

const formInputs = document.querySelectorAll('input[required]');

formInputs.forEach(input => {
    input.addEventListener('blur', validateInput);
    input.addEventListener('change', validateInput);
});

function validateInput(e) {
    const input = e.target;
    const isValid = input.validity.valid;
    
    if (!isValid) {
        input.style.borderColor = '#ff6b6b';
    } else {
        input.style.borderColor = '#e8e8e8';
    }
}

// ========== ANALYTICS PLACEHOLDER ========== 

// Track key conversion events
function trackEvent(eventName, eventData = {}) {
    // Placeholder for analytics integration
    // Connect with Google Analytics, Mixpanel, Segment, etc.
    console.log(`Event: ${eventName}`, eventData);
    
    // Example: Google Analytics
    // gtag('event', eventName, eventData);
    
    // Example: Mixpanel
    // mixpanel.track(eventName, eventData);
}

// Track when user reaches sections
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id || entry.target.className;
            trackEvent('section_viewed', { section: sectionId });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
});

// Track CTA clicks
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', () => {
        trackEvent('cta_clicked', { 
            text: button.textContent,
            href: button.getAttribute('href')
        });
    });
});

// Track form submission
signupForm.addEventListener('submit', () => {
    trackEvent('signup_started', {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value
    });
});

// ========== MOBILE MENU SUPPORT (if needed in future) ========== 

// Structure ready for mobile menu expansion if navigation is added
function toggleMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// ========== UTILITY: LOCAL STORAGE HELPERS ========== 

const storage = {
    save: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Storage error:', e);
        }
    },
    
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Storage error:', e);
        }
    }
};

// ========== INITIALIZATION ========== 

document.addEventListener('DOMContentLoaded', () => {
    // Log page load for analytics
    trackEvent('page_load', {
        timestamp: new Date().toISOString()
    });
    
    // Additional initialization as needed
    console.log('Examziety landing page loaded');
});
