window.ankhSeo = {
    apply: function (title, description, canonicalUrl, imageUrl, openGraphType, robots, structuredData) {
        const setContent = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.setAttribute('content', value);
        };

        document.title = title;
        setContent('seo-description', description);
        setContent('seo-robots', robots);
        setContent('seo-og-title', title);
        setContent('seo-og-description', description);
        setContent('seo-og-type', openGraphType);
        setContent('seo-og-url', canonicalUrl);
        setContent('seo-og-image', imageUrl);
        setContent('seo-twitter-title', title);
        setContent('seo-twitter-description', description);
        setContent('seo-twitter-image', imageUrl);

        const canonical = document.getElementById('seo-canonical');
        if (canonical) canonical.setAttribute('href', canonicalUrl);

        const jsonLd = document.getElementById('seo-jsonld');
        if (jsonLd) jsonLd.textContent = structuredData;
    }
};
