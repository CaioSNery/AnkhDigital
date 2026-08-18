const interactiveSelector = [
    'a[href]',
    'button:not(:disabled)',
    '[role="button"]',
    'summary',
    'label[for]',
    '[data-cursor="interactive"]'
].join(',');

const nativeSelector = [
    'input',
    'textarea',
    'select',
    'option',
    '[contenteditable="true"]',
    '[role="textbox"]',
    'pre',
    'code'
].join(',');

const selectableTextSelector = [
    'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'li', 'blockquote', 'dt', 'dd'
].join(',');

export function createCursor(tip, halo) {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let enabled = false;
    let frame = 0;
    let targetX = -100;
    let targetY = -100;
    let haloX = -100;
    let haloY = -100;
    let hasPosition = false;

    const setPosition = (element, x, y) => {
        element.style.setProperty('--cursor-x', `${x}px`);
        element.style.setProperty('--cursor-y', `${y}px`);
    };

    const hide = () => {
        tip.classList.remove('is-visible');
        halo.classList.remove('is-visible');
        tip.classList.remove('is-interactive', 'is-pressed');
        halo.classList.remove('is-interactive', 'is-pressed');
    };

    const animateHalo = () => {
        frame = 0;

        if (reducedMotion.matches) {
            haloX = targetX;
            haloY = targetY;
        } else {
            haloX += (targetX - haloX) * 0.22;
            haloY += (targetY - haloY) * 0.22;
        }

        setPosition(halo, haloX, haloY);

        if (!reducedMotion.matches && (Math.abs(targetX - haloX) > 0.15 || Math.abs(targetY - haloY) > 0.15))
            frame = requestAnimationFrame(animateHalo);
    };

    const onPointerMove = event => {
        if (!enabled || event.pointerType === 'touch') {
            hide();
            return;
        }

        const target = event.target instanceof Element ? event.target : null;
        const interactive = Boolean(target?.closest(interactiveSelector));
        const preserveNative = !interactive && Boolean(target?.closest(nativeSelector) || target?.closest(selectableTextSelector));

        if (preserveNative) {
            hide();
            return;
        }

        targetX = event.clientX;
        targetY = event.clientY;
        setPosition(tip, targetX, targetY);

        if (!hasPosition) {
            haloX = targetX;
            haloY = targetY;
            setPosition(halo, haloX, haloY);
            hasPosition = true;
        }

        tip.classList.toggle('is-interactive', interactive);
        halo.classList.toggle('is-interactive', interactive);
        tip.classList.add('is-visible');
        halo.classList.add('is-visible');

        if (frame === 0)
            frame = requestAnimationFrame(animateHalo);
    };

    const onPointerDown = event => {
        if (event.pointerType !== 'touch') {
            tip.classList.add('is-pressed');
            halo.classList.add('is-pressed');
        }
    };

    const onPointerUp = () => {
        tip.classList.remove('is-pressed');
        halo.classList.remove('is-pressed');
    };

    const onWindowOut = event => {
        if (!event.relatedTarget) {
            hasPosition = false;
            hide();
        }
    };

    const enable = () => {
        if (enabled || !finePointer.matches) return;
        enabled = true;
        document.documentElement.classList.add('ankh-cursor-enabled');
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerdown', onPointerDown, { passive: true });
        window.addEventListener('pointerup', onPointerUp, { passive: true });
        window.addEventListener('mouseout', onWindowOut, { passive: true });
        window.addEventListener('blur', hide);
    };

    const disable = () => {
        if (!enabled) return;
        enabled = false;
        document.documentElement.classList.remove('ankh-cursor-enabled');
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('mouseout', onWindowOut);
        window.removeEventListener('blur', hide);
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        hasPosition = false;
        hide();
    };

    const onCapabilityChange = () => finePointer.matches ? enable() : disable();
    finePointer.addEventListener('change', onCapabilityChange);
    enable();

    return {
        dispose() {
            disable();
            finePointer.removeEventListener('change', onCapabilityChange);
        }
    };
}
