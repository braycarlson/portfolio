import { onUnmounted } from 'vue';
import { assert } from '@/utils/assert';

const MAX_FRAMES = 10_000;

export function useSmoothScroll(durationMs = 1200): {
    scrollTo: (target: HTMLElement) => void;
} {
    assert(durationMs > 0, `useSmoothScroll requires a positive duration, received: ${durationMs}`);

    let frameId = 0;

    function scrollTo(target: HTMLElement): void {
        assert(target !== null, 'scrollTo received a null target');

        cancelAnimationFrame(frameId);

        const start = window.scrollY;
        const end = target.getBoundingClientRect().top + start;
        const distance = end - start;
        const begin = performance.now();
        let frameCount = 0;

        function step(now: number): void {
            frameCount++;

            if (frameCount > MAX_FRAMES) {
                window.scrollTo({ top: end, behavior: 'instant' });
                return;
            }

            const elapsed = now - begin;
            const progress = Math.min(elapsed / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 4);

            window.scrollTo({ top: start + distance * eased, behavior: 'instant' });

            if (progress < 1) {
                frameId = requestAnimationFrame(step);
            }
        }

        frameId = requestAnimationFrame(step);
    }

    onUnmounted(() => {
        cancelAnimationFrame(frameId);
    });

    return { scrollTo };
}
