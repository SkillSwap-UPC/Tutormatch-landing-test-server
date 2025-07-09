// ===== GLOBAL VARIABLES =====
let currentLang = "es";
let isScrolling = false;

// ===== DOM ELEMENTS =====
const elements = {
    home: document.querySelector("#home"),
    about: document.querySelector("#about"),
    price: document.querySelector("#price"),
    contact: document.querySelector("#contact"),
    basic: document.querySelector("#basic"),
    standard: document.querySelector("#standard"),
    premium: document.querySelector("#premium"),
    langToggle: document.querySelector("#lang-toggle"),
    navbar: document.querySelector(".navbar"),
    header: document.querySelector(".header"),
    mobileMenu: document.querySelector("#check")
};

// ===== SMOOTH SCROLLING FUNCTIONALITY =====
function smoothScrollTo(target, offset = 80) {
    if (isScrolling) return;
    
    isScrolling = true;
    const targetElement = document.querySelector(target);
    
    if (targetElement) {
        const targetPosition = targetElement.offsetTop - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (elements.mobileMenu.checked) {
            elements.mobileMenu.checked = false;
        }
        
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
}

// ===== NAVIGATION EVENT LISTENERS =====
function initializeNavigation() {
    // Main navigation
    elements.home?.addEventListener("click", (e) => {
        e.preventDefault();
        smoothScrollTo(".hero");
    });

    elements.about?.addEventListener("click", (e) => {
        e.preventDefault();
        smoothScrollTo(".about");
    });

    elements.price?.addEventListener("click", (e) => {
        e.preventDefault();
        smoothScrollTo(".membership");
    });

    elements.contact?.addEventListener("click", (e) => {
        e.preventDefault();
        smoothScrollTo(".contact");
    });

    // Membership navigation
    elements.basic?.addEventListener("click", (e) => {
        e.preventDefault();
        smoothScrollTo(".membership");
        highlightPricingCard('basic');
    });

    elements.standard?.addEventListener("click", (e) => {
        e.preventDefault();
        smoothScrollTo(".membership");
        highlightPricingCard('standard');
    });

    elements.premium?.addEventListener("click", (e) => {
        e.preventDefault();
        smoothScrollTo(".membership");
        highlightPricingCard('premium');
    });
}

// ===== PRICING CARD HIGHLIGHT =====
function highlightPricingCard(planType) {
    setTimeout(() => {
        const cards = document.querySelectorAll('.membership-card');
        cards.forEach(card => card.classList.remove('highlight'));
        
        const targetCard = document.querySelector(`.membership-card.${planType}`);
        if (targetCard) {
            targetCard.classList.add('highlight');
            setTimeout(() => {
                targetCard.classList.remove('highlight');
            }, 2000);
        }
    }, 500);
}

// ===== LANGUAGE SWITCHING =====
function initializeLanguageToggle() {
    elements.langToggle?.addEventListener("click", (e) => {
        e.preventDefault();
        
        if (currentLang === "es") {
            switchToEnglish();
            currentLang = "en";
            elements.langToggle.textContent = "ES";
        } else {
            switchToSpanish();
            currentLang = "es";
            elements.langToggle.textContent = "EN";
        }
        
        // Add animation feedback
        elements.langToggle.style.transform = "scale(0.95)";
        setTimeout(() => {
            elements.langToggle.style.transform = "scale(1)";
        }, 150);
    });
}

// ===== HEADER SCROLL EFFECT =====
function initializeHeaderEffects() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (elements.header) {
            if (currentScrollY > 100) {
                elements.header.style.background = 'rgba(15, 15, 35, 0.95)';
                elements.header.style.backdropFilter = 'blur(20px)';
                elements.header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                elements.header.style.background = 'rgba(15, 15, 35, 0.8)';
                elements.header.style.backdropFilter = 'blur(20px)';
                elements.header.style.boxShadow = 'none';
            }
            
            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 500) {
                elements.header.style.transform = 'translateY(-100%)';
            } else {
                elements.header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
    });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.membership-card, .audience-card, .contact-method, .pricing-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// ===== FORM HANDLING =====
