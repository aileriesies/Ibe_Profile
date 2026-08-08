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

// ==================================================================
// ========== DARK MODE / THEME SWITCHER (Light / Dark / System) ====
// ==================================================================

const THEME_KEY = 'theme';
const systemMedia = window.matchMedia('(prefers-color-scheme: dark)');

function getStoredTheme() {
    return localStorage.getItem(THEME_KEY) || 'system';
}

function applyTheme(theme) {
    const isDark = theme === 'dark' || (theme === 'system' && systemMedia.matches);
    document.documentElement.classList.toggle('dark', isDark);

    // Swap icon on all toggle buttons
    document.querySelectorAll('.theme-icon-light').forEach(el => el.classList.toggle('hidden', isDark));
    document.querySelectorAll('.theme-icon-dark').forEach(el => el.classList.toggle('hidden', !isDark));

    // Mark active option in every menu
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.classList.toggle('active-theme', btn.dataset.theme === theme);
    });

    // Let the 3D background react to the theme change
    if (typeof window.setBgTheme === 'function') {
        window.setBgTheme(isDark);
    }
}

function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
}

// React live if the user changes their OS theme while "system" is selected
systemMedia.addEventListener('change', () => {
    if (getStoredTheme() === 'system') applyTheme('system');
});

function setupThemeSwitcher(toggleBtnId, menuId, wrapperEl) {
    const toggleBtn = document.getElementById(toggleBtnId);
    const menu = document.getElementById(menuId);
    if (!toggleBtn || !menu) return;

    let hideTimeout;

    const showMenu = () => {
        clearTimeout(hideTimeout);
        menu.classList.remove('hidden');
        toggleBtn.setAttribute('aria-expanded', 'true');
    };

    const hideMenu = () => {
        hideTimeout = setTimeout(() => {
            menu.classList.add('hidden');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }, 150);
    };

    // Hover to reveal (desktop) — "kapag tinapatan ng mouse"
    wrapperEl.addEventListener('mouseenter', showMenu);
    wrapperEl.addEventListener('mouseleave', hideMenu);

    // Click/tap toggle (mobile & keyboard accessibility)
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.contains('hidden') ? showMenu() : hideMenu();
    });

    menu.querySelectorAll('.theme-option').forEach(btn => {
        btn.addEventListener('click', () => {
            setTheme(btn.dataset.theme);
            hideMenu();
        });
    });

    document.addEventListener('click', (e) => {
        if (!wrapperEl.contains(e.target)) {
            menu.classList.add('hidden');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getStoredTheme());
    setupThemeSwitcher('theme-toggle-btn', 'theme-menu', document.getElementById('theme-switcher'));
    setupThemeSwitcher('theme-toggle-btn-mobile', 'theme-menu-mobile', document.getElementById('theme-switcher-mobile'));
});

// ==================================================================
// ========== WALKING CAT PET ========================================
// ==================================================================

const catMessages = [
    "Meow! Hi there!",
    "Welcome to Jayp's portfolio!",
    "Psst... check out the Projects section!",
    "I'm a full-stack cat. Mostly nap.",
    "Don't forget to say hi in the contact form!",
    "Purr-fect code starts with curiosity.",
    "Try the dark mode toggle up top!",
    "You should hire this developer. Paws down.",
    "Counting projects instead of chasing yarn tonight.",
    "Just prowling around, checking out the projects.",
    "That is one pawsome portfolio!",
    "Thanks for stopping by!"
];

