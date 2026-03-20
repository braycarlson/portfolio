<template>
    <section
        class="hero"
        :class="{ visible, settled }"
    >
        <div class="hero-shell">
            <div class="hero-reveal">
                <div class="hero-card">
                    <div class="hero-avatar" @click="avatarOpen = !avatarOpen">
                        <img :src="portrait" alt="" />
                    </div>

                    <BaseModal :open="avatarOpen" transition="avatar-modal" @close="avatarOpen = false">
                        <div class="avatar-expanded">
                            <img :src="portrait" alt="" />
                        </div>
                    </BaseModal>

                    <h1 class="hero-heading">Brayden Carlson</h1>

                    <div class="hero-subtitle">
                        <span>Technical Lead</span>
                        <span class="hero-subtitle-dot" />
                        <a
                            href="https://stratusadv.com/"
                            target="_blank"
                            rel="noopener"
                            class="hero-subtitle-link"
                        >Stratus Advanced Technologies</a>
                    </div>

                    <div class="hero-stats">
                        <div class="hero-stat-tile">
                            <span class="hero-stat-num">{{ !loading ? repos : '-' }}{{ !loading ? '+' : '' }}</span>
                            <span class="hero-stat-label">projects</span>
                        </div>
                        <div class="hero-stat-tile">
                            <span class="hero-stat-num">{{ !loading ? stars : '-' }}{{ !loading ? '+' : '' }}</span>
                            <span class="hero-stat-label">stars</span>
                        </div>
                        <div class="hero-stat-tile">
                            <span class="hero-stat-num">{{ !loading ? forks : '-' }}{{ !loading ? '+' : '' }}</span>
                            <span class="hero-stat-label">forks</span>
                        </div>
                    </div>

                    <div class="hero-btns">
                        <a href="#about" class="btn btn-primary hero-btn" @click.prevent="$emit('navigate', 'about')">
                            About Me
                        </a>
                        <router-link to="/resume" class="btn btn-ghost hero-btn">
                            Resume
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import portrait from '@/assets/images/brayden.png';
import BaseModal from '@/components/shared/BaseModal.vue';
import { useAppReady } from '@/composables/useAppReady';
import { useCountUp } from '@/composables/useCountUp';
import { useGithubRepo } from '@/composables/useGithubRepo';

defineEmits<{
    navigate: [hash: string];
}>();

const REVEAL_SETTLE_MS = 1200;

const { loading, stats } = useGithubRepo();
const { ready } = useAppReady();
const avatarOpen = ref(false);
const visible = ref(false);
const settled = ref(false);

const repos = useCountUp(computed(() => stats.value.repos), REVEAL_SETTLE_MS, visible);
const stars = useCountUp(computed(() => stats.value.stars), REVEAL_SETTLE_MS, visible);
const forks = useCountUp(computed(() => stats.value.forks), REVEAL_SETTLE_MS, visible);

function reveal(): void {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            visible.value = true;

            setTimeout(() => {
                settled.value = true;
            }, REVEAL_SETTLE_MS);
        });
    });
}

onMounted(() => {
    if (ready.value) {
        reveal();
        return;
    }

    watch(ready, (value) => {
        if (value) reveal();
    }, { once: true });
});
</script>

<style scoped>
.hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
}

.hero-shell {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    width: min(600px, 92vw);
}

.hero-reveal {
    opacity: 0;
    transform: translateY(60px);
    transition: opacity 1.2s ease, transform 1.2s ease;
}

.hero.visible .hero-reveal {
    opacity: 1;
    transform: translateY(0);
}

.hero-card {
    padding: clamp(28px, 5vw, 36px);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.hero-avatar {
    width: 148px;
    height: 148px;
    margin-bottom: 28px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid rgba(245, 245, 247, 0.06);
    cursor: pointer;
    transition: border-color 0.4s ease;
}

.hero-avatar:hover {
    border-color: rgba(245, 245, 247, 0.12);
}

.hero-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    image-rendering: -webkit-optimize-contrast;
    transition: filter 0.4s ease;
}

.hero-avatar:hover img {
    filter: brightness(1.15);
}

.avatar-expanded {
    width: min(360px, 80vw);
    height: min(360px, 80vw);
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid rgba(245, 245, 247, 0.08);
}

.avatar-expanded img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-heading {
    font-size: clamp(36px, 8vw, 72px);
    font-weight: 600;
    letter-spacing: -0.045em;
    line-height: 1.0;
    color: #f5f5f7;
    margin: 0 0 12px;
    white-space: nowrap;
}

.hero-subtitle {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 400;
    color: var(--text-secondary);
    margin-bottom: 24px;
}

.hero-subtitle-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(245, 245, 247, 0.12);
}

.hero-subtitle-link {
    color: var(--text-secondary);
    text-decoration: none;
    background-image: linear-gradient(#f5f5f7, #f5f5f7);
    background-size: 0% 1px;
    background-position: 0 100%;
    background-repeat: no-repeat;
    transition: background-size 0.5s ease, color 0.3s ease;
}

.hero-subtitle-link:hover {
    background-size: 100% 1px;
    color: #f5f5f7;
}

.hero-stats {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    width: 100%;
    margin-bottom: 28px;
}

.hero-stat-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 22px 8px;
    border-radius: 14px;
    border: 1px solid rgba(245, 245, 247, 0.06);
    background: rgba(255, 255, 255, 0.015);
    transition: background 0.25s ease, border-color 0.25s ease;
    cursor: default;
}

.hero-stat-tile:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(245, 245, 247, 0.12);
}

.hero-stat-num {
    font-family: "Inter", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: #f5f5f7;
    letter-spacing: -0.02em;
}

.hero-stat-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-tertiary);
}

.hero-btns {
    display: flex;
    gap: 8px;
    width: 100%;
}

.hero-btn {
    flex: 1;
    padding: 16px 0;
    border-radius: 12px;
    font-size: 15px;
    letter-spacing: 0.01em;
}

@media (max-width: 640px) {
    .hero-stat-tile {
        padding: 16px 4px;
    }

    .hero-stat-num {
        font-size: 22px;
    }
}

@media (max-width: 420px) {
    .hero-subtitle {
        flex-direction: column;
        gap: 2px;
    }

    .hero-subtitle-dot {
        display: none;
    }
}

@media (min-width: 421px) and (max-width: 520px) {
    .hero-subtitle {
        flex-direction: column;
        gap: 2px;
    }

    .hero-subtitle-dot {
        display: none;
    }
}
</style>
