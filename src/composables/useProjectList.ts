import { computed, ref, type ComputedRef, type Ref } from 'vue';
import type { Repo } from '@/types/github';
import { useGithubRepo } from '@/composables/useGithubRepo';
import { usePagination } from '@/composables/usePagination';
import { HIDDEN, PINNED, SORT_ORDER } from '@/data/project';

const PAGE_SIZE = 6;
const FEATURED_COUNT = 4;

function sortIndex(name: string): number {
    const index = SORT_ORDER.indexOf(name);
    return index >= 0 ? index : SORT_ORDER.length;
}

export function useProjectList(): {
    active: Ref<Repo | null>;
    activeIndex: ComputedRef<number>;
    all: ComputedRef<Repo[]>;
    currentPage: Ref<number>;
    error: Ref<string | null>;
    featured: ComputedRef<Repo[]>;
    loading: Ref<boolean>;
    navigate: (direction: number) => void;
    page: ComputedRef<Repo[]>;
    pageNumbers: ComputedRef<number[]>;
    totalPages: ComputedRef<number>;
} {
    const { error, loading, repos } = useGithubRepo();
    const active = ref<Repo | null>(null);

    const filtered = computed(() =>
        repos.value.filter((repo) => !repo.fork && !HIDDEN.includes(repo.name))
    );

    const featured = computed(() => {
        const pinned = PINNED
            .map((name) => filtered.value.find((repo) => repo.name === name))
            .filter(Boolean) as Repo[];

        if (pinned.length >= FEATURED_COUNT) return pinned;

        const remaining = filtered.value
            .filter((repo) => !PINNED.includes(repo.name))
            .sort((left, right) => right.stargazers_count - left.stargazers_count);

        return [...pinned, ...remaining].slice(0, FEATURED_COUNT);
    });

    const rest = computed(() =>
        filtered.value
            .filter((repo) => !featured.value.includes(repo))
            .sort((left, right) => {
                const leftIndex = sortIndex(left.name);
                const rightIndex = sortIndex(right.name);

                if (leftIndex !== rightIndex) return leftIndex - rightIndex;

                return new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime();
            })
    );

    const all = computed(() => [...featured.value, ...rest.value]);

    const activeIndex = computed(() => {
        if (!active.value) return -1;
        return all.value.findIndex((repo) => repo.name === active.value!.name);
    });

    function navigate(direction: number): void {
        const next = activeIndex.value + direction;
        const repo = all.value[next];

        if (next >= 0 && next < all.value.length && repo) {
            active.value = repo;
        }
    }

    const { currentPage, page, pageNumbers, totalPages } = usePagination(rest, PAGE_SIZE);

    return {
        active,
        activeIndex,
        all,
        currentPage,
        error,
        featured,
        loading,
        navigate,
        page,
        pageNumbers,
        totalPages,
    };
}
