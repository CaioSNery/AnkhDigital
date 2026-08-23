export async function copyEmail(email) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(email);
            return true;
        } catch {
            // Use the legacy fallback below when clipboard permissions are unavailable.
        }
    }

    const fallback = document.createElement("textarea");
    fallback.value = email;
    fallback.setAttribute("readonly", "");
    fallback.setAttribute("aria-hidden", "true");
    fallback.style.position = "fixed";
    fallback.style.opacity = "0";
    fallback.style.pointerEvents = "none";
    document.body.appendChild(fallback);
    fallback.select();
    fallback.setSelectionRange(0, email.length);

    try {
        return document.execCommand("copy");
    } finally {
        document.body.removeChild(fallback);
    }
}
