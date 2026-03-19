const LANG_COLORS: Record<string, string> = {
    'C': '#555555',
    'C++': '#f34b7d',
    'Elixir': '#6e4a7e',
    'Go': '#00add8',
    'JavaScript': '#f1e05a',
    'Jupyter Notebook': '#da5b0b',
    'Kotlin': '#a97bff',
    'Lua': '#000080',
    'MATLAB': '#e16737',
    'PHP': '#4f5d95',
    'Python': '#3572a5',
    'Rust': '#dea584',
    'TypeScript': '#3178c6',
    'Zig': '#ec915c',
};

const FALLBACK_COLOR = 'oklch(0.97 0 0 / 0.3)';
const UNKNOWN_COLOR = 'oklch(0.97 0 0 / 0.4)';

export function langColor(language: string | null): string {
    if (!language) return FALLBACK_COLOR;
    return LANG_COLORS[language] || UNKNOWN_COLOR;
}
