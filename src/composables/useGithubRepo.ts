import { computed, onMounted, ref, shallowRef } from 'vue';
import type { Repo } from '@/types/github';
import { readCache, writeCache } from '@/utils/repoCache';

interface GithubStats {
    forks: number;
    repos: number;
    stars: number;
}

const MAX_PAGES = 20;
const PER_PAGE = 100;

const repos = shallowRef<Repo[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const fetched = ref(false);

const stats = computed<GithubStats>(() => {
    const owned = repos.value.filter((repo) => !repo.fork);

    return {
        forks: owned.reduce((sum, repo) => sum + repo.forks_count, 0),
        repos: owned.length,
        stars: owned.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    };
});

function isRepoArray(value: unknown): value is Repo[] {
    if (!Array.isArray(value)) return false;
    if (value.length === 0) return true;

    const first = value[0];

    return (
        typeof first === 'object' &&
        first !== null &&
        typeof first.name === 'string' &&
        typeof first.html_url === 'string'
    );
}

async function fetchRepos(): Promise<void> {
    if (fetched.value) return;
    fetched.value = true;

    const cached = readCache();

    if (cached) {
        repos.value = cached;
        loading.value = false;
        return;
    }

    try {
        const all: Repo[] = [];

        for (let page = 1; page <= MAX_PAGES; page++) {
            const response = await fetch(
                `https://api.github.com/users/braycarlson/repos?per_page=${PER_PAGE}&page=${page}&sort=updated`
            );

            if (!response.ok) {
                throw new Error(`GitHub API returned ${response.status}`);
            }

            const data: unknown = await response.json();

            if (!isRepoArray(data)) {
                throw new Error('GitHub API returned an unexpected response shape');
            }

            if (data.length === 0) break;

            all.push(...data);

            if (data.length < PER_PAGE) break;
        }

        repos.value = all;
        error.value = null;
        writeCache(all);
    } catch (caught) {
        console.error('Failed to fetch repos:', caught);
        error.value = 'Failed to load repositories.';
    } finally {
        loading.value = false;
    }
}

export function useGithubRepo(): {
    error: typeof error;
    loading: typeof loading;
    repos: typeof repos;
    stats: typeof stats;
} {
    onMounted(fetchRepos);

    return { error, loading, repos, stats };
}
