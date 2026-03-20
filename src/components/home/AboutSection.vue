<template>
    <section
        id="about"
        ref="element"
        class="section-shell"
        :class="{ visible }"
    >
        <div class="section-shell-inner section-shell-inner--wide section-reveal-inner">
            <div class="about-panel">
                <h2 class="section-lead about-heading">
                    I transform your worst workflow<br class="heading-break" />
                    into your favorite tool.
                </h2>
                <div class="about-body">
                    <p class="body-text">
                        I was born in Saskatoon and raised across the
                        Canadian prairies — Swift Current, Lacombe,
                        Edmonton, Lethbridge, and now Calgary. I spent
                        most of my early years in the small city of Lacombe,
                        doing manual labour. And when the pandemic put
                        everything on pause, I took it as a chance to start
                        over and pursue a career that I've always dreamed of.
                    </p>
                    <p class="body-text">
                        I studied computer science at the University of
                        Lethbridge and graduated with great distinction.
                        The pull toward programming was immediate.
                        My classmates counted the hours until they could get
                        home to play video games. I played them too — and spent
                        the whole time wishing I were back at my desk writing
                        code. I would rather be creating than doing
                        just about anything else.
                    </p>
                    <p class="body-text">
                        These days, that passion is less about writing code and
                        more about making technical processes accessible to people
                        who shouldn't have to care how they work. That's what
                        drives everything I build. If I do something twice, I
                        automate it. If it's too technical, I make it approachable.
                        If it's too complex, I simplify it.
                    </p>
                    <p class="body-text">
                        And when I'm away from the keyboard, my girlfriend
                        and I are watching The Pitt or out on a hike. At
                        home, our two cats,
                        <CatName
                            name="Mamas"
                            color="oklch(0.55 0.04 40)"
                            gradient="linear-gradient(90deg, oklch(0.44 0.015 270), oklch(0.48 0.01 350) 45%, oklch(0.68 0.08 60) 55%, oklch(0.72 0.09 70))"
                            :src="mamas"
                        />
                        and
                        <CatName
                            name="Ellie"
                            color="oklch(0.63 0.13 55)"
                            gradient="linear-gradient(135deg, oklch(0.78 0.06 70), oklch(0.63 0.14 55), oklch(0.55 0.12 50), oklch(0.67 0.15 55), oklch(0.80 0.05 70))"
                            :src="ellie"
                        />,
                        make sure the house is never too quiet.
                    </p>
                </div>
                <div class="about-sidebar">
                    <div class="about-sidebar-items">
                        <div class="about-sidebar-row">
                            <span class="about-sidebar-key">Exploring</span>
                            <span class="about-sidebar-val">
                                <a
                                    href="https://elixir-lang.org/"
                                    target="_blank"
                                    rel="noopener"
                                    class="about-sidebar-link"
                                >Elixir</a>,
                                <a
                                    href="https://ziglang.org"
                                    target="_blank"
                                    rel="noopener"
                                    class="about-sidebar-link"
                                >Zig</a>,
                                <a
                                    href="https://www.rust-lang.org"
                                    target="_blank"
                                    rel="noopener"
                                    class="about-sidebar-link"
                                >Rust</a>
                            </span>
                        </div>
                        <div class="about-sidebar-row">
                            <span class="about-sidebar-key">Building</span>
                            <span class="about-sidebar-val">
                                <button class="about-sidebar-link about-sidebar-btn" @click="$emit('navigateProject', 'swarm')">swarm</button>,
                                <button class="about-sidebar-link about-sidebar-btn" @click="$emit('navigateProject', 'forgecast')">Forgecast</button>
                            </span>
                        </div>
                        <div class="about-sidebar-row">
                            <span class="about-sidebar-key">Inspiration</span>
                            <span class="about-sidebar-val">
                                <a
                                    href="https://www.tigerbeetle.com/"
                                    target="_blank"
                                    rel="noopener"
                                    class="about-sidebar-link"
                                >TigerBeetle</a>,
                                <a
                                    href="https://tigerstyle.dev/"
                                    target="_blank"
                                    rel="noopener"
                                    class="about-sidebar-link"
                                >TigerStyle</a>,
                                <a
                                    href="https://www.nasa.gov/"
                                    target="_blank"
                                    rel="noopener"
                                    class="about-sidebar-link"
                                >NASA</a>
                            </span>
                        </div>
                        <div class="about-sidebar-row">
                            <span class="about-sidebar-key">Reading</span>
                            <span class="about-sidebar-val">
                                <a
                                    href="https://www.amazon.ca/What-Got-Here-Wont-There/dp/1781251568"
                                    target="_blank"
                                    rel="noopener"
                                    class="about-sidebar-link"
                                >What Got You Here Won't Get You There</a>
                            </span>
                        </div>
                        <div class="about-sidebar-row">
                            <span class="about-sidebar-key">Watching</span>
                            <span class="about-sidebar-val">
                                <a
                                    href="https://www.imdb.com/title/tt31938062/"
                                    target="_blank"
                                    rel="noopener"
                                    class="about-sidebar-link"
                                >The Pitt</a>
                            </span>
                        </div>
                        <div v-if="track" class="about-sidebar-row">
                            <span class="about-sidebar-key">
                                {{ track.playing ? 'Listening' : 'Last Played' }}
                            </span>
                            <component
                                :is="track.url ? 'a' : 'span'"
                                v-bind="track.url ? { href: track.url, target: '_blank', rel: 'noopener' } : {}"
                                class="about-sidebar-track"
                                :class="{ 'about-sidebar-track--linked': track.url }"
                            >
                                <img
                                    v-if="track.art"
                                    :src="track.art"
                                    :alt="track.album"
                                    class="about-sidebar-art"
                                />
                                <span class="about-sidebar-track-info">
                                    <span class="about-sidebar-track-name">{{ track.track }}</span>
                                    <span class="about-sidebar-track-artist">{{ track.artist }}</span>
                                </span>
                            </component>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import CatName from '@/components/shared/CatName.vue';