document.addEventListener('DOMContentLoaded', () => {
    const catPet = document.getElementById('cat-pet');
    const catSpeech = document.getElementById('cat-speech');
    if (!catPet || !catSpeech) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const catWidth = () => catPet.offsetWidth;
    const WALK_SPEED = 55; // px per second

    let speechTimeout;
    let lastMessageIndex = -1;
    let walkTimer;
    let currentX = Math.max(0, window.innerWidth * 0.15);
    let facingLeft = false;
    let paused = false;

    catPet.style.transform = `translateX(${currentX}px)`;

    function setFacing(toLeft) {
        facingLeft = toLeft;
        catPet.classList.toggle('face-left', facingLeft);
    }

    function sayMessage() {
        let index;
        do {
            index = Math.floor(Math.random() * catMessages.length);
        } while (index === lastMessageIndex && catMessages.length > 1);
        lastMessageIndex = index;

        catSpeech.textContent = catMessages[index];
        catSpeech.classList.add('show');
        clearTimeout(speechTimeout);
        speechTimeout = setTimeout(() => catSpeech.classList.remove('show'), 2600);
    }

    function triggerCat() {
        catPet.classList.remove('cat-jump');
        void catPet.offsetWidth; // restart animation
        catPet.classList.add('cat-jump');
        sayMessage();
    }

    catPet.addEventListener('click', triggerCat);
    catPet.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerCat();
        }
    });

    // Pause wandering while the user is reading a message or interacting
    catPet.addEventListener('mouseenter', () => { paused = true; });
    catPet.addEventListener('mouseleave', () => { paused = false; });

    function scheduleNextMove() {
        clearTimeout(walkTimer);
        walkTimer = setTimeout(step, paused ? 800 : (600 + Math.random() * 2500));
    }

    function step() {
        if (prefersReducedMotion) {
            catPet.classList.add('idle');
            return; // stay put, still clickable
        }

        if (paused) {
            scheduleNextMove();
            return;
        }

        const maxX = Math.max(0, window.innerWidth - catWidth());
        // Sometimes take a short curious pause instead of walking.
        const shouldPause = Math.random() < 0.35;

        if (shouldPause) {
            catPet.classList.remove('walking');
            catPet.classList.add('idle');
            scheduleNextMove();
            return;
        }

        // Pick a new target within a reasonable range of the current spot
        const range = 150 + Math.random() * 350;
        let target = currentX + (Math.random() < 0.5 ? -range : range);
        target = Math.min(maxX, Math.max(0, target));

        const distance = Math.abs(target - currentX);
        if (distance < 10) {
            scheduleNextMove();
            return;
        }

        setFacing(target < currentX);
        catPet.classList.remove('idle');
        catPet.classList.add('walking');

        const duration = distance / WALK_SPEED; // seconds
        catPet.style.transition = `transform ${duration}s linear`;
        catPet.style.transform = `translateX(${target}px)`;
        currentX = target;

        clearTimeout(walkTimer);
        walkTimer = setTimeout(() => {
            catPet.classList.remove('walking');
            catPet.classList.add('idle');
            scheduleNextMove();
        }, duration * 1000);
    }

    // Keep the cat inside the viewport on resize.
    window.addEventListener('resize', () => {
        const maxX = Math.max(0, window.innerWidth - catWidth());
        if (currentX > maxX) {
            currentX = maxX;
            catPet.style.transition = 'none';
            catPet.style.transform = `translateX(${currentX}px)`;
        }
    });

    catPet.classList.add('idle');
    scheduleNextMove();
});

// ==================================================================
// ========== 3D BACKGROUND (Three.js floating particles) ===========
// ==================================================================

