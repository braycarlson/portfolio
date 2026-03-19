import { ref, computed, onMounted, type ComputedRef, type Ref } from 'vue';
import { useEventListener } from '@vueuse/core';

const SCROLL_THRESHOLD = 20;

const scrollY = ref(0);
const documentHeight = ref(0);
const clientHeight = ref(0);

let bound = false;

function bind(): void {
    if (bound) return;
    bound = true;

    useEventListener(window, 'scroll', () => {
        scrollY.value = document.documentElement.scrollTop;
        documentHeight.value = document.documentElement.scrollHeight;
        clientHeight.value = document.documentElement.clientHeight;
    }, { passive: true });

    onMounted(() => {
        scrollY.value = document.documentElement.scrollTop;
        documentHeight.value = document.documentElement.scrollHeight;
        clientHeight.value = document.documentElement.clientHeight;
    });
}

const scrolled = computed(() => scrollY.value > SCROLL_THRESHOLD);

const progress = computed(() => {
    const scrollable = documentHeight.value - clientHeight.value;

    if (scrollable <= 0) return 0;

    return scrollY.value / scrollable;
});

export function useScrollState(): {
    progress: ComputedRef<number>;
    scrollY: Ref<number>;
    scrolled: ComputedRef<boolean>;
} {
    bind();
    return { progress, scrollY, scrolled };
}
