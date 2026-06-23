// ========== MOBILE MENU TOGGLE ========== 
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
mobileMenuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', !isHidden);
    
    // Change icon
    const icon = mobileMenuBtn.querySelector('i');
    if (isHidden) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// ========== SMOOTH SCROLLING & ACTIVE NAV HIGHLIGHTING ========== 

// Handle smooth scrolling and active nav highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Update active state
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Update active nav on scroll
window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// ========== SCROLL ANIMATIONS ========== 

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe skill badges, project cards, and other elements
document.addEventListener('DOMContentLoaded', () => {
    const skillBadges = document.querySelectorAll('.skill-badge');
    const projectCards = document.querySelectorAll('.project-card');
    
    [...skillBadges, ...projectCards].forEach(element => {
        element.classList.add('scroll-animate');
        observer.observe(element);
    });
});

// ========== BACK TO TOP BUTTON ========== 

const scrollToTopBtn = document.getElementById('scroll-to-top');

// Show/hide back to top button based on scroll position
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.pointerEvents = 'auto';
    } else {
        scrollToTopBtn.style.opacity = '0.5';
        scrollToTopBtn.style.pointerEvents = 'none';
    }
});

// Smooth scroll to top
scrollToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initial state
scrollToTopBtn.style.opacity = '0.5';
scrollToTopBtn.style.pointerEvents = 'none';
scrollToTopBtn.style.transition = 'opacity 0.3s ease';

// ========== CONTACT FORM VALIDATION & SUBMISSION ========== 

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate form
function validateForm(formData) {
    const errors = {};
    
    // Validate name
    if (!formData.get('name').trim()) {
        errors.name = 'Please enter your name';
    } else if (formData.get('name').trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
    }
    
    // Validate email
    if (!formData.get('email').trim()) {
        errors.email = 'Please enter your email';
    } else if (!isValidEmail(formData.get('email'))) {
        errors.email = 'Please enter a valid email';
    }
    
    // Validate message
    if (!formData.get('message').trim()) {
        errors.message = 'Please enter a message';
    } else if (formData.get('message').trim().length < 10) {
        errors.message = 'Message must be at least 10 characters';
    }
    
    return errors;
}

// Clear error messages
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.classList.add('hidden');
    });
    
    document.querySelectorAll('input, textarea').forEach(el => {
        el.classList.remove('error');
    });
}

// Display error messages
function displayErrors(errors) {
    clearErrors();
    
    Object.keys(errors).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        const errorElement = field.nextElementSibling;
        
        if (errorElement) {
            errorElement.textContent = errors[fieldName];
            errorElement.classList.remove('hidden');
            field.classList.add('error');
        }
    });
}

// Handle form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const errors = validateForm(formData);
    
    if (Object.keys(errors).length > 0) {
        displayErrors(errors);
        return;
    }
    
    // Clear previous messages
    clearErrors();
    formStatus.textContent = '';
    formStatus.classList.remove('success', 'error');
    
    try {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual backend URL)
        // In a real application, you would send this to your backend:
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     body: formData
        // });
        
        // For demo purposes, simulate a 1.5 second delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        formStatus.classList.add('success');
        formStatus.classList.remove('hidden');
        
        // Reset form
        contactForm.reset();
        
        // Restore button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Clear success message after 5 seconds
        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.classList.add('hidden');
        }, 5000);
        
    } catch (error) {
        console.error('Error:', error);
        formStatus.textContent = '✗ An error occurred. Please try again later.';
        formStatus.classList.add('error');
        formStatus.classList.remove('hidden');
        
        // Restore button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }
});

// ========== INPUT REAL-TIME VALIDATION ========== 

const inputs = document.querySelectorAll('#name, #email, #message');

inputs.forEach(input => {
    input.addEventListener('blur', () => {
        const fieldName = input.id;
        const formData = new FormData(contactForm);
        
        // Validate just this field
        const errors = {};
        
        if (fieldName === 'name') {
            if (!input.value.trim()) {
                errors.name = 'Please enter your name';
            } else if (input.value.trim().length < 2) {
                errors.name = 'Name must be at least 2 characters';
            }
        } else if (fieldName === 'email') {
            if (!input.value.trim()) {
                errors.email = 'Please enter your email';
            } else if (!isValidEmail(input.value)) {
                errors.email = 'Please enter a valid email';
            }
        } else if (fieldName === 'message') {
            if (!input.value.trim()) {
                errors.message = 'Please enter a message';
            } else if (input.value.trim().length < 10) {
                errors.message = 'Message must be at least 10 characters';
            }
        }
        
        // Update error state
        const errorElement = input.nextElementSibling;
        if (errors[fieldName]) {
            input.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errors[fieldName];
                errorElement.classList.remove('hidden');
            }
        } else {
            input.classList.remove('error');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.add('hidden');
            }
        }
    });
    
    // Clear error when user starts typing
    input.addEventListener('input', () => {
        input.classList.remove('error');
        const errorElement = input.nextElementSibling;
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
    });
});

// ========== PAGE LOAD ANIMATIONS ========== 

// Add fade-in animation to page load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ========== KEYBOARD NAVIGATION ========== 

// Add keyboard navigation support for tabs
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu on Escape
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
});

// ========== PERFORMANCE OPTIMIZATION ========== 

// Debounce scroll events for better performance
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateActiveNavLink();
            ticking = false;
        });
        ticking = true;
    }
});

// ========== INITIALIZATION ========== 

console.log('Portfolio script loaded successfully');


// mailer

document.getElementById("contact-form")
        .addEventListener("submit", async (e) => {

            e.preventDefault();

            const data = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                message: document.getElementById("message").value
            };

            try {

                const response = await fetch(
                    "http://localhost:3000/contact",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":"application/json"
                        },
                        body: JSON.stringify(data)
                    }
                );

                const result = await response.json();

                const status =
                document.getElementById("form-status");

                status.innerText = result.message;

                status.classList.remove("hidden");

                status.classList.remove("text-red-600");
                status.classList.add("text-green-600");

                document.getElementById("contact-form").reset();

            } catch(error){

                console.log(error);

                const status =
                document.getElementById("form-status");

                status.innerText = "Failed to send message";

                status.classList.remove("hidden");

                status.classList.remove("text-green-600");
                status.classList.add("text-red-600");
            }
        });