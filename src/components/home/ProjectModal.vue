<template>
    <BaseModal :open="!!repo" transition="modal" @close="$emit('close')">
        <button
            class="modal-nav modal-nav-prev"
            :disabled="!hasPrev"
            @click="$emit('prev')"
        >
            <IconArrowLeft />
        </button>

        <div class="modal-card">
            <button class="modal-close" @click="$emit('close')">&times;</button>

            <div class="modal-header">
                <div class="modal-lang" :style="{ color: langColor(repo.language) }">
                    <span class="modal-lang-dot" :style="{ background: langColor(repo.language) }" />
                    {{ repo.language || 'Unknown' }}
                </div>
                <h2 class="modal-name">{{ repo.name }}</h2>
                <p class="modal-desc">{{ repo.description || 'No description provided.' }}</p>
            </div>

            <div class="modal-stats-row">
                <div class="modal-stat-block">
                    <span class="modal-stat-num">{{ repo.stargazers_count }}</span>
                    <span class="modal-stat-label">Stars</span>
                </div>
                <div class="modal-stat-block">
                    <span class="modal-stat-num">{{ repo.forks_count }}</span>
                    <span class="modal-stat-label">Forks</span>
                </div>
                <div class="modal-stat-block">
                    <span class="modal-stat-num">{{ repo.open_issues_count }}</span>
                    <span class="modal-stat-label">Issues</span>
                </div>
                <div class="modal-stat-block">
                    <span class="modal-stat-num">{{ formatSize(repo.size) }}</span>
                    <span class="modal-stat-label">Size</span>
                </div>
            </div>

            <div class="modal-story">
                <p class="modal-story-text">{{ story || 'No description provided.' }}</p>
            </div>

            <div class="modal-footer-meta">
                <div class="modal-footer-cell">
                    <span class="modal-footer-label">License</span>
                    <span class="modal-footer-value">{{ repo.license?.spdx_id || '—' }}</span>
                </div>
                <div class="modal-footer-cell modal-footer-cell-border">
                    <span class="modal-footer-label">Created</span>
                    <span class="modal-footer-value">{{ formatDate(repo.created_at) }}</span>
                </div>
                <div class="modal-footer-cell modal-footer-cell-border">
                    <span class="modal-footer-label">Updated</span>
                    <span class="modal-footer-value">{{ formatDate(repo.updated_at) }}</span>
                </div>
            </div>

            <a
                :href="repo.html_url"
                target="_blank"
                rel="noopener"
                class="modal-github-btn"
            >
                <IconGithub />
                View on GitHub
            </a>
        </div>

        <button
            class="modal-nav modal-nav-next"
            :disabled="!hasNext"
            @click="$emit('next')"
        >
            <IconArrowRight />
        </button>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEventListener } from '@vueuse/core';
import type { Repo } from '@/types/github';
import BaseModal from '@/components/shared/BaseModal.vue';
import IconArrowLeft from '@/components/shared/icons/IconArrowLeft.vue';
import IconArrowRight from '@/components/shared/icons/IconArrowRight.vue';
import IconGithub from '@/components/shared/icons/IconGithub.vue';
import { langColor } from '@/data/languages';
import { PROJECT_META } from '@/data/project';
import { formatDate, formatSize } from '@/utils/format';

const props = defineProps<{
    hasPrev: boolean;
    hasNext: boolean;
    repo: Repo | null;
}>();

const emit = defineEmits<{
    close: [];
    prev: [];
    next: [];
}>();

const story = computed(() => {
    if (!props.repo) return null;
    return PROJECT_META[props.repo.name]?.story || null;
});

useEventListener(window, 'keydown', (event: KeyboardEvent) => {
    if (!props.repo) return;

    if (event.key === 'ArrowLeft' && props.hasPrev) {
        emit('prev');
    } else if (event.key === 'ArrowRight' && props.hasNext) {
        emit('next');
    }
});
</script>

<style scoped>
.modal-nav {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid rgba(245, 245, 247, 0.12);
    background: #0d0d12;
    color: rgba(245, 245, 247, 0.6);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 16px;
    transition: all 0.2s ease;
}

.modal-nav:hover:not(:disabled) {
    border-color: rgba(245, 245, 247, 0.25);
    color: #f5f5f7;
}

.modal-nav:disabled {
    opacity: 0.15;
    cursor: default;
}

.modal-card {
    position: relative;
    width: min(580px, 100%);
    border-radius: 24px;
    background: #0d0d12;
    border: 1px solid rgba(245, 245, 247, 0.12);
    padding: 44px;
    cursor: default;
}