(function initBackground3D() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 34;

    let fogColor = 0xf9fafb;
    scene.fog = new THREE.Fog(fogColor, 25, 95);

    // ---- Layer 1: fine dust particles (far background, slow drift) ----
    const DUST_COUNT = isMobile ? 260 : 550;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
        dustPositions[i * 3] = (Math.random() - 0.5) * 100;
        dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 70;
        dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 90 - 20;
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
        color: 0x9ca3af, size: 0.18, transparent: true, opacity: 0.35, sizeAttenuation: true
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    // ---- Layer 2: constellation / network nodes with connecting lines ----
    const NODE_COUNT = isMobile ? 34 : 62;
    const MAX_LINK_DIST = isMobile ? 9 : 11;
    const bounds = { x: 34, y: 22, z: 18 };

    const nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
            pos: new THREE.Vector3(
                (Math.random() - 0.5) * bounds.x * 2,
                (Math.random() - 0.5) * bounds.y * 2,
                (Math.random() - 0.5) * bounds.z * 2
            ),
            vel: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.015
            )
        });
    }

    const nodeGeometry = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(NODE_COUNT * 3);
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    const nodeMaterial = new THREE.PointsMaterial({
        color: 0x1f2937, size: 0.6, transparent: true, opacity: 0.8, sizeAttenuation: true
    });
    const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(nodePoints);

    const MAX_LINE_SEGMENTS = NODE_COUNT * 6;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(MAX_LINE_SEGMENTS * 2 * 3);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setDrawRange(0, 0);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x6b7280, transparent: true, opacity: 0.25 });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    function updateNetwork() {
        for (let i = 0; i < NODE_COUNT; i++) {
            const n = nodes[i];
            n.pos.add(n.vel);
            if (Math.abs(n.pos.x) > bounds.x) n.vel.x *= -1;
            if (Math.abs(n.pos.y) > bounds.y) n.vel.y *= -1;
            if (Math.abs(n.pos.z) > bounds.z) n.vel.z *= -1;
            nodePositions[i * 3] = n.pos.x;
            nodePositions[i * 3 + 1] = n.pos.y;
            nodePositions[i * 3 + 2] = n.pos.z;
        }
        nodeGeometry.attributes.position.needsUpdate = true;

        let segCount = 0;
        for (let i = 0; i < NODE_COUNT && segCount < MAX_LINE_SEGMENTS; i++) {
            for (let j = i + 1; j < NODE_COUNT && segCount < MAX_LINE_SEGMENTS; j++) {
                const dx = nodes[i].pos.x - nodes[j].pos.x;
                const dy = nodes[i].pos.y - nodes[j].pos.y;
                const dz = nodes[i].pos.z - nodes[j].pos.z;
                const distSq = dx * dx + dy * dy + dz * dz;
                if (distSq < MAX_LINK_DIST * MAX_LINK_DIST) {
                    const base = segCount * 6;
                    linePositions[base] = nodes[i].pos.x;
                    linePositions[base + 1] = nodes[i].pos.y;
                    linePositions[base + 2] = nodes[i].pos.z;
                    linePositions[base + 3] = nodes[j].pos.x;
                    linePositions[base + 4] = nodes[j].pos.y;
                    linePositions[base + 5] = nodes[j].pos.z;
                    segCount++;
                }
            }
        }
        lineGeometry.setDrawRange(0, segCount * 2);
        lineGeometry.attributes.position.needsUpdate = true;
    }

    // ---- Layer 3: large slowly-rotating wireframe shapes for depth ----
    const shapes = [];
    const shapeGeometries = [
        new THREE.IcosahedronGeometry(6, 0),
        new THREE.TorusGeometry(5, 1.4, 8, 24),
        new THREE.OctahedronGeometry(5, 0)
    ];
    shapeGeometries.forEach((geo, i) => {
        const mat = new THREE.MeshBasicMaterial({ color: 0x6b7280, wireframe: true, transparent: true, opacity: 0.16 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((i - 1) * 24, (i % 2 === 0 ? 9 : -9), -26 - i * 8);
        scene.add(mesh);
        shapes.push(mesh);
    });

    // ---- Theming ----
    window.setBgTheme = function (isDark) {
        fogColor = isDark ? 0x0a0f1a : 0xf9fafb;
        scene.fog.color.setHex(fogColor);
        dustMaterial.color.setHex(isDark ? 0xe5e7eb : 0x9ca3af);
        dustMaterial.opacity = isDark ? 0.45 : 0.35;
        nodeMaterial.color.setHex(isDark ? 0x67e8f9 : 0x1f2937);
        nodeMaterial.opacity = isDark ? 0.9 : 0.8;
        lineMaterial.color.setHex(isDark ? 0x67e8f9 : 0x6b7280);
        lineMaterial.opacity = isDark ? 0.18 : 0.25;
        shapes.forEach(s => { s.material.opacity = isDark ? 0.22 : 0.16; });
    };
    window.setBgTheme(document.documentElement.classList.contains('dark'));

    // Gentle mouse parallax
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    let frameId;
    let clock = new THREE.Clock();
    function animate() {
        frameId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        if (!prefersReducedMotion) {
            dust.rotation.y += 0.0004;
            dust.rotation.x += 0.00015;

            updateNetwork();
            nodePoints.rotation.y += 0.0002;
            lines.rotation.y = nodePoints.rotation.y;

            // subtle breathing twinkle on the network nodes
            nodeMaterial.size = 0.55 + Math.sin(t * 1.6) * 0.08;

            shapes.forEach((s, i) => {
                s.rotation.x += 0.0012 * (i + 1);
                s.rotation.y += 0.0009 * (i + 1);
            });

            camera.position.x += (mouseX * 3.5 - camera.position.x) * 0.02;
            camera.position.y += (-mouseY * 3.5 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);
        }

        renderer.render(scene, camera);
    }
    animate();

    // Pause the render loop when the tab is hidden (saves battery/CPU)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(frameId);
        } else {
            animate();
        }
    });
})();

// ========== INITIALIZATION ========== 

console.log('Portfolio script loaded successfully');
