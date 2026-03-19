import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';

export interface NowPlaying {
    album: string;
    art: string;
    artist: string;
    playing: boolean;
    track: string;
    url: string;
}

const ENDPOINT = import.meta.env.VITE_SPOTIFY_API_URL ?? '/api/spotify/now-playing';
const POLL_INTERVAL_MS = 30_000;

const data = shallowRef<NowPlaying | null>(null);
const loading = ref(true);
const subscribers = ref(0);

let timer: ReturnType<typeof setInterval> | null = null;

function isNowPlaying(value: unknown): value is NowPlaying {
    if (typeof value !== 'object' || value === null) return false;

    const candidate = value as Record<string, unknown>;

    return (
        typeof candidate.track === 'string' &&
        typeof candidate.artist === 'string' &&
        typeof candidate.album === 'string'
    );
}

async function poll(): Promise<void> {
    try {
        const response = await fetch(ENDPOINT);

        if (!response.ok) return;

        const result: unknown = await response.json();

        if (!isNowPlaying(result)) return;

        data.value = result.track ? result : null;
    } catch {
        data.value = null;
    } finally {
        loading.value = false;
    }
}

watch(subscribers, (count) => {
    if (count > 0 && !timer) {
        poll();
        timer = setInterval(poll, POLL_INTERVAL_MS);
    } else if (count <= 0 && timer) {
        clearInterval(timer);
        timer = null;
    }
});

export function useSpotify(): {
    loading: typeof loading;
    track: typeof data;
} {
    onMounted(() => {
        subscribers.value++;
    });

    onUnmounted(() => {
        subscribers.value = Math.max(0, subscribers.value - 1);
    });

    return { loading, track: data };
}
