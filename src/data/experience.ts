export interface ExperienceEntry {
    date: string;
    title: string;
    org: string;
    points: string[];
}

export const experience: ExperienceEntry[] = [
    {
        date: 'Oct 2025 – Present',
        title: 'Technical Lead',
        org: 'Stratus Advanced Technologies, Lethbridge, AB',
        points: [
            'Lead the development department in partnership with fellow Technical Lead, establishing engineering practices and directing technology decisions that drive company growth.',
            'Direct ETL pipeline development and architecture for BC Government\'s Archaeology branch modernization, migrating legacy infrastructure to a modern Django/Arches, Vue.js, PostgreSQL, and ElasticSearch stack.',
            'Mentor development team through technical guidance, code reviews, and collaborative problem-solving, building team capabilities and promoting best practices.',
            'Design and implement internal tools and automated pipelines that accelerate development cycles and standardize workflows across projects.',
        ],
    },
    {
        date: 'Jun 2024 – Oct 2025',
        title: 'Intermediate Software Developer',
        org: 'Stratus Advanced Technologies, Lethbridge, AB',
        points: [
            'Developed internal tooling and standardized development practices, generating an estimated $50,000 in annual savings through reduced development time and eliminated redundant processes.',
            'Consolidated and migrated data from four separate MySQL databases into a unified SAP database using Python and pandas, preserving data integrity while maintaining business continuity.',
            'Designed and implemented a custom CMMS with a three-person team, replacing legacy third-party software while collaborating with stakeholders to define requirements.',
            'Built web and mobile applications using Python, Django, Alpine.js, PostgreSQL, and Bootstrap, integrating AI capabilities including LLM-powered features and speech-to-text functionality.',
        ],
    },
    {
        date: 'May 2023 – May 2024',
        title: 'Research Assistant, Tata Lab',
        org: 'University of Lethbridge, Lethbridge, AB',
        points: [
            'Conducted research on source separation in complex acoustic environments, developing algorithms to isolate individual audio sources from overlapping signals.',
            'Developed neural network models for speech-to-text and phoneme classification on isolated audio signals, determining optimal architectures and training configurations.',
            'Built research framework and data pipeline for investigating the relationship between pupillometry and autonomic nervous system responses.',
            'Collaborated with cross-functional research team spanning computer science, neuroscience, and psychology disciplines.',
        ],
    },
    {
        date: 'Jan 2022 – Jun 2023',
        title: 'Acoustic Analysis in Python, The Birdsong Lab',
        org: 'University of Lethbridge, Lethbridge, AB',
        points: [
            'Designed and built a GUI for a dynamic thresholding segmentation algorithm to include or exclude animal vocalizations based on configurable parameters.',
            'Implemented a pipeline to analyze, filter, and segment 1,100 Adelaide\'s warbler songs into individual notes.',
            'Created interactive 2D and 3D visualizations using UMAP dimensionality reduction, clustering notes with HDBSCAN and Fuzzy C-Means algorithms.',
            'Collaborated in regular research meetings, presenting data and visualizations, incorporating feedback, and planning against weekly deadlines.',
        ],
    },
];
