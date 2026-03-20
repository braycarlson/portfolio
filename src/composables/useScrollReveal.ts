import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { assert } from '@/utils/assert';

const MOBILE_BREAKPOINT = '(max-width: 768px)';

export function useScrollReveal(
    margin = '-150px',
    durationMs = 1200,
): {
    element: Ref<Element | null>;
    settled: Ref<boolean>;
    visible: Ref<boolean>;
} {
    assert(durationMs > 0, `useScrollReveal requires a positive duration, received: ${durationMs}`);

    const element = ref<Element | null>(null);
    const visible = ref(false);
    const settled = ref(false);
    const isMobile = useMediaQuery(MOBILE_BREAKPOINT);
    let observer: IntersectionObserver | null = null;

    onMounted(() => {
        if (isMobile.value) {
            visible.value = true;
            settled.value = true;
            return;
        }

        if (!element.value) return;

        observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry) return;

                if (entry.isIntersecting) {
                    visible.value = true;

                    setTimeout(() => {
                        settled.value = true;
                    }, durationMs);

                    observer?.disconnect();
                }
            },
            {
                rootMargin: `0px 0px ${margin} 0px`,
                threshold: 0,
            },
        );

        observer.observe(element.value);
    });

    onUnmounted(() => {
        observer?.disconnect();
    });

    return { element, settled, visible };
}
