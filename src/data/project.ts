export interface ProjectMeta {
    story?: string;
}

export const PINNED = ['nimble', 'mute', 'tigerstyle-lsp', 'resolve'];

export const HIDDEN = ['braycarlson', 'dotfiles', 'avgn_paper'];

export const SORT_ORDER = [
    'nimble',
    'mute',
    'tigerstyle-lsp',
    'resolve',
    'swarm',
    'forgecast',
    'alphares',
    'kaleidoscope',
    'celeste',
    'scylla',
    'docmux',
    'abyss',
    'rift',
    'umbra',
    'locker',
    'phantom',
    'prototype',
    'kalymma',
    'mantra',
    'arc',
    'bounded-zig',
    'json-zig',
    'toml-zig',
    'yaml-zig',
    'dotenv-zig',
    'alias-zig',
    'docker-zig',
    'lacuna',
    'wca-zig',
    'vda-zig',
    'gfdi',
    'fit-zig',
    'garmin-zig',
    'undertasker',
    'senna',
    'asol',
    'slapshot',
    'swarm_extension',
    'resolve-lint-action',
    'warbler',
    'avs',
    'thesis',
    'cachecontrol',
    'portfolio',
    'dimensionality',
    'dasc',
    'hrtf',
    'viking',
    'composer',
    'pioneer',
    'bockbluster',
    'memory',
    'aoc',
    'pathofduplicates',
    'dbgen',
    'forknife',
    'console',
];

