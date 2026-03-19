<template>
    <section
        ref="element"
        class="section-shell section-shell--flush-bottom"
        :class="{ visible }"
    >
        <div class="section-shell-inner section-shell-inner--narrow section-reveal-inner">
            <h2 class="section-title">Experience</h2>
            <div class="exp-list">
                <div
                    v-for="job in experience"
                    :key="job.title"
                    class="exp-entry"
                >
                    <div class="exp-top">
                        <div>
                            <h3 class="exp-role">{{ job.title }}</h3>
                            <p class="exp-org">{{ job.org }}</p>
                        </div>
                        <span class="exp-date">{{ job.date }}</span>
                    </div>
                    <ul class="exp-points">
                        <li v-for="(point, index) in job.points" :key="index">
                            {{ point }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '@/composables/useScrollReveal';
import { experience } from '@/data/experience';

const { element, visible } = useScrollReveal();
</script>

<style scoped>
.exp-list {
    display: flex;
    flex-direction: column;
}

.exp-entry {
    padding: 48px 0;
    border-top: 1px solid rgba(245, 245, 247, 0.06);
}

.exp-entry:first-child {
    padding-top: 0;
    border-top: none;
}

.exp-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.5rem;
    margin-bottom: 24px;
}

.exp-role {
    font-size: 20px;
    font-weight: 600;
    color: #f5f5f7;
    margin: 0 0 4px;
}

.exp-org {
    font-size: 15px;
    font-weight: 500;
    color: var(--text-secondary);
    margin: 0;
}

.exp-date {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-tertiary);
    white-space: nowrap;
    flex-shrink: 0;
    padding-top: 4px;
}

.exp-points {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 740px;
}

.exp-points li {
    font-size: 16px;
    line-height: 1.7;
    color: var(--text-secondary);
    padding-left: 16px;
    position: relative;
}

.exp-points li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 10px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(245, 245, 247, 0.12);
}

@media (max-width: 640px) {
    .exp-top {
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>