function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('.form-submit');
            const originalText = submitButton.innerHTML;
            
            // Show loading state
            submitButton.innerHTML = '<span>Enviando...</span><span class="submit-arrow">⏳</span>';
            submitButton.disabled = true;
            
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success state
            submitButton.innerHTML = '<span>¡Enviado!</span><span class="submit-arrow">✅</span>';
            
            // Reset form and button
            setTimeout(() => {
                contactForm.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Show success message
                showNotification('¡Mensaje enviado correctamente! Te responderemos pronto.', 'success');
            }, 1500);
        });
        
        // Form field focus effects
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.style.transform = 'scale(1.02)';
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.style.transform = 'scale(1)';
            });
        });
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        color: 'white',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease-out',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '400px',
        fontSize: '14px',
        fontWeight: '500'
    });
    
    const content = notification.querySelector('.notification-content');
    Object.assign(content.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    });
    
    const closeButton = notification.querySelector('.notification-close');
    Object.assign(closeButton.style, {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '18px',
        cursor: 'pointer',
        padding: '0',
        marginLeft: 'auto'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Manual close
    closeButton.addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// ===== INTERACTIVE ELEMENTS =====
function initializeInteractiveElements() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.hero-card, .pricing-card, .membership-card, .contact-method');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = card.style.transform.includes('scale') ? 
                card.style.transform : 
                (card.style.transform || '') + ' scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = card.style.transform.replace(/scale\([^)]*\)/g, '').trim();
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-hero-primary, .btn-hero-secondary, .plan-button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function initializePerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Throttle scroll events
    let scrollTimeout;
    const originalScrollHandlers = [];
    
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
        }, 16); // ~60fps
    }, { passive: true });
}

// ===== EASTER EGGS & SPECIAL EFFECTS =====
function initializeEasterEggs() {
    // Konami code easter egg
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.keyCode);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activatePartyMode();
        }
    });
    
    // Click counter on logo
    let logoClickCount = 0;
    const logo = document.querySelector('.logo-container');
    
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            logoClickCount++;
            
            if (logoClickCount === 10) {
                showNotification('¡Desarrollador secreto desbloqueado! 🚀', 'success');
                activateRainbowMode();
                logoClickCount = 0;
            }
        });
    }
}

function activatePartyMode() {
    // Add party effects
    document.body.style.animation = 'rainbow 2s ease-in-out infinite';
    
    // Create confetti
    createConfetti();
    
    showNotification('¡Modo fiesta activado! 🎉', 'success');
    
    // Reset after 10 seconds
    setTimeout(() => {
        document.body.style.animation = '';
        showNotification('Modo fiesta desactivado', 'info');
    }, 10000);
}

