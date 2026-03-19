<template>
    <section
        ref="element"
        class="section-shell section-shell--flush-bottom"
        :class="{ visible }"
    >
        <div class="section-shell-inner section-shell-inner--narrow section-reveal-inner">
            <h2 class="section-title">Skills &amp; Technologies</h2>
            <div class="skills-grid">
                <div
                    v-for="group in skills"
                    :key="group.category"
                    class="skills-group"
                >
                    <span class="skills-cat">{{ group.category }}</span>
                    <div class="skills-tags">
                        <component
                            :is="skill.url ? 'a' : 'span'"
                            v-for="skill in group.items"
                            :key="skill.name"
                            v-bind="skill.url ? { href: skill.url, target: '_blank', rel: 'noopener' } : {}"
                            class="skills-tag"
                            :class="{ 'skills-tag-link': skill.url }"
                        >
                            {{ skill.name }}
                        </component>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '@/composables/useScrollReveal';
import { skills } from '@/data/skill';

const { element, visible } = useScrollReveal();
</script>

<style scoped>
.skills-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px 48px;
}

.skills-group {
    display: flex;
    flex-direction: column;
}

.skills-cat {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-tertiary);
    margin-bottom: 14px;
}

.skills-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.skills-tag {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
    padding: 6px 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(245, 245, 247, 0.06);
    text-decoration: none;
}

.skills-tag-link:hover {
    color: #f5f5f7;
    border-color: rgba(245, 245, 247, 0.12);
    background: rgba(255, 255, 255, 0.04);
    opacity: 1;
}

@media (max-width: 768px) {
    .skills-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 500px) {
    .skills-grid {
        grid-template-columns: 1fr;
    }
}
</style>
