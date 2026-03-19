import { computed, ref, type ComputedRef, type Ref } from 'vue';
import { assert } from '@/utils/assert';

export function usePagination<T>(
    source: ComputedRef<T[]> | Ref<T[]>,
    size: number,
): {
    currentPage: Ref<number>;
    page: ComputedRef<T[]>;
    pageNumbers: ComputedRef<number[]>;
    totalPages: ComputedRef<number>;
} {
    assert(size > 0, `usePagination requires a positive page size, received: ${size}`);

    const currentPage = ref(1);

    const totalPages = computed(() =>
        Math.ceil(source.value.length / size)
    );

    const page = computed(() => {
        const start = (currentPage.value - 1) * size;
        return source.value.slice(start, start + size);
    });

    const pageNumbers = computed(() => {
        const total = totalPages.value;
        const current = currentPage.value;

        if (total <= 7) {
            const pages: number[] = [];
            for (let index = 1; index <= total; index++) pages.push(index);
            return pages;
        }

        const pages: number[] = [1];

        if (current > 3) pages.push(-1);

        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);
        for (let index = start; index <= end; index++) pages.push(index);

        if (current < total - 2) pages.push(-2);
        pages.push(total);

        return pages;
    });

    return { currentPage, page, pageNumbers, totalPages };
}
