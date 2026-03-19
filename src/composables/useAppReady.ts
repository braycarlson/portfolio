import { ref, readonly } from 'vue';

const ready = ref(false);

const MINIMUM_DISPLAY_MS = 600;

let initialized = false;

async function initialize(): Promise<void> {
    if (initialized) return;
    initialized = true;

    const minimum = new Promise<void>((resolve) => {
        setTimeout(resolve, MINIMUM_DISPLAY_MS);
    });

    const fonts = document.fonts.ready;

    await Promise.all([minimum, fonts]);

    ready.value = true;
}

initialize();

export function useAppReady(): { ready: Readonly<typeof ready> } {
    return { ready: readonly(ready) };
}
