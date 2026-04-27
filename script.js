document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('main-card');
    
    if (card) {
        // Mouse tracking for the glow effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // Subtle 3D tilt effect
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3; // max rotation 3deg
            const rotateY = ((x - centerX) / centerX) * 3;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            
            // Reset glow position to center for next hover transition
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${rect.width / 2}px`);
            card.style.setProperty('--mouse-y', `${rect.height / 2}px`);
        });
    }
});
