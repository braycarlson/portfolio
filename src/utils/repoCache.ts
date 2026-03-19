import type { Repo } from '@/types/github';

const CACHE_KEY = 'github_repos';
const CACHE_TTL_MS = 1000 * 60 * 15;

interface CacheEntry {
    data: Repo[];
    timestamp: number;
}

function isAvailable(): boolean {
    try {
        const key = '__storage_test__';
        localStorage.setItem(key, key);
        localStorage.removeItem(key);
        return true;
    } catch {
        return false;
    }
}

function isValidEntry(value: unknown): value is CacheEntry {
    if (typeof value !== 'object' || value === null) return false;

    const candidate = value as Record<string, unknown>;

    if (typeof candidate.timestamp !== 'number') return false;
    if (!Array.isArray(candidate.data)) return false;

    return true;
}

const available = isAvailable();

export function readCache(): Repo[] | null {
    if (!available) return null;

    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;

        const parsed: unknown = JSON.parse(raw);
        if (!isValidEntry(parsed)) return null;
        if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;

        return parsed.data;
    } catch {
        return null;
    }
}

export function writeCache(data: Repo[]): void {
    if (!available) return;

    try {
        const entry: CacheEntry = { data, timestamp: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    } catch {
        // Storage full or unavailable
    }
}
