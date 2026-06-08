document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Inicialización y Utilidades ---
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Año automático
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- 2. Gestión de Tema (Dark/Light) ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle?.querySelector('i');

    const setTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        themeToggle?.setAttribute('aria-label', 
            theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'
        );
    };

    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(savedTheme || systemTheme);

        themeToggle.addEventListener('click', () => {
            const isDark = htmlElement.getAttribute('data-theme') === 'dark';
            setTheme(isDark ? 'light' : 'dark');
        });
    }

    // --- 3. Menú Móvil Accesible ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = navLinks?.querySelectorAll('a');

    const toggleMenu = (forceClose = false) => {
        const isOpen = forceClose ? false : !navLinks.classList.contains('active');
        
        navLinks.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        }

        // Bloqueo de scroll al abrir menú
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => toggleMenu());

        // Cerrar al clickear enlaces
        navItems.forEach(link => {
            link.addEventListener('click', () => toggleMenu(true));
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                toggleMenu(true);
                hamburger.focus();
            }
        });
    }

    // --- 4. Header & Scroll Effects ---
    const header = document.getElementById('header');
    const backToTop = document.querySelector('.back-to-top');

    const handleScroll = () => {
        const scrolled = window.scrollY > 50;
        
        if (header) {
            header.classList.toggle('is-scrolled', scrolled);
        }
        
        if (backToTop) {
            backToTop.classList.toggle('show', window.scrollY > 500);
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- 5. Validación y Envío de Formulario ---
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Feedback element (para accesibilidad aria-live)
        const feedback = document.createElement('div');
        feedback.setAttribute('aria-live', 'polite');
        feedback.style.marginTop = '1rem';
        feedback.style.fontWeight = '600';
        contactForm.appendChild(feedback);

        contactForm.addEventListener('submit', async (e) => {
            const action = contactForm.getAttribute('action');
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            
            // Limpiar feedback previo
            feedback.className = '';

            // 1. Validar configuración
            if (action && (action.includes('TU_ID') || action === '')) {
                e.preventDefault();
                feedback.textContent = '⚠️ Error: El formulario no está configurado (Falta TU_ID de Formspree o URL de Power Automate).';
                feedback.classList.add('feedback-warning');
                return;
            }

            // 2. Validación básica
            const name = contactForm.querySelector('input[name="name"]')?.value;
            const subject = contactForm.querySelector('input[name="subject"]')?.value;
            const email = contactForm.querySelector('input[type="email"]')?.value;
            const message = contactForm.querySelector('textarea[name="message"]')?.value;

            if (!name || !subject || !email || !message) {
                e.preventDefault();
                feedback.textContent = '❌ Por favor, completa todos los campos.';
                feedback.classList.add('feedback-error');
                return;
            }

            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                e.preventDefault();
                feedback.textContent = '❌ Por favor, ingresa un correo electrónico válido.';
                feedback.classList.add('feedback-error');
                return;
            }

            // 3. UI de envío
            if (submitBtn) {
                submitBtn.disabled = true;
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

                // Envío asíncrono (compatible con Formspree y Power Automate)
                if (action && (action.startsWith('https://formspree.io') || action.includes('logic.azure.com'))) {
                    e.preventDefault();
                    try {
                        const response = await fetch(action, {
                            method: 'POST',
                            body: new FormData(contactForm),
                            headers: { 'Accept': 'application/json' }
                        });

                        if (response.ok) {
                            feedback.textContent = '✅ ¡Mensaje enviado con éxito! Me pondré en contacto pronto.';
                            feedback.classList.add('feedback-success');
                            contactForm.reset();
                        } else {
                            throw new Error();
                        }
                    } catch (err) {
                        feedback.textContent = '❌ Hubo un problema al enviar el mensaje. Inténtalo de nuevo.';
                        feedback.classList.add('feedback-error');
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }
                }
                // Si no es Formspree, permitimos que el navegador maneje el submit normal
            }
        });
    }
});