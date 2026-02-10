import { useState, useEffect, useCallback } from 'react';

const useCategoryScroll = (categories, products, loading, searchParams) => {
    const [activeCategory, setActiveCategory] = useState(null);
    const HEADER_OFFSET = 180;

    const scrollToCategory = useCallback((slug) => {
        const element = document.getElementById(slug);
        if (element) {
            const top = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (!loading && categories?.length > 0 && categoryParam) {
            const timeoutId = setTimeout(() => scrollToCategory(categoryParam), 100);
            return () => clearTimeout(timeoutId);
        }
    }, [loading, categories, searchParams, scrollToCategory]);

    useEffect(() => {
        if (!categories?.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const activeEntry = entries.find((entry) => entry.isIntersecting);
                if (activeEntry) setActiveCategory(activeEntry.target.id);
            },
            { rootMargin: `-${HEADER_OFFSET}px 0px -70% 0px` }
        );

        categories.forEach(({ slug }) => {
            const el = document.getElementById(slug);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [categories, products]);

    return { activeCategory, scrollToCategory };
};

export default useCategoryScroll;

