export interface ProjectMeta {
    story?: string;
}

export const PINNED = ['swarm', 'forgecast', 'nimble', 'mute'];

export const HIDDEN = ['braycarlson', 'dotfiles', 'braycarlson.github.io', 'avgn_paper'];

export const SORT_ORDER = [
    'swarm',
    'forgecast',
    'nimble',
    'mute',
    'alphares',
    'thesis',
    'warbler',
    'locker',
    'undertasker',
    'wisp',
    'zig_wca',
    'avs',
    'senna',
    'cachecontrol',
    'viking',
    'composer',
    'pioneer',
];

export const PROJECT_META: Record<string, ProjectMeta> = {
    swarm: {
        story: 'A developer tool for generating structured project context to share with an LLM. The tool lets you select files from the explorer and copy a clean output containing the path and content of each file, giving you control over what is shared rather than relying on an agent with broad access to your environment.',
    },
    forgecast: {
        story: 'An app for browsing trending repositories across different programming languages. The GitHub mobile app had slow search and it was impossible to prioritize specific languages. The project also served as an opportunity to work with Elixir.',
    },
    nimble: {
        story: 'A lightweight input handling library for Windows. The same low-level input logic was needed across multiple projects, including a peripheral locker and a system-wide mute tool, so it was extracted into a reusable library. A window tiling manager is planned as a future addition.',
    },
    mute: {
        story: 'A tool to lock default playback and recording devices on Windows. A PS5 controller registers as a media device and overrides the default headset and microphone when connected. The tool locks the preferred devices in place and instantly reverts any unwanted change. It also provides a global mute and deafen across the entire operating system, removing the need for per-application hotkeys.',
    },
    alphares: {
        story: 'A tool to save and persist a custom resolution in Fortnite. The stretched resolution was a popular competitive technique, but every game update would reset the settings. The only workaround was navigating to %APPDATA%, editing a configuration file and setting it to read-only. The tool simplifies that process.',
    },
    warbler: {
        story: 'A pipeline for segmenting, clustering and visualizing Adelaide\'s warbler songs. The recordings are segmented into individual notes using avs, converted from audio to spectrograms, and then run through dimensionality reduction and clustering to identify patterns across the recordings.',
    },
    locker: {
        story: 'A peripheral locker that disables the mouse and keyboard on demand, allowing you to clean your desk and devices without unintended input.',
    },
    undertasker: {
        story: 'A configurable startup launcher for Windows. The built-in startup application management is all or nothing, offering no control over which applications run or when. The tool replaces that with a system that lets you decide what to launch and under what conditions.',
    },
    wisp: {
        story: 'A system tray application framework for Windows in Zig. The same boilerplate was being repeated across multiple system tray tools and widgets, so it was consolidated into a reusable framework.',
    },
    swarm_extension: {
        story: 'An extension to integrate swarm into PyCharm and Sublime Text. The extension was created after coworkers expressed interest in using swarm but worked exclusively in those editors.',
    },
    zig_wca: {
        story: 'A library that wraps the Windows Core Audio API in idiomatic Zig. The raw API requires working with COM interfaces, verbose boilerplate and documentation that assumes prior COM knowledge. The library provides device enumeration, volume control and audio session management without that overhead.',
    },
    senna: {
        story: 'A tool to automate League of Legends through the client\'s websocket API. The tool connects to the LCU, listens for game events and automates lobby actions such as selecting runes, items and builds for players who are new to the game.',
    },
    cachecontrol: {
        story: 'A browser extension that provides granular control over the caching of resources on a per-site basis. The extension was built to address aggressive caching behavior that makes development and testing difficult.',
    },
    viking: {
        story: 'A Discord bot that served as an introduction to Python. The project made learning fun and interactive, and remains one of the approaches recommended to new developers for learning to program.',
    },
    composer: {
        story: 'A minimal music player built in C++ for CPSC 3770: Human-Computer Interaction. The project provided a foundation in audio programming.',
    },
    pioneer: {
        story: 'A graphics editor for applying filters, adjusting curves and manipulating images interactively. The tool was used to explore image processing techniques when working on CPSC 4995: Deep Learning and Digit Recognition.',
    },
    avs: {
        story: 'A tool for segmenting animal vocalizations from field recordings. The GUI allows researchers to configure segmentation parameters visually and iterate quickly without writing code.',
    },
    thesis: {
        story: 'An undergraduate thesis on deep learning approaches to object detection of occluded objects. The project was the capstone of the degree and required managing a long-term research effort from literature review through implementation to defense.',
    },
    aoc: {
        story: 'A collection of Advent of Code solutions. The event is an opportunity to experiment with approaches that would not be used in production and to remember that programming is supposed to be fun.',
    },
    dasc: {
        story: 'A collection of introductory projects from DASC 4850: Introduction to Data Science and Analytics in Python I and II. The projects cover the fundamentals, including linear and logistic regression, classification and natural language processing.',
    },
    dimensionality: {
        story: 'An exploration into dimensionality reduction using PCA, ICA, t-SNE and UMAP for NEUR 4700: Advanced Applications of Computational Methods. The project also included a presentation on PCA using the Manim package created by 3Blue1Brown.',
    },
    bockbluster: {
        story: 'A fictional video game rental service built for CPSC 3660: Introduction to Databases using HTML, CSS, jQuery, PHP and MySQL. The application includes authentication, form validation, CRUD operations for several entities, live searching and more.',
    },
    hrtf: {
        story: 'A demonstration of the Head-related Transfer Function and audio convolution. A point is selected from a scatter plot, matched to the closest impulse response by azimuth and elevation, and used to convolve audio to simulate directional sound.',
    },
    memory: {
        story: 'A memory match game created in MATLAB for NEUR 3690: Programming and Statistics. The game supports text or image matching depending on the difficulty, and includes cheat codes to advance the level or stage.',
    },
    aionhl: {
        story: 'An asynchronous wrapper around the unofficial NHL API. The project is functional but incomplete, with plans to improve it at a later date.',
    },
    asol: {
        story: 'A library to interact with the League of Legends LCU API.',
    },
    dbgen: {
        story: 'A toolkit for creating .fasta files for assigning taxonomy with dada2. The project was built to assist with an independent study.',
    },
    pathofduplicates: {
        story: 'A tool to check for duplicate items across stash tabs in Path of Exile. The tool supports the Standard, Hardcore, and the active leagues.',
    },
    forknife: {
        story: 'The predecessor to alphares. A first attempt at modifying Fortnite\'s settings programmatically, written in C. The concept was later rebuilt as the more polished C++ version.',
    },
    console: {
        story: 'A command-line interface tool for managing undertasker. The tool allows you to add files or executables to undertasker from the terminal.',
    },
};
