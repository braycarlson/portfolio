export interface Repo {
    created_at: string;
    description: string | null;
    fork: boolean;
    forks_count: number;
    html_url: string;
    language: string | null;
    license: { spdx_id: string } | null;
    name: string;
    open_issues_count: number;
    size: number;
    stargazers_count: number;
    updated_at: string;
}