.modal-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: rgba(245, 245, 247, 0.28);
    font-size: 22px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s ease;
}

.modal-close:hover {
    color: #f5f5f7;
}

.modal-header {
    margin-bottom: 28px;
}

.modal-lang {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 16px;
}

.modal-lang-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.modal-name {
    font-size: 34px;
    font-weight: 600;
    letter-spacing: -0.03em;
    color: #f5f5f7;
    margin: 0 0 12px;
}

.modal-desc {
    font-size: 16px;
    font-weight: 400;
    line-height: 1.7;
    color: var(--text-secondary);
    margin: 0;
    height: 3.4em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.modal-stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 28px;
}

.modal-stat-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 18px 0;
    height: 64px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(245, 245, 247, 0.06);
}

.modal-stat-num {
    font-family: "Inter", sans-serif;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    color: #f5f5f7;
}

.modal-stat-label {
    font-size: 11px;
    font-weight: 500;
    line-height: 1.2;
    color: var(--text-tertiary);
}

.modal-story {
    padding: 24px 28px;
    border-radius: 16px;
    margin-bottom: 28px;
    background: rgba(255, 255, 255, 0.015);
    border: 1px solid rgba(245, 245, 247, 0.06);
}

.modal-story-text {
    font-size: 15px;
    font-weight: 400;
    line-height: 1.8;
    color: var(--text-secondary);
    margin: 0;
    padding-right: 12px;
    height: 12em;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.06) transparent;
}

.modal-footer-meta {
    display: flex;
    gap: 0;
    margin-bottom: 28px;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(245, 245, 247, 0.06);
}

.modal-footer-cell {
    flex: 1;
    padding: 14px 0;
    height: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: rgba(255, 255, 255, 0.02);
}

.modal-footer-cell-border {
    border-left: 1px solid rgba(245, 245, 247, 0.04);
}

.modal-footer-label {
    font-size: 11px;
    font-weight: 500;
    line-height: 1.2;
    color: var(--text-tertiary);
}

.modal-footer-value {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    color: var(--text-secondary);
}

.modal-github-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 15px 0;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(245, 245, 247, 0.12);
    color: #f5f5f7;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.25s ease, border-color 0.25s ease;
}

.modal-github-btn .icon {
    font-size: 15px;
}

.modal-github-btn:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(245, 245, 247, 0.2);
}

@media (max-width: 600px) {
    .modal-card {
        padding: 1.5rem;
        border-radius: 20px;
    }

    .modal-header {
        margin-bottom: 16px;
    }

    .modal-name {
        font-size: 24px;
        margin-bottom: 6px;
    }

    .modal-desc {
        font-size: 14px;
        height: auto;
        -webkit-line-clamp: 2;
    }

    .modal-stats-row {
        gap: 6px;
        margin-bottom: 14px;
    }

    .modal-stat-block {
        padding: 12px 0;
        border-radius: 10px;
    }

    .modal-stat-num {
        font-size: 15px;
    }

    .modal-story {
        padding: 16px 18px;
        margin-bottom: 14px;
        border-radius: 12px;
    }

    .modal-story-text {
        font-size: 13px;
        line-height: 1.6;
        height: 8em;
    }

    .modal-footer-meta {
        margin-bottom: 14px;
    }

    .modal-footer-cell {
        padding: 10px 0;
    }

    .modal-footer-value {
        font-size: 12px;
    }

    .modal-github-btn {
        padding: 12px 0;
        font-size: 14px;
    }

    .modal-close {
        top: 12px;
        right: 12px;
        width: 28px;
        height: 28px;
        font-size: 14px;
    }

    .modal-nav {
        display: none;
    }
}
</style>

<style>
.modal-enter-active {
    transition: opacity 0.4s ease;
}

.modal-enter-active .modal-card {
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                opacity 0.4s ease;
}

.modal-enter-active .modal-nav {
    transition: opacity 0.4s ease 0.15s;
}

.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-leave-active .modal-card {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-leave-active .modal-nav {
    transition: opacity 0.15s ease;
}

.modal-enter-from {
    opacity: 0;
}

.modal-enter-from .modal-card {
    opacity: 0;
    transform: translateY(20px);
}

.modal-enter-from .modal-nav {
    opacity: 0;
}

.modal-leave-to {
    opacity: 0;
}

.modal-leave-to .modal-card {
    opacity: 0;
    transform: translateY(8px);
}

.modal-leave-to .modal-nav {
    opacity: 0;
}
</style>
