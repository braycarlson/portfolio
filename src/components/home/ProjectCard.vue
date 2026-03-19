<template>
    <div
        class="project-card"
        :class="{
            'project-card-featured': featured,
            'project-card-highlighted': highlighted,
        }"
        @click="$emit('select')"
    >
        <div class="project-card-inner">
            <div class="project-card-top">
                <div class="project-lang" :style="{ color: langColor(repo.language) }">
                    <span class="project-lang-dot" :style="{ background: langColor(repo.language) }" />
                    {{ repo.language || (featured ? 'Unknown' : '—') }}
                </div>
                <a
                    :href="repo.html_url"
                    target="_blank"
                    rel="noopener"
                    class="project-link"
                    @click.stop
                >
                    <IconGithub />
                </a>
            </div>
            <h3 :class="featured ? 'project-name' : 'project-name-sm'">
                {{ repo.name }}
            </h3>
            <p
                :class="featured
                    ? 'project-desc project-desc-clamped'
                    : 'project-desc-sm project-desc-sm-clamped'"
            >
                {{ repo.description || 'No description' }}
            </p>
            <div class="project-meta">
                <span v-if="repo.stargazers_count" class="project-stat">
                    <IconStar />
                    {{ repo.stargazers_count }}
                </span>
                <span v-if="repo.forks_count" class="project-stat">
                    <IconFork />
                    {{ repo.forks_count }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Repo } from '@/types/github';
import IconFork from '@/components/shared/icons/IconFork.vue';
import IconGithub from '@/components/shared/icons/IconGithub.vue';
import IconStar from '@/components/shared/icons/IconStar.vue';
import { langColor } from '@/data/languages';

defineProps<{
    featured?: boolean;
    highlighted?: boolean;
    repo: Repo;
}>();

defineEmits<{
    select: [];
}>();
</script>

<style scoped>
.project-card {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid rgba(245, 245, 247, 0.06);
    background: rgba(255, 255, 255, 0.01);
    transition: background 0.25s ease, border-color 0.25s ease;
    cursor: pointer;
    min-height: 0;
}

.project-card:hover {
    background: rgba(255, 255, 255, 0.025);
    border-color: rgba(245, 245, 247, 0.12);
}

.project-card-highlighted {
    border-color: transparent;
}

.project-card-highlighted::before {
    content: '';
    position: absolute;
    width: 60px;
    height: 2px;
    border-radius: 2px;
    background: radial-gradient(
        circle,
        rgba(245, 245, 247, 0.6) 0%,
        rgba(245, 245, 247, 0.2) 40%,
        transparent 100%
    );
    box-shadow:
        0 0 6px rgba(245, 245, 247, 0.15),
        0 0 14px rgba(245, 245, 247, 0.06);
    offset-path: inset(0 round 16px);
    animation: trace 1.5s ease-in-out forwards;
    pointer-events: none;
    z-index: 10;
}

@keyframes trace {
    0% {
        offset-distance: 0%;
        opacity: 0;
    }
    5% {
        opacity: 1;
    }
    80% {
        opacity: 1;
    }
    100% {
        offset-distance: 100%;
        opacity: 0;
    }
}

.project-card-inner {
    padding: 28px;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.project-card-featured .project-card-inner {
    padding: 28px;
}

.project-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.project-lang {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.02em;
}

.project-lang-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.project-link {
    color: rgba(245, 245, 247, 0.12);
    text-decoration: none;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    transition: color 0.3s ease;
}

.project-link:hover {
    color: #f5f5f7;
}

.project-name {
    font-size: 20px;
    font-weight: 600;
    color: #f5f5f7;
    margin: 0 0 8px;
}

.project-name-sm {
    font-size: 17px;
    font-weight: 600;
    color: #f5f5f7;
    margin: 0 0 8px;
}

.project-desc {
    font-size: 14.5px;
    font-weight: 400;
    line-height: 1.65;
    color: var(--text-secondary);
    margin: 0;
}

.project-desc-clamped {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.project-desc-sm {
    font-size: 13.5px;
    font-weight: 400;
    line-height: 1.65;
    color: var(--text-secondary);
    margin: 0;
}

.project-desc-sm-clamped {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.project-meta {
    display: flex;
    gap: 16px;
    margin-top: auto;
    padding-top: 16px;
}

.project-stat {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-tertiary);
}

.project-stat .icon {
    font-size: 14px;
}
</style>
