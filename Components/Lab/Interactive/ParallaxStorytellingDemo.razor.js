export function createParallaxStory(root) {
    const panels = [...root.querySelectorAll('.parallax-panel')];
    const visiblePanels = new Set();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileLayout = window.matchMedia('(max-width: 700px), (pointer: coarse)');
    let frame = 0;

    const reset = () => {
        panels.forEach(panel => panel.style.setProperty('--parallax-y', '0px'));
    };

    const update = () => {
        frame = 0;

        if (reducedMotion.matches || !mobileLayout.matches) {
            reset();
            return;
        }

        const viewportHeight = window.innerHeight || 1;
        const strength = 14;

        visiblePanels.forEach(panel => {
            const bounds = panel.getBoundingClientRect();
            const panelCenter = bounds.top + bounds.height / 2;
            const progress = Math.max(-1, Math.min(1, (viewportHeight / 2 - panelCenter) / viewportHeight));
            panel.style.setProperty('--parallax-y', `${(progress * strength).toFixed(2)}px`);
        });
    };

    const schedule = () => {
        if (!frame && visiblePanels.size && !reducedMotion.matches && mobileLayout.matches)
            frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting)
                visiblePanels.add(entry.target);
            else
                visiblePanels.delete(entry.target);
        });
        schedule();
    }, { rootMargin: '25% 0px', threshold: 0 });

    const onReducedMotionChange = () => reducedMotion.matches ? reset() : schedule();

    panels.forEach(panel => observer.observe(panel));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    reducedMotion.addEventListener('change', onReducedMotionChange);
    mobileLayout.addEventListener('change', schedule);

    return {
        dispose() {
            observer.disconnect();
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            reducedMotion.removeEventListener('change', onReducedMotionChange);
            mobileLayout.removeEventListener('change', schedule);
            if (frame)
                cancelAnimationFrame(frame);
            visiblePanels.clear();
            reset();
        }
    };
}
