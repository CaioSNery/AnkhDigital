const storageKey = 'ankh-orientation-hint-dismissed';

export function wasDismissed() {
    try {
        return sessionStorage.getItem(storageKey) === 'true';
    } catch {
        return false;
    }
}

export function dismiss() {
    try {
        sessionStorage.setItem(storageKey, 'true');
    } catch {
        // The hint remains dismissed in the current rendered view when storage is unavailable.
    }
}
