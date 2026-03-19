export interface Skill {
    name: string;
    url?: string;
}

export interface SkillGroup {
    category: string;
    items: Skill[];
}

export const skills: SkillGroup[] = [
    {
        category: 'Languages',
        items: [
            { name: 'Python', url: 'https://www.python.org' },
            { name: 'Go', url: 'https://go.dev' },
            { name: 'Rust', url: 'https://www.rust-lang.org' },
            { name: 'C++', url: 'https://isocpp.org' },
        ],
    },
    {
        category: 'Databases',
        items: [
            { name: 'PostgreSQL', url: 'https://www.postgresql.org' },
            { name: 'MySQL', url: 'https://www.mysql.com' },
            { name: 'Redis', url: 'https://redis.io' },
        ],
    },
    {
        category: 'Infrastructure',
        items: [
            { name: 'Docker', url: 'https://www.docker.com' },
            { name: 'DigitalOcean', url: 'https://www.digitalocean.com' },
            { name: 'CI/CD', url: 'https://en.wikipedia.org/wiki/CI/CD' },
            { name: 'Grafana', url: 'https://grafana.com' },
            { name: 'Prometheus', url: 'https://prometheus.io' },
            { name: 'Loki', url: 'https://grafana.com/oss/loki' },
        ],
    },
    {
        category: 'Frontend',
        items: [
            { name: 'Vue.js', url: 'https://vuejs.org' },
            { name: 'Alpine.js', url: 'https://alpinejs.dev' },
            { name: 'Qt', url: 'https://www.qt.io' },
            { name: 'Fyne', url: 'https://fyne.io' },
            { name: 'Slint', url: 'https://slint.dev' },
            { name: 'egui', url: 'https://www.egui.rs' },
            { name: 'Sass', url: 'https://sass-lang.com' },
            { name: 'Tailwind', url: 'https://tailwindcss.com' },
            { name: 'Bootstrap', url: 'https://getbootstrap.com' },
        ],
    },
    {
        category: 'Platforms',
        items: [
            { name: 'Linux', url: 'https://www.linux.org' },
            { name: 'Windows', url: 'https://www.microsoft.com/windows' },
            { name: 'SSH', url: 'https://www.openssh.com' },
            { name: 'FTP', url: 'https://en.wikipedia.org/wiki/File_Transfer_Protocol' },
            { name: 'Virtualization', url: 'https://en.wikipedia.org/wiki/Virtualization' },
            { name: 'SBCs', url: 'https://en.wikipedia.org/wiki/Single-board_computer' },
        ],
    },
    {
        category: 'Tools',
        items: [
            { name: 'Git', url: 'https://git-scm.com' },
            { name: 'GitHub', url: 'https://github.com' },
            { name: 'GitLab', url: 'https://gitlab.com' },
            { name: 'Jira', url: 'https://www.atlassian.com/software/jira' },
            { name: 'Confluence', url: 'https://www.atlassian.com/software/confluence' },
        ],
    },
];
