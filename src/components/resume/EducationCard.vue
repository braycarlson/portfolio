<template>
    <section
        ref="element"
        class="section-shell section-shell--flush-bottom"
        :class="{ visible }"
    >
        <div class="section-shell-inner section-shell-inner--narrow section-reveal-inner">
            <h2 class="section-title">Education</h2>
            <div class="edu-entry">
                <div class="edu-top">
                    <div>
                        <h3 class="edu-degree">Bachelor of Science, Computer Science</h3>
                        <p class="edu-school">University of Lethbridge</p>
                    </div>
                    <span class="edu-date">2020 – 2024</span>
                </div>
                <div class="edu-details">
                    <div class="edu-detail">
                        <span class="edu-detail-key">GPA</span>
                        <span class="edu-detail-val">3.86 / 4.00</span>
                    </div>
                    <div class="edu-detail">
                        <span class="edu-detail-key">Distinction</span>
                        <span class="edu-detail-val">With Great Distinction</span>
                    </div>
                    <div class="edu-detail">
                        <span class="edu-detail-key">Thesis</span>
                        <span class="edu-detail-val">Honours Thesis</span>
                    </div>
                </div>
            </div>
            <div class="edu-entry">
                <div class="edu-top">
                    <div>
                        <h3 class="edu-degree">Diploma, Digital Media and IT</h3>
                        <p class="edu-school">Northern Alberta Institute of Technology</p>
                    </div>
                    <span class="edu-date">2015 – 2017</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '@/composables/useScrollReveal';

const { element, visible } = useScrollReveal();
</script>

<style scoped>
.edu-entry {
    padding-bottom: 48px;
}

.edu-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.5rem;
    margin-bottom: 24px;
}

.edu-degree {
    font-size: 20px;
    font-weight: 600;
    color: #f5f5f7;
    margin: 0 0 4px;
}

.edu-school {
    font-size: 15px;
    font-weight: 500;
    color: var(--text-secondary);
    margin: 0;
}

.edu-date {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-tertiary);
    white-space: nowrap;
    flex-shrink: 0;
    padding-top: 4px;
}

.edu-details {
    display: flex;
    gap: 48px;
}

.edu-detail {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.edu-detail-key {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-tertiary);
}

.edu-detail-val {
    font-size: 16px;
    font-weight: 600;
    color: #f5f5f7;
}

@media (max-width: 640px) {
    .edu-top {
        flex-direction: column;
        gap: 0.5rem;
    }

    .edu-details {
        flex-direction: column;
        gap: 20px;
    }
}
</style>
