import { assert } from '@/utils/assert';

export function formatDate(iso: string): string {
    assert(iso.length > 0, 'formatDate received an empty string');

    const date = new Date(iso);
    assert(!isNaN(date.getTime()), `formatDate received an invalid ISO string: ${iso}`);

    return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });
}

export function formatSize(kilobytes: number): string {
    assert(kilobytes >= 0, `formatSize received a negative value: ${kilobytes}`);

    if (kilobytes < 1024) return kilobytes + ' KB';
    return (kilobytes / 1024).toFixed(1) + ' MB';
}
