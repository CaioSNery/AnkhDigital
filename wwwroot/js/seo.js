window.ankhSeo = {
    apply: function (
        title,
        description,
        canonicalUrl,
        imageUrl,
        openGraphType = "website",
        robots = "index, follow",
        structuredData = ""
    ) {
        const setContent = (id, value) => {
            if (!value) return;

            const element = document.getElementById(id);

            if (element) {
                element.setAttribute("content", value);
            }
        };

        if (title) {
            document.title = title;
        }

        setContent("seo-description", description);
        setContent("seo-robots", robots);

        // Open Graph
        setContent("seo-og-title", title);
        setContent("seo-og-description", description);
        setContent("seo-og-type", openGraphType);
        setContent("seo-og-url", canonicalUrl);
        setContent("seo-og-image", imageUrl);

        // Twitter / X
        setContent("seo-twitter-title", title);
        setContent("seo-twitter-description", description);
        setContent("seo-twitter-image", imageUrl);

        // Canonical
        if (canonicalUrl) {
            const canonical = document.getElementById("seo-canonical");

            if (canonical) {
                canonical.setAttribute("href", canonicalUrl);
            }
        }

        // Structured Data
        if (structuredData) {
            const jsonLd = document.getElementById("seo-jsonld");

            if (jsonLd) {
                jsonLd.textContent = structuredData;
            }
        }
    }
};
