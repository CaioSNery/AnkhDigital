export function createInteractiveCardsPointer(stage) {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const reset = () => {
        cancelAnimationFrame(frame);
        stage.style.setProperty('--pointer-x', '50%');
        stage.style.setProperty('--pointer-y', '42%');
        stage.classList.remove('is-pointer-active');
    };

    const move = event => {
        if (!finePointer.matches || reducedMotion.matches)
            return;

        const rect = stage.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));

        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
            stage.style.setProperty('--pointer-x', `${x.toFixed(1)}px`);
            stage.style.setProperty('--pointer-y', `${y.toFixed(1)}px`);
            stage.classList.add('is-pointer-active');
        });
    };

    stage.addEventListener('pointermove', move, { passive: true });
    stage.addEventListener('pointerleave', reset);
    finePointer.addEventListener('change', reset);
    reducedMotion.addEventListener('change', reset);

    return {
        dispose() {
            cancelAnimationFrame(frame);
            stage.removeEventListener('pointermove', move);
            stage.removeEventListener('pointerleave', reset);
            finePointer.removeEventListener('change', reset);
            reducedMotion.removeEventListener('change', reset);
        }
    };
}
