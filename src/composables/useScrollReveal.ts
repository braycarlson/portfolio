import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import { assert } from '@/utils/assert';

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
    let observer: IntersectionObserver | null = null;

    onMounted(() => {
        if (!element.value) return;

        observer = new IntersectionObserver(
            ([entry]) => {
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
