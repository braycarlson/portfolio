<template>
    <section
        id="projects"
        ref="element"
        class="section-shell"
        :class="{ visible }"
    >
        <div class="section-shell-inner section-shell-inner--wide section-reveal-inner">
            <h2 class="section-lead projects-lead">
                Software I've built, broken,<br class="heading-break" />
                and learned from.
            </h2>

            <div v-if="loading" class="projects-loading">
                <div class="projects-loading-dot" />
                <span>Loading repositories...</span>
            </div>

            <div v-else-if="error" class="projects-error">
                <span>{{ error }}</span>
            </div>

            <template v-else>
                <span class="projects-label">Pinned</span>

                <div class="projects-featured">
                    <ProjectCard
                        v-for="repo in featured"
                        :key="repo.name"
                        :repo="repo"
                        :highlighted="highlighted === repo.name"
                        featured
                        @select="active = repo"
                    />
                </div>

                <div class="projects-divider" />

                <span class="projects-label">All</span>

                <div class="projects-grid">
                    <ProjectCard
                        v-for="repo in page"
                        :key="repo.name"
                        :repo="repo"
                        :highlighted="highlighted === repo.name"
                        @select="active = repo"
                    />
                </div>

                <div v-if="totalPages > 1" class="projects-pagination">
                    <button
                        class="page-btn"
                        :disabled="currentPage === 1"
                        @pointerdown.prevent="currentPage > 1 && currentPage--"
                    >
                        &larr;
                    </button>
                    <button
                        v-for="pageNumber in pageNumbers"
                        :key="pageNumber"
                        class="page-btn"
                        :class="{ 'page-btn-active': pageNumber === currentPage, 'page-btn-ellipsis': pageNumber < 0 }"
                        :disabled="pageNumber < 0"
                        @pointerdown.prevent="pageNumber > 0 && (currentPage = pageNumber)"
                    >
                        {{ pageNumber > 0 ? pageNumber : '...' }}
                    </button>
                    <button
                        class="page-btn"
                        :disabled="currentPage === totalPages"
                        @pointerdown.prevent="currentPage < totalPages && currentPage++"
                    >
                        &rarr;
                    </button>
                </div>
            </template>

            <div class="projects-github">
                <a
                    href="https://github.com/braycarlson"
                    target="_blank"
                    rel="noopener"
                    class="projects-github-link"
                >
                    <IconGithub />
                    View all on GitHub
                </a>
            </div>
        </div>

        <ProjectModal
            :repo="active"
            :has-prev="activeIndex > 0"
            :has-next="activeIndex < all.length - 1"
            @close="active = null"
            @prev="navigate(-1)"
            @next="navigate(1)"
        />
    </section>
</template>

<script setup lang="ts">
import ProjectCard from '@/components/home/ProjectCard.vue';
import ProjectModal from '@/components/home/ProjectModal.vue';
import IconGithub from '@/components/shared/icons/IconGithub.vue';
import { useProjectHighlight } from '@/composables/useProjectHighlight';
import { useProjectList } from '@/composables/useProjectList';
import { useScrollReveal } from '@/composables/useScrollReveal';

const { element, visible } = useScrollReveal('-150px', 800);
const { highlighted } = useProjectHighlight();

const {
    active,
    activeIndex,
    all,
    currentPage,
    error,
    featured,
    loading,
    navigate,
    page,
    pageNumbers,
    totalPages,
} = useProjectList();
</script>

<style scoped>
.projects-lead {
    margin-bottom: 72px;
}

.projects-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--text-tertiary);
    margin-bottom: 16px;
}

.projects-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 4rem 0;
    font-size: 15px;
    color: var(--text-tertiary);
}

.projects-loading-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(245, 245, 247, 0.28);
    animation: loadPulse 1.2s ease-in-out infinite;
}

@keyframes loadPulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.4); }
}

.projects-error {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
    font-size: 15px;
    color: var(--text-tertiary);
}

.projects-featured {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
}

.projects-divider {
    height: 1px;
    background: rgba(245, 245, 247, 0.06);
    margin: 56px 0;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 200px;
    min-height: calc(2 * 200px + 1 * 6px);
    gap: 6px;
    overflow-anchor: none;
}

.projects-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin-top: 56px;
}

.page-btn {
    min-width: 40px;
    height: 40px;
    padding: 0 8px;
    border-radius: 10px;
    background: none;
    border: 1px solid rgba(245, 245, 247, 0.06);
    color: var(--text-tertiary);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: manipulation;
    user-select: none;
    -webkit-user-select: none;
}

.page-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.04);
    color: #f5f5f7;
}

.page-btn:disabled {
    opacity: 0.25;
    cursor: default;
}

.page-btn-active {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(245, 245, 247, 0.12);
    color: #f5f5f7;
}

.page-btn-active:hover {
    background: rgba(255, 255, 255, 0.08) !important;
    border-color: rgba(245, 245, 247, 0.15) !important;
    color: #f5f5f7 !important;
}

.page-btn-ellipsis {
    border: none;
    background: none;
    opacity: 0.3;
}

.projects-github {
    display: flex;
    justify-content: center;
    margin-top: 24px;
}

.projects-github-link {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-tertiary);
    text-decoration: none;
    background-image: linear-gradient(#f5f5f7, #f5f5f7);
    background-size: 0% 1px;
    background-position: 0 100%;
    background-repeat: no-repeat;
    transition: background-size 0.5s ease, color 0.3s ease;
}

.projects-github-link .icon {
    font-size: 15px;
}

.projects-github-link:hover {
    background-size: 100% 1px;
    color: #f5f5f7;
}

@media (max-width: 900px) {
    .projects-featured {
        grid-template-columns: repeat(2, 1fr);
    }

    .projects-grid {
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: 200px;
        min-height: calc(3 * 200px + 2 * 6px);
    }
}

@media (max-width: 600px) {
    .projects-featured {
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: auto;
    }

    .projects-grid {
        grid-template-columns: 1fr;
        grid-auto-rows: 200px;
        min-height: calc(6 * 200px + 5 * 6px);
    }
}

@media (max-width: 420px) {
    .projects-featured {
        grid-template-columns: 1fr;
    }
}
</style>
