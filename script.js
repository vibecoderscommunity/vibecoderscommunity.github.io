document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('main-card');
    if (!card) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let rafId = null;
    let pendingClientX = 0;
    let pendingClientY = 0;

    card.addEventListener('mousemove', (e) => {
        pendingClientX = e.clientX;
        pendingClientY = e.clientY;

        if (rafId !== null) return;
        rafId = requestAnimationFrame(() => {
            rafId = null;
            const rect = card.getBoundingClientRect();
            const x = pendingClientX - rect.left;
            const y = pendingClientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -3;
            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 3;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
        });
    });

    card.addEventListener('mouseleave', () => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }

        // Smooth reset using a temporary transition, then restore the CSS default
        card.style.transition = 'transform 0.5s ease, border-color 0.3s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${rect.width / 2}px`);
        card.style.setProperty('--mouse-y', `${rect.height / 2}px`);

        card.addEventListener('transitionend', () => {
            card.style.transition = '';
        }, { once: true });
    });
});
