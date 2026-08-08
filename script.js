// ============================================================
// MOBILE MENU TOGGLE
// ============================================================

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');

        mobileMenu.classList.toggle('hidden', !isHidden);

        const icon = mobileMenuBtn.querySelector('i');

        if (icon) {
            icon.classList.toggle('fa-bars', !isHidden);
            icon.classList.toggle('fa-times', isHidden);
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');

            const icon = mobileMenuBtn.querySelector('i');

            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}


// ============================================================
// ACTIVE NAVIGATION
// ============================================================

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const links = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop - 150) {
            currentSection = section.id;
        }
    });

    links.forEach(link => {
        link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${currentSection}`
        );
    });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);


// ============================================================
// SCROLL ANIMATIONS
// ============================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observerInstance.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document
        .querySelectorAll('.scroll-animate')
        .forEach(element => observer.observe(element));
});


// ============================================================
// PROJECT FILTERING
// ============================================================

const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filterValue = btn.dataset.filter;

        filterBtns.forEach(button => {
            button.classList.remove('active');
        });

        btn.classList.add('active');

        projectCards.forEach(card => {
            const category = card.dataset.category;

            const shouldShow =
                filterValue === 'all' ||
                category === filterValue;

            if (shouldShow) {
                card.style.display = 'block';

                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';

                setTimeout(() => {
                    card.style.display = 'none';
                }, 200);
            }
        });
    });
});


// ============================================================
// BACK TO TOP BUTTON
// ============================================================

const scrollToTopBtn = document.getElementById('scroll-to-top');

if (scrollToTopBtn) {

    const updateScrollButton = () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.pointerEvents = 'auto';
        } else {
            scrollToTopBtn.style.opacity = '0.5';
            scrollToTopBtn.style.pointerEvents = 'none';
        }
    };

    window.addEventListener('scroll', updateScrollButton);

    scrollToTopBtn.addEventListener('click', event => {
        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    updateScrollButton();
}


// ============================================================
// CONTACT FORM VALIDATION
// ============================================================

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(formData) {
    const errors = {};

    const name = (formData.get('name') || '').trim();
    const email = (formData.get('email') || '').trim();
    const message = (formData.get('message') || '').trim();

    if (!name) {
        errors.name = 'Name is required';
    } else if (name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
    }

    if (!email) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!message) {
        errors.message = 'Message is required';
    } else if (message.length < 10) {
        errors.message = 'Message must be at least 10 characters';
    }

    return errors;
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(element => {
        element.textContent = '';
        element.classList.add('hidden');
    });

    document.querySelectorAll(
        '#contact-form input, #contact-form textarea'
    ).forEach(element => {
        element.classList.remove('error');
    });
}

function displayErrors(errors) {
    clearErrors();

    Object.entries(errors).forEach(([fieldName, message]) => {
        const field = document.getElementById(fieldName);

        if (!field) return;

        const errorElement = field.nextElementSibling;

        field.classList.add('error');

        if (
            errorElement &&
            errorElement.classList.contains('error-message')
        ) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    });
}


// ============================================================
// CONTACT FORM SUBMISSION
// ============================================================

if (contactForm) {

    contactForm.addEventListener('submit', async event => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const errors = validateForm(formData);

        if (Object.keys(errors).length > 0) {
            displayErrors(errors);
            return;
        }

        clearErrors();

        if (formStatus) {
            formStatus.textContent = '';
            formStatus.classList.remove(
                'success',
                'error',
                'hidden'
            );
        }

        const submitBtn =
            contactForm.querySelector('button[type="submit"]');

        const originalText =
            submitBtn ? submitBtn.textContent : 'Send Message';

        try {

            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
            }

            const data = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                message: document.getElementById('message').value.trim()
            };

            /*
             * IMPORTANT:
             *
             * Change this endpoint if your backend is hosted somewhere else.
             *
             * Example:
             * https://your-domain.com/api/contact
             */
            const CONTACT_ENDPOINT = '/api/contact';

            const response = await fetch(CONTACT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            let result = {};

            try {
                result = await response.json();
            } catch {
                result = {};
            }

            if (!response.ok) {
                throw new Error(
                    result.message || 'Failed to send message'
                );
            }

            if (formStatus) {
                formStatus.textContent =
                    '✓ ' +
                    (
                        result.message ||
                        'Message sent successfully! I\'ll get back to you soon.'
                    );

                formStatus.classList.add('success');
                formStatus.classList.remove('hidden');
            }

            contactForm.reset();

            setTimeout(() => {
                if (formStatus) {
                    formStatus.textContent = '';
                    formStatus.classList.add('hidden');
                }
            }, 5000);

        } catch (error) {

            console.error('Contact form error:', error);

            if (formStatus) {
                formStatus.textContent =
                    '✗ Failed to send message. Please try again or contact me directly.';

                formStatus.classList.add('error');
                formStatus.classList.remove('hidden');
            }

        } finally {

            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    });
}


// ============================================================
// REAL-TIME INPUT VALIDATION
// ============================================================

const inputs = document.querySelectorAll(
    '#name, #email, #message'
);

inputs.forEach(input => {

    input.addEventListener('blur', () => {

        const fieldName = input.id;
        const value = input.value.trim();

        let errorMessage = '';

        if (fieldName === 'name') {

            if (!value) {
                errorMessage = 'Name is required';
            } else if (value.length < 2) {
                errorMessage =
                    'Name must be at least 2 characters';
            }

        } else if (fieldName === 'email') {

            if (!value) {
                errorMessage = 'Email is required';
            } else if (!isValidEmail(value)) {
                errorMessage =
                    'Please enter a valid email address';
            }

        } else if (fieldName === 'message') {

            if (!value) {
                errorMessage = 'Message is required';
            } else if (value.length < 10) {
                errorMessage =
                    'Message must be at least 10 characters';
            }
        }

        const errorElement = input.nextElementSibling;

        if (errorMessage) {

            input.classList.add('error');

            if (
                errorElement &&
                errorElement.classList.contains('error-message')
            ) {
                errorElement.textContent = errorMessage;
                errorElement.classList.remove('hidden');
            }

        } else {

            input.classList.remove('error');

            if (
                errorElement &&
                errorElement.classList.contains('error-message')
            ) {
                errorElement.textContent = '';
                errorElement.classList.add('hidden');
            }
        }
    });

    input.addEventListener('input', () => {

        input.classList.remove('error');

        const errorElement = input.nextElementSibling;

        if (
            errorElement &&
            errorElement.classList.contains('error-message')
        ) {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
    });
});


// ============================================================
// KEYBOARD NAVIGATION
// ============================================================

document.addEventListener('keydown', event => {

    if (event.key !== 'Escape') return;

    if (
        mobileMenu &&
        !mobileMenu.classList.contains('hidden')
    ) {
        mobileMenu.classList.add('hidden');

        const icon =
            mobileMenuBtn?.querySelector('i');

        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    // Close theme menus
    document
        .querySelectorAll('.theme-menu')
        .forEach(menu => {
            menu.classList.add('hidden');
        });
});


// ============================================================
// PERFORMANCE OPTIMIZATION
// ============================================================

let ticking = false;

window.addEventListener('scroll', () => {

    if (ticking) return;

    window.requestAnimationFrame(() => {
        updateActiveNavLink();
        ticking = false;
    });

    ticking = true;
});


// ============================================================
// DARK MODE / THEME SWITCHER
// ============================================================

const THEME_KEY = 'theme';

const systemMedia =
    window.matchMedia('(prefers-color-scheme: dark)');

function getStoredTheme() {
    return localStorage.getItem(THEME_KEY) || 'system';
}

function applyTheme(theme) {

    const isDark =
        theme === 'dark' ||
        (theme === 'system' && systemMedia.matches);

    document.documentElement.classList.toggle(
        'dark',
        isDark
    );

    document
        .querySelectorAll('.theme-icon-light')
        .forEach(icon => {
            icon.classList.toggle('hidden', isDark);
        });

    document
        .querySelectorAll('.theme-icon-dark')
        .forEach(icon => {
            icon.classList.toggle('hidden', !isDark);
        });

    document
        .querySelectorAll('.theme-option')
        .forEach(button => {
            button.classList.toggle(
                'active-theme',
                button.dataset.theme === theme
            );
        });

    if (typeof window.setBgTheme === 'function') {
        window.setBgTheme(isDark);
    }
}

function setTheme(theme) {

    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
}

systemMedia.addEventListener('change', () => {

    if (getStoredTheme() === 'system') {
        applyTheme('system');
    }
});


// ============================================================
// THEME MENU
// ============================================================

function setupThemeSwitcher(
    toggleBtnId,
    menuId,
    wrapperEl
) {

    const toggleBtn =
        document.getElementById(toggleBtnId);

    const menu =
        document.getElementById(menuId);

    if (!toggleBtn || !menu || !wrapperEl) {
        return;
    }

    let hideTimeout;

    function showMenu() {

        clearTimeout(hideTimeout);

        menu.classList.remove('hidden');

        toggleBtn.setAttribute(
            'aria-expanded',
            'true'
        );
    }

    function hideMenu() {

        clearTimeout(hideTimeout);

        hideTimeout = setTimeout(() => {

            menu.classList.add('hidden');

            toggleBtn.setAttribute(
                'aria-expanded',
                'false'
            );

        }, 150);
    }

    // Desktop hover
    wrapperEl.addEventListener(
        'mouseenter',
        showMenu
    );

    wrapperEl.addEventListener(
        'mouseleave',
        hideMenu
    );

    // Click / keyboard
    toggleBtn.addEventListener('click', event => {

        event.stopPropagation();

        if (menu.classList.contains('hidden')) {
            showMenu();
        } else {
            hideMenu();
        }
    });

    // Theme options
    menu
        .querySelectorAll('.theme-option')
        .forEach(button => {

            button.addEventListener('click', event => {

                event.stopPropagation();

                const theme =
                    button.dataset.theme;

                if (
                    theme === 'light' ||
                    theme === 'dark' ||
                    theme === 'system'
                ) {
                    setTheme(theme);
                }

                hideMenu();
            });
        });

    // Close when clicking outside
    document.addEventListener('click', event => {

        if (!wrapperEl.contains(event.target)) {

            menu.classList.add('hidden');

            toggleBtn.setAttribute(
                'aria-expanded',
                'false'
            );
        }
    });
}


// Initialize theme
document.addEventListener(
    'DOMContentLoaded',
    () => {

        applyTheme(getStoredTheme());

        setupThemeSwitcher(
            'theme-toggle-btn',
            'theme-menu',
            document.getElementById('theme-switcher')
        );

        setupThemeSwitcher(
            'theme-toggle-btn-mobile',
            'theme-menu-mobile',
            document.getElementById(
                'theme-switcher-mobile'
            )
        );
    }
);


// ============================================================
// WALKING CAT PET
// ============================================================

const catMessages = [
    'Meow! Hi there!',
    "Welcome to Jayp's portfolio!",
    'Psst... check out the Projects section!',
    "I'm a full-stack cat. Mostly nap.",
    "Don't forget to say hi in the contact form!",
    'Purr-fect code starts with curiosity.',
    'Try the dark mode toggle up top!',
    'You should hire this developer. Paws down.',
    'Counting projects instead of chasing yarn tonight.',
    'Just prowling around, checking out the projects.',
    'That is one pawsome portfolio!',
    'Thanks for stopping by!'
];

document.addEventListener('DOMContentLoaded', () => {

    const catPet =
        document.getElementById('cat-pet');

    const catSpeech =
        document.getElementById('cat-speech');

    if (!catPet || !catSpeech) return;

    const prefersReducedMotion =
        window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

    const catWidth = () => catPet.offsetWidth;

    const WALK_SPEED = 55;

    let speechTimeout;
    let lastMessageIndex = -1;
    let walkTimer;

    let currentX =
        Math.max(0, window.innerWidth * 0.15);

    let facingLeft = false;
    let paused = false;

    catPet.style.transform =
        `translateX(${currentX}px)`;

    function setFacing(toLeft) {

        facingLeft = toLeft;

        catPet.classList.toggle(
            'face-left',
            facingLeft
        );
    }

    function sayMessage() {

        let index;

        do {
            index =
                Math.floor(
                    Math.random() *
                    catMessages.length
                );
        } while (
            index === lastMessageIndex &&
            catMessages.length > 1
        );

        lastMessageIndex = index;

        catSpeech.textContent =
            catMessages[index];

        catSpeech.classList.add('show');

        clearTimeout(speechTimeout);

        speechTimeout = setTimeout(() => {
            catSpeech.classList.remove('show');
        }, 2600);
    }

    function triggerCat() {

        catPet.classList.remove('cat-jump');

        void catPet.offsetWidth;

        catPet.classList.add('cat-jump');

        sayMessage();
    }

    catPet.addEventListener(
        'click',
        triggerCat
    );

    catPet.addEventListener(
        'keydown',
        event => {

            if (
                event.key === 'Enter' ||
                event.key === ' '
            ) {
                event.preventDefault();
                triggerCat();
            }
        }
    );

    catPet.addEventListener(
        'mouseenter',
        () => {
            paused = true;
        }
    );

    catPet.addEventListener(
        'mouseleave',
        () => {
            paused = false;
        }
    );

    function scheduleNextMove() {

        clearTimeout(walkTimer);

        walkTimer = setTimeout(
            step,
            paused
                ? 800
                : 600 + Math.random() * 2500
        );
    }

    function step() {

        if (prefersReducedMotion) {

            catPet.classList.add('idle');

            return;
        }

        if (paused) {

            scheduleNextMove();

            return;
        }

        const maxX =
            Math.max(
                0,
                window.innerWidth - catWidth()
            );

        if (Math.random() < 0.35) {

            catPet.classList.remove('walking');
            catPet.classList.add('idle');

            scheduleNextMove();

            return;
        }

        const range =
            150 + Math.random() * 350;

        let target =
            currentX +
            (
                Math.random() < 0.5
                    ? -range
                    : range
            );

        target =
            Math.min(
                maxX,
                Math.max(0, target)
            );

        const distance =
            Math.abs(target - currentX);

        if (distance < 10) {

            scheduleNextMove();

            return;
        }

        setFacing(target < currentX);

        catPet.classList.remove('idle');
        catPet.classList.add('walking');

        const duration =
            distance / WALK_SPEED;

        catPet.style.transition =
            `transform ${duration}s linear`;

        catPet.style.transform =
            `translateX(${target}px)`;

        currentX = target;

        clearTimeout(walkTimer);

        walkTimer = setTimeout(() => {

            catPet.classList.remove('walking');
            catPet.classList.add('idle');

            scheduleNextMove();

        }, duration * 1000);
    }

    window.addEventListener('resize', () => {

        const maxX =
            Math.max(
                0,
                window.innerWidth - catWidth()
            );

        if (currentX > maxX) {

            currentX = maxX;

            catPet.style.transition = 'none';

            catPet.style.transform =
                `translateX(${currentX}px)`;
        }
    });

    catPet.classList.add('idle');

    scheduleNextMove();
});


// ============================================================
// THREE.JS 3D BACKGROUND
// ============================================================

(function initBackground3D() {

    const canvas =
        document.getElementById('bg-canvas');

    if (
        !canvas ||
        typeof THREE === 'undefined'
    ) {
        return;
    }

    const prefersReducedMotion =
        window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

    const isMobile =
        window.innerWidth < 768;

    const renderer =
        new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    const scene = new THREE.Scene();

    const camera =
        new THREE.PerspectiveCamera(
            60,
            window.innerWidth /
                window.innerHeight,
            0.1,
            1000
        );

    camera.position.z = 34;

    let fogColor = 0xf9fafb;

    scene.fog =
        new THREE.Fog(
            fogColor,
            25,
            95
        );

    // Dust particles
    const DUST_COUNT =
        isMobile ? 260 : 550;

    const dustGeometry =
        new THREE.BufferGeometry();

    const dustPositions =
        new Float32Array(
            DUST_COUNT * 3
        );

    for (let i = 0; i < DUST_COUNT; i++) {

        dustPositions[i * 3] =
            (Math.random() - 0.5) * 100;

        dustPositions[i * 3 + 1] =
            (Math.random() - 0.5) * 70;

        dustPositions[i * 3 + 2] =
            (Math.random() - 0.5) * 90 - 20;
    }

    dustGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(
            dustPositions,
            3
        )
    );

    const dustMaterial =
        new THREE.PointsMaterial({
            color: 0x9ca3af,
            size: 0.18,
            transparent: true,
            opacity: 0.35,
            sizeAttenuation: true
        });

    const dust =
        new THREE.Points(
            dustGeometry,
            dustMaterial
        );

    scene.add(dust);


    // Network nodes
    const NODE_COUNT =
        isMobile ? 34 : 62;

    const MAX_LINK_DIST =
        isMobile ? 9 : 11;

    const bounds = {
        x: 34,
        y: 22,
        z: 18
    };

    const nodes = [];

    for (let i = 0; i < NODE_COUNT; i++) {

        nodes.push({
            pos: new THREE.Vector3(
                (Math.random() - 0.5) *
                    bounds.x * 2,

                (Math.random() - 0.5) *
                    bounds.y * 2,

                (Math.random() - 0.5) *
                    bounds.z * 2
            ),

            vel: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.015
            )
        });
    }

    const nodeGeometry =
        new THREE.BufferGeometry();

    const nodePositions =
        new Float32Array(
            NODE_COUNT * 3
        );

    nodeGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(
            nodePositions,
            3
        )
    );

    const nodeMaterial =
        new THREE.PointsMaterial({
            color: 0x1f2937,
            size: 0.6,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

    const nodePoints =
        new THREE.Points(
            nodeGeometry,
            nodeMaterial
        );

    scene.add(nodePoints);


    // Connecting lines
    const MAX_LINE_SEGMENTS =
        NODE_COUNT * 6;

    const lineGeometry =
        new THREE.BufferGeometry();

    const linePositions =
        new Float32Array(
            MAX_LINE_SEGMENTS * 2 * 3
        );

    lineGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(
            linePositions,
            3
        )
    );

    lineGeometry.setDrawRange(0, 0);

    const lineMaterial =
        new THREE.LineBasicMaterial({
            color: 0x6b7280,
            transparent: true,
            opacity: 0.25
        });

    const lines =
        new THREE.LineSegments(
            lineGeometry,
            lineMaterial
        );

    scene.add(lines);


    function updateNetwork() {

        for (let i = 0; i < NODE_COUNT; i++) {

            const node = nodes[i];

            node.pos.add(node.vel);

            if (
                Math.abs(node.pos.x) >
                bounds.x
            ) {
                node.vel.x *= -1;
            }

            if (
                Math.abs(node.pos.y) >
                bounds.y
            ) {
                node.vel.y *= -1;
            }

            if (
                Math.abs(node.pos.z) >
                bounds.z
            ) {
                node.vel.z *= -1;
            }

            nodePositions[i * 3] =
                node.pos.x;

            nodePositions[i * 3 + 1] =
                node.pos.y;

            nodePositions[i * 3 + 2] =
                node.pos.z;
        }

        nodeGeometry
            .attributes
            .position
            .needsUpdate = true;


        let segmentCount = 0;

        for (
            let i = 0;
            i < NODE_COUNT &&
            segmentCount < MAX_LINE_SEGMENTS;
            i++
        ) {

            for (
                let j = i + 1;
                j < NODE_COUNT &&
                segmentCount < MAX_LINE_SEGMENTS;
                j++
            ) {

                const dx =
                    nodes[i].pos.x -
                    nodes[j].pos.x;

                const dy =
                    nodes[i].pos.y -
                    nodes[j].pos.y;

                const dz =
                    nodes[i].pos.z -
                    nodes[j].pos.z;

                const distanceSquared =
                    dx * dx +
                    dy * dy +
                    dz * dz;

                if (
                    distanceSquared <
                    MAX_LINK_DIST *
                    MAX_LINK_DIST
                ) {

                    const base =
                        segmentCount * 6;

                    linePositions[base] =
                        nodes[i].pos.x;

                    linePositions[base + 1] =
                        nodes[i].pos.y;

                    linePositions[base + 2] =
                        nodes[i].pos.z;

                    linePositions[base + 3] =
                        nodes[j].pos.x;

                    linePositions[base + 4] =
                        nodes[j].pos.y;

                    linePositions[base + 5] =
                        nodes[j].pos.z;

                    segmentCount++;
                }
            }
        }

        lineGeometry.setDrawRange(
            0,
            segmentCount * 2
        );

        lineGeometry
            .attributes
            .position
            .needsUpdate = true;
    }


    // Wireframe shapes
    const shapes = [];

    const shapeGeometries = [
        new THREE.IcosahedronGeometry(6, 0),
        new THREE.TorusGeometry(5, 1.4, 8, 24),
        new THREE.OctahedronGeometry(5, 0)
    ];

    shapeGeometries.forEach(
        (geometry, index) => {

            const material =
                new THREE.MeshBasicMaterial({
                    color: 0x6b7280,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.16
                });

            const mesh =
                new THREE.Mesh(
                    geometry,
                    material
                );

            mesh.position.set(
                (index - 1) * 24,
                index % 2 === 0 ? 9 : -9,
                -26 - index * 8
            );

            scene.add(mesh);

            shapes.push(mesh);
        }
    );


    // Theme support
    window.setBgTheme = function(isDark) {

        fogColor =
            isDark
                ? 0x0a0f1a
                : 0xf9fafb;

        scene.fog.color.setHex(fogColor);

        dustMaterial.color.setHex(
            isDark
                ? 0xe5e7eb
                : 0x9ca3af
        );

        dustMaterial.opacity =
            isDark ? 0.45 : 0.35;

        nodeMaterial.color.setHex(
            isDark
                ? 0x67e8f9
                : 0x1f2937
        );

        nodeMaterial.opacity =
            isDark ? 0.9 : 0.8;

        lineMaterial.color.setHex(
            isDark
                ? 0x67e8f9
                : 0x6b7280
        );

        lineMaterial.opacity =
            isDark ? 0.18 : 0.25;

        shapes.forEach(shape => {
            shape.material.opacity =
                isDark ? 0.22 : 0.16;
        });
    };

    window.setBgTheme(
        document.documentElement.classList.contains('dark')
    );


    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener(
        'mousemove',
        event => {

            mouseX =
                (event.clientX /
                    window.innerWidth -
                    0.5) * 2;

            mouseY =
                (event.clientY /
                    window.innerHeight -
                    0.5) * 2;
        }
    );


    // Resize
    function onResize() {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }

    window.addEventListener(
        'resize',
        onResize
    );


    // Animation
    let frameId;

    const clock =
        new THREE.Clock();

    function animate() {

        frameId =
            requestAnimationFrame(animate);

        const time =
            clock.getElapsedTime();

        if (!prefersReducedMotion) {

            dust.rotation.y += 0.0004;
            dust.rotation.x += 0.00015;

            updateNetwork();

            nodePoints.rotation.y += 0.0002;

            lines.rotation.y =
                nodePoints.rotation.y;

            nodeMaterial.size =
                0.55 +
                Math.sin(time * 1.6) *
                0.08;

            shapes.forEach(
                (shape, index) => {

                    shape.rotation.x +=
                        0.0012 *
                        (index + 1);

                    shape.rotation.y +=
                        0.0009 *
                        (index + 1);
                }
            );

            camera.position.x +=
                (
                    mouseX * 3.5 -
                    camera.position.x
                ) * 0.02;

            camera.position.y +=
                (
                    -mouseY * 3.5 -
                    camera.position.y
                ) * 0.02;

            camera.lookAt(
                scene.position
            );
        }

        renderer.render(
            scene,
            camera
        );
    }

    animate();


    // Pause when tab is hidden
    document.addEventListener(
        'visibilitychange',
        () => {

            if (document.hidden) {

                cancelAnimationFrame(frameId);

            } else {

                animate();
            }
        }
    );

})();


// ============================================================
// INITIALIZATION
// ============================================================

console.log(
    'Portfolio script loaded successfully'
);