function activateRainbowMode() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        .rainbow-mode * {
            animation: rainbow 3s linear infinite;
        }
    `;
    document.head.appendChild(style);
    
    document.body.classList.add('rainbow-mode');
    
    setTimeout(() => {
        document.body.classList.remove('rainbow-mode');
        style.remove();
    }, 15000);
}

function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10000;
    `;
    
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: hsl(${Math.random() * 360}deg, 100%, 50%);
            left: ${Math.random() * 100}%;
            animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
            transform: rotate(${Math.random() * 360}deg);
        `;
        
        confettiContainer.appendChild(confetti);
    }
    
    // Add confetti animation
    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
        @keyframes confetti-fall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(confettiStyle);
    
    setTimeout(() => {
        confettiContainer.remove();
        confettiStyle.remove();
    }, 5000);
}

// ===== LANGUAGE SWITCHING FUNCTIONS =====
function switchToEnglish() {
    // Navigation
    updateElement("#home", "Home");
    updateElement("#about", "About Us");
    updateElement("#price", "Prices");
    updateElement("#contact", "Contact");
    
    // Hero Section
    updateElement("#titleBanner", "Improve your programming skills");
    updateElement("#txtBanner", "We have outstanding tutors who will teach you everything you need to enhance your knowledge and accelerate your professional career.");
    updateElement(".btnBanner", "ENROLL NOW");
    updateElement("#INSCRIBIRME", "ENROLL");
    
    // Membership Banner
    updateElement(".membership-banner-price h3", "Memberships");
    updateElement(".membership-banner-price p", "For Outstanding Tutors");
    
    const basicPlan = document.querySelectorAll(".boxP h3")[0];
    const standardPlan = document.querySelectorAll(".boxP h3")[1];
    const premiumPlan = document.querySelectorAll(".boxP h3")[2];
    
    if (basicPlan) basicPlan.textContent = "Basic Plan";
    if (standardPlan) standardPlan.textContent = "Standard Plan";
    if (premiumPlan) premiumPlan.textContent = "Premium Plan";
    
    updateElements(".details", "See details");
    
    // Video Section
    updateElement("#discover", "🎬 Discover TutorMatch");
    updateElement("#about-title", "👥 Meet Our Team");
    
    // About Section
    const aboutParagraphs = document.querySelectorAll(".about-box p");
    const aboutHeadings = document.querySelectorAll(".about-box h2");
    
    if (aboutParagraphs[0]) {
        aboutParagraphs[0].textContent = "An innovative platform that enables students to find qualified tutors who can assist them in specific courses of their career, organized by cycle and specialty. TutorMatch facilitates the connection between students, optimizing the learning process and helping improve academic performance in key subjects.";
    }
    
    if (aboutHeadings[0]) {
        aboutHeadings[0].innerHTML = '<span class="highlight-white">Students with </span><span class="highlight-dark">academic difficulties</span>';
    }
    
    if (aboutParagraphs[1]) {
        aboutParagraphs[1].textContent = "This segment covers Software Engineering students at UPC facing challenges in specific courses, seeking additional support to improve their understanding and academic performance. These students may need reinforcement in technical concepts, project guidance, or exam preparation. TutorMatch offers them an accessible platform where they can find specialized tutors by cycle and subject.";
    }
    
    if (aboutHeadings[1]) {
        aboutHeadings[1].innerHTML = '<span class="highlight-white">Students with </span><span class="highlight-dark">outstanding skills</span>';
    }
    
    if (aboutParagraphs[2]) {
        aboutParagraphs[2].textContent = "These are students with solid mastery in certain areas of Software Engineering who wish to share their knowledge with other students through tutoring. TutorMatch offers them the opportunity to gain teaching experience, improve their resumes, and in some cases, generate income while refining their communication, teaching, and leadership skills.";
    }
    
    // Membership Section
    updateElement(".membership-header h2", "Tutor Memberships");
    
    // Update membership features
    updateMembershipFeatures('en');
    
    // Contact Section
    updateElement(".contact-title", "Got any questions?");
    updateElement(".contact-description", "We'd love to hear from you. Send us a message and we'll respond as soon as possible.");
    
    // Update contact form
    updateFormPlaceholders('en');
    
    // Footer
    updateElement(".footer-description", "Connecting students with the best tutors to accelerate their academic and professional growth.");
    updateElement(".footer-copy p", "© 2025 TutorMatch - SkillSwap Inc. All rights reserved.");
}

function switchToSpanish() {
    // Navigation
    updateElement("#home", "Inicio");
    updateElement("#about", "Acerca de nosotros");
    updateElement("#price", "Precios");
    updateElement("#contact", "Contacto");
    
    // Hero Section
    updateElement("#titleBanner", "Mejora tus habilidades en programación");
    updateElement("#txtBanner", "Contamos con destacados tutores que te enseñarán todo lo que necesitas para potenciar tus conocimientos y acelerar tu carrera profesional.");
    updateElement(".btnBanner", "INSCRIBIRME");
    updateElement("#INSCRIBIRME", "INSCRIBIRME");
    
    // Membership Banner
    updateElement(".membership-banner-price h3", "Membresías");
    updateElement(".membership-banner-price p", "Para Tutores Destacados");
    
    const basicPlan = document.querySelectorAll(".boxP h3")[0];
    const standardPlan = document.querySelectorAll(".boxP h3")[1];
    const premiumPlan = document.querySelectorAll(".boxP h3")[2];
    
    if (basicPlan) basicPlan.textContent = "Plan Básico";
    if (standardPlan) standardPlan.textContent = "Plan Estándar";
    if (premiumPlan) premiumPlan.textContent = "Plan Premium";
    
    updateElements(".details", "Ver detalles");
    
    // Video Section
    updateElement("#discover", "🎬 Descubre TutorMatch");
    updateElement("#about-title", "👥 Conoce a Nuestro Equipo");
    
    // About Section
    const aboutParagraphs = document.querySelectorAll(".about-box p");
    const aboutHeadings = document.querySelectorAll(".about-box h2");
    
    if (aboutParagraphs[0]) {
        aboutParagraphs[0].textContent = "Una plataforma innovadora que permite a los estudiantes encontrar tutores especializados que puedan ayudarlos en cursos específicos de su carrera, organizados por ciclo y especialidad. TutorMatch facilita la conexión entre estudiantes, optimizando el proceso de aprendizaje y ayudando a mejorar el rendimiento académico en materias clave.";
    }
    
    if (aboutHeadings[0]) {
        aboutHeadings[0].innerHTML = '<span class="highlight-white">Estudiantes con </span><span class="highlight-dark">dificultades académicas</span>';
    }
    
    if (aboutParagraphs[1]) {
        aboutParagraphs[1].textContent = "Este segmento abarca a estudiantes de Ingeniería de Software de la UPC que enfrentan dificultades en cursos específicos y buscan apoyo adicional para mejorar su comprensión y rendimiento académico. Estos estudiantes pueden tener diversas necesidades, como refuerzos en conceptos técnicos, orientación en proyectos o preparación para exámenes.";
    }
    
    if (aboutHeadings[1]) {
        aboutHeadings[1].innerHTML = '<span class="highlight-white">Estudiantes con </span><span class="highlight-dark">habilidades destacadas</span>';
    }
    
    if (aboutParagraphs[2]) {
        aboutParagraphs[2].textContent = "Son estudiantes con un dominio sólido en ciertas áreas de la Ingeniería de Software que desean compartir sus conocimientos con otros estudiantes a través de tutorías. TutorMatch les ofrece la oportunidad de obtener experiencia docente, mejorar su currículum y, en algunos casos, generar ingresos mientras refinan sus habilidades de comunicación, enseñanza y liderazgo.";
    }
    
    // Membership Section
    updateElement(".membership-header h2", "Membresías para Tutores");
    
    // Update membership features
    updateMembershipFeatures('es');
    
    // Contact Section
    updateElement(".contact-title", "¿Tienes alguna pregunta?");
    updateElement(".contact-description", "Nos encantaría escucharte. Envíanos un mensaje y te responderemos lo antes posible.");
    
    // Update contact form
    updateFormPlaceholders('es');
    
    // Footer
    updateElement(".footer-description", "Conectando estudiantes con los mejores tutores para acelerar su crecimiento académico y profesional.");
    updateElement(".footer-copy p", "© 2025 TutorMatch - SkillSwap Inc. Todos los derechos reservados.");
}

// ===== UTILITY FUNCTIONS =====
function updateElement(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = text;
    }
}

function updateElements(selector, text) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        if (element) {
            element.textContent = text;
        }
    });
}

function updateMembershipFeatures(lang) {
    const features = {
        en: {
            basic: [
                "Access to interested students",
                "Tutoring history",
                "Support with 48-hour response"
            ],
            standard: [
                "Everything in basic plan",
                "Personalized recommendations",
                "Improved search visibility",
                "Support with 24-hour response",
                "Advanced management tools",
                "Automated reminders"
            ],
            premium: [
                "Everything in standard plan",
                "Featured profile with higher exposure",
                "Advanced performance statistics",
                "Platform ad promotions and discounts",
                "Priority support (12-hour response)",
                "Exclusive events and networking"
            ]
        },
        es: {
            basic: [
                "Acceso a estudiantes interesados",
                "Historial de tutorías",
                "Soporte con respuesta en 48 horas"
            ],
            standard: [
                "Todo en el plan básico",
                "Recomendaciones personalizadas",
                "Mayor visibilidad en búsquedas",
                "Soporte con respuesta en 24 horas",
                "Herramientas de gestión avanzadas",
                "Recordatorios automáticos"
            ],
            premium: [
                "Todo en el plan estándar",
                "Perfil destacado con mayor exposición",
                "Estadísticas avanzadas de rendimiento",
                "Promociones y descuentos en anuncios",
                "Soporte prioritario (respuesta en 12 horas)",
                "Eventos exclusivos y networking"
            ]
        }
    };
    
    const membershipCards = document.querySelectorAll('.membership-card');
    membershipCards.forEach((card, index) => {
        const featureItems = card.querySelectorAll('.feature-item span:last-child');
        const planType = ['basic', 'standard', 'premium'][index];
        
        if (features[lang][planType]) {
            featureItems.forEach((item, featureIndex) => {
                if (features[lang][planType][featureIndex]) {
                    item.textContent = features[lang][planType][featureIndex];
                }
            });
        }
    });
}

function updateFormPlaceholders(lang) {
    const placeholders = {
        en: {
            name: "Enter your full name",
            email: "your@email.com",
            message: "Tell us how we can help you...",
            submit: "Send message"
        },
        es: {
            name: "Ingresa tu nombre completo",
            email: "tu@email.com", 
            message: "Cuéntanos cómo podemos ayudarte...",
            submit: "Enviar mensaje"
        }
    };
    
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const messageInput = document.querySelector('#message');
    const submitButton = document.querySelector('.form-submit span:first-child');
    
    if (nameInput) nameInput.placeholder = placeholders[lang].name;
    if (emailInput) emailInput.placeholder = placeholders[lang].email;
    if (messageInput) messageInput.placeholder = placeholders[lang].message;
    if (submitButton) submitButton.textContent = placeholders[lang].submit;
}

// ===== INITIALIZATION =====
function initializeApp() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
        return;
    }
    
    // Initialize all features
    try {
        initializeNavigation();
        initializeLanguageToggle();
        initializeHeaderEffects();
        initializeAnimations();
        initializeFormHandling();
        initializeInteractiveElements();
        initializePerformanceOptimizations();
        initializeEasterEggs();
        
        // Set initial language
        switchToSpanish();
        
        // Add CSS animations
        addCustomCSS();
        
        console.log('🚀 TutorMatch app initialized successfully!');
        
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

function addCustomCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .highlight {
            animation: highlight-pulse 2s ease-in-out;
        }
        
        @keyframes highlight-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
            50% { box-shadow: 0 0 0 20px rgba(245, 158, 11, 0); }
        }
        
        @keyframes ripple {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        
        .floating {
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        /* Smooth transitions for all interactive elements */
        * {
            transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: var(--bg-secondary);
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--gradient-primary);
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: var(--primary-dark);
        }
    `;
    document.head.appendChild(style);
}

// ===== AUTO-INITIALIZATION =====
initializeApp();