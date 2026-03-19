<template>
    <section
        ref="element"
        class="section-shell"
        :class="{ visible }"
    >
        <div class="section-shell-inner section-shell-inner--narrow section-reveal-inner">
            <h2 class="section-title">Publications &amp; Conferences</h2>
            <div class="pubs-list">
                <div
                    v-for="(publication, index) in publications"
                    :key="index"
                    class="pubs-row"
                >
                    <span class="pubs-idx">{{ String(index + 1).padStart(2, '0') }}</span>
                    <div class="pubs-content">
                        {{ publication.authors }}
                        <strong>{{ publication.highlight }}</strong>{{ publication.title }}
                        <span class="pub-venue">{{ publication.venue }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '@/composables/useScrollReveal';
import { publications } from '@/data/publication';

const { element, visible } = useScrollReveal();
</script>

<style scoped>
.pubs-list {
    display: flex;
    flex-direction: column;
}

.pubs-row {
    display: flex;
    gap: 1.5rem;
    padding: 28px 0;
    border-top: 1px solid rgba(245, 245, 247, 0.06);
}

.pubs-row:first-child {
    border-top: none;
}

.pubs-idx {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-tertiary);
    flex-shrink: 0;
    padding-top: 2px;
}

.pubs-content {
    font-size: 16px;
    line-height: 1.75;
    color: var(--text-secondary);
}

.pubs-content strong {
    color: #f5f5f7;
    font-weight: 600;
}

.pub-venue {
    font-style: italic;
    color: var(--text-tertiary);
}
</style>
