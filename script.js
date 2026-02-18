/* 
================================================================
GLOBAL INTERACTIVITY & LOGIC
================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Reveal Logic (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Initial check for all nodes with reveal-node class
    document.querySelectorAll('.reveal-node').forEach(node => revealObserver.observe(node));

    // 2. Confetti Celebration (for Enlistment Form)
    const enlistForm = document.getElementById('enlistForm');
    if (enlistForm) {
        enlistForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Fire confetti if library is loaded
            if (typeof confetti === 'function') {
                const count = 200;
                const defaults = { 
                    origin: { y: 0.7 }, 
                    colors: ['#FFD700', '#0077be', '#cc0000', '#ffffff'],
                    zIndex: 3000
                };

                const fire = (particleRatio, opts) => {
                    confetti({
                        ...defaults,
                        ...opts,
                        particleCount: Math.floor(count * particleRatio)
                    });
                };

                fire(0.25, { spread: 26, startVelocity: 55 });
                fire(0.2, { spread: 60 });
                fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
                fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
                fire(0.1, { spread: 120, startVelocity: 45 });
            }

            setTimeout(() => {
                alert("WELCOME TO THE CREW! 🏴‍☠️✨");
                this.reset();
            }, 500);
        });
    }

    // 3. Navigation Scroll Effect
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.style.padding = '1rem 1.5rem';
                nav.style.background = 'rgba(11, 14, 20, 0.95)';
            } else {
                nav.style.padding = '1.5rem';
                nav.style.background = 'rgba(11, 14, 20, 0.9)';
            }
        });
    }
});
