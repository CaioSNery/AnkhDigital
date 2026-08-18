export function createMicroEffects(root) {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let current = null;
    let latest = null;

    const reset = element => {
        if (!element) return;
        element.style.setProperty('--pointer-x', '50%');
        element.style.setProperty('--pointer-y', '50%');
        element.style.setProperty('--magnet-x', '0px');
        element.style.setProperty('--magnet-y', '0px');
        element.style.setProperty('--card-rx', '0deg');
        element.style.setProperty('--card-ry', '0deg');
    };

    const update = () => {
        frame = 0;
        if (!current || !latest || !finePointer.matches || reducedMotion.matches) return reset(current);
        const bounds = current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (latest.clientX - bounds.left) / bounds.width));
        const y = Math.max(0, Math.min(1, (latest.clientY - bounds.top) / bounds.height));
        current.style.setProperty('--pointer-x', `${(x * 100).toFixed(1)}%`);
        current.style.setProperty('--pointer-y', `${(y * 100).toFixed(1)}%`);

        if (current.matches('[data-magnetic]')) {
            current.style.setProperty('--magnet-x', `${((x - .5) * 12).toFixed(2)}px`);
            current.style.setProperty('--magnet-y', `${((y - .5) * 10).toFixed(2)}px`);
        }
        if (current.matches('[data-spotlight]')) {
            current.style.setProperty('--card-rx', `${((.5 - y) * 5).toFixed(2)}deg`);
            current.style.setProperty('--card-ry', `${((x - .5) * 6).toFixed(2)}deg`);
        }
    };

    const onMove = event => {
        if (event.pointerType === 'touch') return;
        const target = event.target.closest('[data-magnetic], [data-spotlight]');
        if (target !== current) { reset(current); current = target; }
        latest = event;
        if (current && !frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () => { reset(current); current = null; latest = null; };
    const onMotionChange = () => { if (reducedMotion.matches || !finePointer.matches) onLeave(); };

    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave, { passive: true });
    reducedMotion.addEventListener('change', onMotionChange);
    finePointer.addEventListener('change', onMotionChange);

    return { dispose() {
        root.removeEventListener('pointermove', onMove);
        root.removeEventListener('pointerleave', onLeave);
        reducedMotion.removeEventListener('change', onMotionChange);
        finePointer.removeEventListener('change', onMotionChange);
        if (frame) cancelAnimationFrame(frame);
        onLeave();
    }};
}