export const PROJECT_META: Record<string, ProjectMeta> = {
    swarm: {
        story: 'A developer tool for generating structured project context to share with an LLM. The tool lets you select files from the explorer and copy a clean output containing the path and content of each file, giving you control over what is shared rather than relying on an agent with broad access to your environment.',
    },
    forgecast: {
        story: 'An app for tracking trending repositories across GitHub, GitLab and Codeberg. The GitHub mobile app had slow search and it was impossible to prioritize specific languages. It combines live event streams with search-based polling, computing star and fork velocity on a rolling window to surface repositories that are gaining traction rather than those that are already popular. The project also served as an opportunity to work with Elixir.',
    },
    nimble: {
        story: 'An input automation toolkit for Windows and Linux, covering keyboard and mouse hooks, bindings, remapping and input synthesis from a single source tree. The same low-level input logic was needed across multiple projects, including a peripheral locker and a system-wide mute tool, so it was extracted into a reusable library. A window tiling manager is planned as a future addition.',
    },
    mute: {
        story: 'A tool to lock default playback and recording devices on Windows and Linux. A PS5 controller registers as a media device and overrides the default headset and microphone when connected. The tool locks the preferred devices in place and instantly reverts any unwanted change. It also provides a global mute and deafen across the entire operating system, removing the need for per-application hotkeys.',
    },
    alphares: {
        story: 'A tool to save and persist a custom resolution in Fortnite. The stretched resolution was a popular competitive technique, but every game update would reset the settings. The only workaround was navigating to %APPDATA%, editing a configuration file and setting it to read-only. The tool simplifies that process.',
    },
    warbler: {
        story: 'A pipeline for segmenting, clustering and visualizing Adelaide\'s warbler songs. The recordings are segmented into individual notes using avs, converted from audio to spectrograms, and then run through dimensionality reduction and clustering to identify patterns across the recordings.',
    },
    locker: {
        story: 'A peripheral locker for Windows and Linux that disables the mouse and keyboard on demand, allowing you to clean your desk and devices without unintended input.',
    },
    undertasker: {
        story: 'A configurable startup launcher for Windows. The built-in startup application management is all or nothing, offering no control over which applications run or when. The tool replaces that with a system that lets you decide what to launch and under what conditions.',
    },
    umbra: {
        story: 'A system tray application framework for Windows and Linux in Zig. The same boilerplate was being repeated across multiple system tray tools and widgets, so it was consolidated into a reusable framework. Windows is backed by Win32 and the Shell notification API, and Linux by D-Bus and the StatusNotifierItem specification.',
    },
    swarm_extension: {
        story: 'An extension to integrate swarm into PyCharm and Sublime Text. The extension was created after coworkers expressed interest in using swarm but worked exclusively in those editors.',
    },
    'wca-zig': {
        story: 'A library that wraps the Windows Core Audio API in idiomatic Zig. The raw API requires working with COM interfaces, verbose boilerplate and documentation that assumes prior COM knowledge. The library provides device enumeration, volume control and audio session management without that overhead.',
    },
    'vda-zig': {
        story: 'Zig bindings for the Windows virtual desktop COM interfaces. Windows exposes virtual desktops only through undocumented interfaces that shift between builds, so the bindings cover enumeration, switching, naming, wallpapers and moving or pinning windows, and reconnect automatically when the COM service drops. It is the same exercise as wca-zig, applied to a less stable corner of the API.',
    },
    arc: {
        story: 'A library for structured, leveled logging in Zig, ported from uber-go/zap. The same logging setup was being rewritten in every tray application, so it was consolidated into a shared library. It is now used across locker, mute and phantom.',
    },
    mantra: {
        story: 'A library for audio endpoint control on Windows and Linux. It enumerates capture and render devices, reads and writes their mute state and volume, moves the default device and reports device changes as they happen. wca-zig had already covered the Windows Core Audio API, so the interface was generalized over a second backend to give mute the same behavior on Linux.',
    },
    kalymma: {
        story: 'A screen overlay library for Windows and Linux. It gives an application a fixed-size ARGB pixel surface anchored to a screen edge, along with pointer and keyboard input, leaving the caller to own the pixels while the library owns the window. It was written for mute, which needed an on-screen indicator without pulling in a full GUI toolkit.',
    },
    phantom: {
        story: 'A tray application that nudges the mouse pointer on a timer, so a machine never reads as idle. Idle timers and presence indicators treat a lack of input as absence, even while a long build or transfer is still running. The tool is a thin layer over nimble for input synthesis and umbra for the tray.',
    },
    prototype: {
        story: 'A Windows desktop interface for inspecting and arranging top-level windows and virtual workspaces. The interface is dvui on its DirectX 11 backend, the window management is direct Win32 and the input is handled by nimble. It is an early step toward the window tiling manager that nimble was built to support.',
    },
    gfdi: {
        story: 'A tool to pull FIT files from a Garmin watch over Bluetooth LE. Getting an activity off the watch normally means syncing it to Garmin Connect and downloading it back, so the tool speaks Garmin\'s GFDI protocol directly and copies the files with no Garmin software involved. The decoding is handled by fit-zig.',
    },
    'fit-zig': {
        story: 'A decoder and encoder for the FIT file format used by Garmin and other fitness devices. The format is a binary layout driven by a message profile, and most existing tooling is either tied to a vendor SDK or read-only, so a library that could round-trip a file was written instead. It provides the decoding for gfdi.',
    },
    'bounded-zig': {
        story: 'A library of fixed-capacity containers for Zig: an array, a buffer and a map, each sized at compile time and returning an error rather than growing when full. The map is based on the vectorized hash tables of Böther et al. (2023), and every container has its own fuzzer. It is the base of the Zig library family, with json-zig, toml-zig, yaml-zig, dotenv-zig, alias-zig, docker-zig and arc all built on it.',
    },
    'json-zig': {
        story: 'A JSON decoder and writer for Zig. A document parses into an immutable tape with explicit limits on depth, input size and node count, and a separate editable tree covers the cases that need mutation, alongside JSON Pointer, JSON Patch, Merge Patch, a streaming reader for JSON Lines and an opt-in relaxed syntax. It is tested against JSONTestSuite, json-patch-tests and the yyjson suite, and it backs docker-zig, scylla, arc, fit-zig, garmin-zig and tigerstyle-lsp.',
    },
    'toml-zig': {
        story: 'A TOML parser and writer for Zig, tested against toml-test. Edits preserve comments, whitespace, ordering and spelling byte for byte, on par with toml_edit and tomlkit, by patching spans of the source rather than keeping a concrete syntax tree. It is used by tigerstyle-lsp, mute and locker.',
    },
    'yaml-zig': {
        story: 'A YAML parser and writer for Zig, tested against yaml-test-suite down to the parse events and the point at which invalid input is rejected. It supports the core, JSON and 1.1 schemas, merge keys in PyYAML\'s override order, comment-preserving round trips and JSON output with bounded alias expansion. It parses the Docker OpenAPI specification that docker-zig is generated from.',
    },
    'dotenv-zig': {
        story: 'A .env file reader for Zig. The format has no specification, so python-dotenv is treated as the reference and the reader is checked against a conformance file generated from it. It exposes both a pull scanner and a decoded document, and garmin-zig uses it.',
    },
    'alias-zig': {
        story: 'A weighted sampler for Zig, based on the alias method of Vose (1991). A table is built once from a set of weights and then draws each sample in constant time, with its capacity fixed at compile time on top of bounded-zig.',
    },
    'docker-zig': {
        story: 'A Docker Engine API client for Zig. The models and operations are generated from Docker\'s OpenAPI specification, parsed with yaml-zig, rather than written by hand, the same approach rift takes with the Riot Games API. It connects over TCP, Unix sockets or named pipes, handles the framed, hijacked and raw byte streams the API returns, and has an integration suite that runs against a live daemon. celeste runs it under fault injection as one of its guest projects.',
    },
    lacuna: {
        story: 'A library for writing CPython extension modules in Zig. It targets the limited API, so one abi3 wheel covers every Python version from the minimum it was built for, and anything outside the limited API is a compile error. It ships a PEP 517 build backend that builds the wheel and generates .pyi stubs, and its extern declarations are checked against the interpreter\'s Python.h.',
    },
    'garmin-zig': {
        story: 'A client for the Garmin Connect API. Garmin does not offer a public API for personal data, so the client authenticates against Garmin\'s web SSO and pulls activity and health data the same way the site does. It covers the cloud side of the same data that gfdi reads directly off the watch.',
    },
    resolve: {
        story: 'A Django template compiler written in Rust. It resolves inheritance and includes ahead of time, flattening a tree of {% extends %} and {% include %} tags into a single HTML file so the engine does not have to walk it on every render. It also lints for broken or missing template paths, which is published separately as a GitHub action.',
    },
    kaleidoscope: {
        story: 'A debugging toolbar for Django with a Vue frontend. It adds panels for requests, queries, templates, signals, cache, static files, settings and timing, along with profiling panels backed by pyinstrument, line-profiler and pympler for call stacks, per-line timing and memory.',
    },
    'resolve-lint-action': {
        story: 'A GitHub action that runs resolve\'s template linter in CI. It syncs the Django project\'s dependencies with uv so templates from third-party apps resolve, pulls the lint binary from resolve\'s releases and reports broken or missing {% extends %} and {% include %} paths, which otherwise only surface when a view is rendered. The version and the resolve.toml configuration are both inputs.',
    },
    'tigerstyle-lsp': {
        story: 'A linter for TigerBeetle\'s TigerStyle and NASA\'s Power of Ten, covering Python, Rust, Go and Zig. Thirty rules run over a tree-sitter parse and ship as both a command-line tool and a language server, so the same checks apply in an editor and in CI. Several rules are heuristics with no type or scope resolution behind them, so they are best read as suggestions.',
    },
    celeste: {
        story: 'A hypervisor for deterministic simulation testing, built on KVM. It emulates the timers, interrupt controllers, serial console and virtio block device itself, so a run driven by the same seed can be replayed and forked from a snapshot. Guests follow a small language-agnostic contract over x86 I/O ports and the serial console, with SDKs for C, Go, Python, Rust and Zig, and the hypervisor injects power loss and other faults before checking what survived. docker-zig and tigerstyle-lsp both run under it as guest projects.',
    },
    scylla: {
        story: 'A statically allocated parser and formatter for Zig, Rust, Go, Odin, Python, JavaScript, TypeScript and CSS. A semantic resolver runs over the parse, following CPython\'s symtable for Python scopes, and the formatter matches its reference on every TypeScript, TSX, CSS and Zig file in its corpus. It is the engine underneath tigerstyle-lsp, and also carries the language server, file walking and diagnostics the linter is built from.',
    },
    docmux: {
        story: 'A converter between Markdown, DOCX and the Atlassian Document Format that Confluence and Jira store, written in Rust. Each format is read into one fixed arena of nodes and written back out of it, and the crate is no_std without alloc, so an allocation is a compile error and every capacity is a named limit that returns an error rather than growing. The Markdown reader passes every CommonMark and GFM spec example, and Confluence-specific nodes such as panels, mentions and media degrade to the nearest thing the tree can hold.',
    },
    senna: {
        story: 'A tool to automate League of Legends through the client\'s websocket API. The tool connects to the LCU, listens for game events and automates lobby actions such as selecting runes, items and builds for players who are new to the game.',
    },
    rift: {
        story: 'An asynchronous client for the Riot Games API. The API is large, routed per region and rate limited per key, so the endpoints, models and routes are generated from Riot\'s published specification rather than written by hand, with a manual directory covering what the specification leaves out. Caching, pagination, rate limiting and Riot Sign On are handled by the client, alongside a separate Data Dragon client for static game data.',
    },
    abyss: {
        story: 'A collection and analytics service for League of Legends data. It seeds from a set of players, crawls their matches and timelines through rift, stores them in PostgreSQL and rolls them up into statistics served over an HTTP API. rift provides the API surface and abyss is what consumes it.',
    },
    cachecontrol: {
        story: 'A Firefox extension that provides granular control over the caching of resources on a per-site basis. The extension was built to address aggressive caching behavior that makes development and testing difficult.',
    },
    viking: {
        story: 'A Discord bot that served as an introduction to Python. The project made learning fun and interactive, and remains one of the approaches recommended to new developers for learning to program.',
    },
    composer: {
        story: 'A music player built in C++ and Qt for CPSC 3770: Human-Computer Interaction. The project provided a foundation in audio programming.',
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
    slapshot: {
        story: 'A synchronous and asynchronous client for the unofficial NHL API. The NHL spreads a large, undocumented surface across several hosts, each with its own path conventions, query parameters and payload shapes, so the client wraps the four public services behind one typed interface. Stable payloads decode into msgspec structs and unknown fields are ignored, so a new field on the NHL side does not break existing code. It began as aionhl, which was asynchronous only.',
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
    portfolio: {
        story: 'A personal site for listing projects, experience and publications. It is a Vue single-page application that pulls the repository list from the GitHub API at runtime, so the projects and their stars stay current without a rebuild.',
    },
    console: {
        story: 'A command-line interface tool for managing undertasker. The tool allows you to add files or executables to undertasker from the terminal.',
    },
};
