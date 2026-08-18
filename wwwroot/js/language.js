window.ankhLanguage = {
    initialize: function (supported) {
        let saved = null;
        try {
            saved = localStorage.getItem('ankh-language') || sessionStorage.getItem('ankh-language');
        } catch { }
        if (!saved) {
            const match = document.cookie.match(/(?:^|;\s*)ankh-language=([^;]+)/);
            saved = match ? decodeURIComponent(match[1]) : null;
        }
        if (!saved && window.name.startsWith('ankh-language:')) {
            saved = window.name.substring('ankh-language:'.length);
        }
        if (saved && supported.includes(saved)) return saved;

        const preferences = navigator.languages?.length ? navigator.languages : [navigator.language || 'pt-BR'];
        for (const preference of preferences) {
            const code = String(preference).toLowerCase().split('-')[0];
            if (supported.includes(code)) return code;
        }

        return 'en';
    },
    apply: function (code, locale, rtl, persist) {
        const root = document.documentElement;
        root.lang = locale;
        root.dir = rtl ? 'rtl' : 'ltr';
        root.dataset.language = code;
        if (persist) {
            try {
                localStorage.setItem('ankh-language', code);
                sessionStorage.setItem('ankh-language', code);
            } catch { }
            document.cookie = `ankh-language=${encodeURIComponent(code)};path=/;max-age=31536000;SameSite=Lax`;
            window.name = `ankh-language:${code}`;
        }
    }
};
