import { ref, readonly } from 'vue';

const HIGHLIGHT_DURATION_MS = 2000;

const highlighted = ref<string | null>(null);
let timer: ReturnType<typeof setTimeout> | null = null;

function highlight(name: string): void {
    if (timer) clearTimeout(timer);

    highlighted.value = name;

    timer = setTimeout(() => {
        highlighted.value = null;
        timer = null;
    }, HIGHLIGHT_DURATION_MS);
}

function clear(): void {
    if (timer) clearTimeout(timer);
    highlighted.value = null;
    timer = null;
}

export function useProjectHighlight(): {
    clear: typeof clear;
    highlight: typeof highlight;
    highlighted: Readonly<typeof highlighted>;
} {
    return { clear, highlight, highlighted: readonly(highlighted) };
}
