export function createPerspectiveTilt(root) {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let latestEvent = null;

    const reset = () => {
        root.style.setProperty('--tilt-x', '0deg');
        root.style.setProperty('--tilt-y', '0deg');
    };

    const update = () => {
        frame = 0;

        if (!latestEvent || !finePointer.matches || reducedMotion.matches) {
            reset();
            return;
        }

        const card = root.querySelector('.active-card');
        if (!card)
            return;

        const bounds = card.getBoundingClientRect();
        const normalizedX = Math.max(0, Math.min(1, (latestEvent.clientX - bounds.left) / bounds.width));
        const normalizedY = Math.max(0, Math.min(1, (latestEvent.clientY - bounds.top) / bounds.height));
        const rotateY = (normalizedX - .5) * 16;
        const rotateX = (.5 - normalizedY) * 12;

        root.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
        root.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
    };

    const onPointerMove = event => {
        if (event.pointerType === 'touch' || !event.target.closest('.active-card'))
            return;

        latestEvent = event;
        if (!frame)
            frame = requestAnimationFrame(update);
    };

    const onPointerLeave = () => {
        latestEvent = null;
        if (frame)
            cancelAnimationFrame(frame);
        frame = 0;
        reset();
    };

    root.addEventListener('pointermove', onPointerMove, { passive: true });
    root.addEventListener('pointerleave', onPointerLeave, { passive: true });
    reducedMotion.addEventListener('change', reset);
    finePointer.addEventListener('change', reset);

    return {
        dispose() {
            root.removeEventListener('pointermove', onPointerMove);
            root.removeEventListener('pointerleave', onPointerLeave);
            reducedMotion.removeEventListener('change', reset);
            finePointer.removeEventListener('change', reset);
            if (frame)
                cancelAnimationFrame(frame);
            reset();
        }
    };
}
