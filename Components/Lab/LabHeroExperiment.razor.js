export function createLabHeroMotion(board) {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const reset = () => {
        cancelAnimationFrame(frame);
        board.style.setProperty('--lab-x', '0px');
        board.style.setProperty('--lab-y', '0px');
        board.style.setProperty('--lab-x-reverse', '0px');
        board.style.setProperty('--lab-y-reverse', '0px');
        board.style.setProperty('--interaction-x', '0px');
        board.style.setProperty('--interaction-y', '0px');
        board.style.setProperty('--pointer-x', '50%');
        board.style.setProperty('--pointer-y', '50%');
    };

    const move = event => {
        if (!finePointer.matches || reducedMotion.matches)
            return;

        const rect = board.getBoundingClientRect();
        const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - .5) * 2));
        const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - .5) * 2));

        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
            board.style.setProperty('--lab-x', `${(nx * 4.5).toFixed(2)}px`);
            board.style.setProperty('--lab-y', `${(ny * 3.5).toFixed(2)}px`);
            board.style.setProperty('--lab-x-reverse', `${(nx * -2.5).toFixed(2)}px`);
            board.style.setProperty('--lab-y-reverse', `${(ny * -2).toFixed(2)}px`);
            board.style.setProperty('--interaction-x', `${(nx * 5).toFixed(2)}px`);
            board.style.setProperty('--interaction-y', `${(ny * 4).toFixed(2)}px`);
            board.style.setProperty('--pointer-x', `${((nx + 1) * 50).toFixed(1)}%`);
            board.style.setProperty('--pointer-y', `${((ny + 1) * 50).toFixed(1)}%`);
        });
    };

    board.addEventListener('pointermove', move, { passive: true });
    board.addEventListener('pointerleave', reset);
    reducedMotion.addEventListener('change', reset);
    finePointer.addEventListener('change', reset);

    return {
        dispose() {
            cancelAnimationFrame(frame);
            board.removeEventListener('pointermove', move);
            board.removeEventListener('pointerleave', reset);
            reducedMotion.removeEventListener('change', reset);
            finePointer.removeEventListener('change', reset);
        }
    };
}

export function scrollToExperiences() {
    const target = document.getElementById('experiencias');
    if (!target)
        return;

    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    target.scrollIntoView({ behavior, block: 'start' });
    history.replaceState(null, '', '/lab#experiencias');
}
