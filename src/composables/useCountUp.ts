import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { assert } from '@/utils/assert';

const MAX_FRAMES = 10_000;

export function useCountUp(
    target: Ref<number>,
    durationMs: number,
    trigger: Ref<boolean>,
): Ref<number> {
    assert(durationMs > 0, `useCountUp requires a positive duration, received: ${durationMs}`);

    const current = ref(0);
    const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    let frameId = 0;

    function animate(to: number): void {
        if (reducedMotion.value) {
            current.value = to;
            return;
        }

        cancelAnimationFrame(frameId);

        const from = current.value;
        const start = performance.now();
        let frameCount = 0;

        function step(now: number): void {
            frameCount++;

            if (frameCount > MAX_FRAMES) {
                current.value = to;
                return;
            }

            const elapsed = now - start;
            const progress = Math.min(elapsed / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            current.value = Math.round(from + (to - from) * eased);

            if (progress < 1) {
                frameId = requestAnimationFrame(step);
            }
        }

        frameId = requestAnimationFrame(step);
    }

    watch(trigger, (isReady) => {
        if (isReady) animate(target.value);
    });

    watch(target, (to) => {
        if (trigger.value) animate(to);
    });

    onMounted(() => {
        if (trigger.value) animate(target.value);
    });

    onUnmounted(() => {
        cancelAnimationFrame(frameId);
    });

    return current;
}
