import { ref, readonly } from 'vue';
import portraitUrl from '@/assets/images/brayden_avatar.jpg';

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

    const portrait = new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = portraitUrl;
    });

    await Promise.all([minimum, fonts, portrait]);

    ready.value = true;
}

initialize();

export function useAppReady(): { ready: Readonly<typeof ready> } {
    return { ready: readonly(ready) };
}