import mamas from '@/assets/images/mamas.jpg';
import ellie from '@/assets/images/ellie.jpg';
import { useScrollReveal } from '@/composables/useScrollReveal';
import { useSpotify } from '@/composables/useSpotify';

defineEmits<{
    navigateProject: [name: string];
}>();

const { element, visible } = useScrollReveal();
const { track } = useSpotify();
</script>

<style scoped>
.about-panel {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 0 80px;
}

.about-heading {
    grid-column: 1 / -1;
    margin-bottom: 72px;
}

.about-body {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.about-sidebar {
    display: flex;
    flex-direction: column;
}

.about-sidebar-items {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.about-sidebar-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.about-sidebar-key {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-tertiary);
}

.about-sidebar-val {
    font-size: 15px;
    font-weight: 500;
    color: #f5f5f7;
}

.about-sidebar-link {
    color: #f5f5f7;
    text-decoration: none;
    cursor: pointer;
    background-image: linear-gradient(#f5f5f7, #f5f5f7);
    background-size: 0% 1px;
    background-position: 0 100%;
    background-repeat: no-repeat;
    transition: background-size 0.5s ease;
}

.about-sidebar-link:hover {
    background-size: 100% 1px;
}

.about-sidebar-btn {
    border: none;
    background-color: transparent;
    padding: 0;
    font: inherit;
    font-size: 15px;
    font-weight: 500;
}

.about-sidebar-track {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
    text-decoration: none;
}

.about-sidebar-art {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
    border: 1px solid rgba(245, 245, 247, 0.06);
}

.about-sidebar-track-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
}

.about-sidebar-track-name {
    font-size: 15px;
    font-weight: 500;
    color: #f5f5f7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: flex-start;
    background-image: linear-gradient(#f5f5f7, #f5f5f7);
    background-size: 0% 1px;
    background-position: 0 100%;
    background-repeat: no-repeat;
    transition: background-size 0.5s ease;
}

.about-sidebar-track:hover .about-sidebar-track-name {
    background-size: 100% 1px;
}

.about-sidebar-track-artist {
    font-size: 13px;
    font-weight: 400;
    color: var(--text-tertiary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

@media (max-width: 900px) {
    .about-panel {
        grid-template-columns: 1fr;
    }

    .about-heading {
        grid-column: 1;
    }

    .about-sidebar {
        padding-top: 2rem;
        margin-top: 0.5rem;
    }
}
</style>
