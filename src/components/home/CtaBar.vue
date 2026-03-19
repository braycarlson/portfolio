<template>
    <section
        ref="element"
        class="section-shell"
        :class="{ visible }"
    >
        <div class="section-shell-inner section-shell-inner--wide section-reveal-inner">
            <div class="cta-panel">
                <h3 class="section-lead cta-heading">Let's build together.</h3>
                <div class="cta-left">
                    <div class="cta-body">
                        <p class="body-text">
                            I'm always interested in meaningful collaboration —
                            whether it's contributing to an open-source project,
                            tackling a technical challenge, or exploring an idea
                            that's too ambitious for one person.
                        </p>
                        <p class="body-text">
                            If you're working on something interesting and could
                            use someone who cares about the craft as much as
                            the outcome, I'd like to hear about it.
                        </p>
                        <p class="body-text">
                            I don't just want to contribute — I want to
                            understand the problem, care about the people
                            using it, and leave the codebase better than
                            I found it.
                        </p>
                    </div>
                    <div class="cta-btns">
                        <a :href="mailto" class="btn btn-primary" @click.prevent="openMail">
                            Get in Touch
                            <span class="cta-arrow">&rarr;</span>
                        </a>
                        <router-link to="/resume" class="btn btn-ghost">
                            View Resume
                        </router-link>
                    </div>
                </div>
                <div class="cta-right">
                    <div class="cta-links">
                        <a
                            href="https://github.com/braycarlson"
                            target="_blank"
                            rel="noopener"
                            class="cta-link"
                        >
                            <div class="cta-link-label">GitHub</div>
                            <div class="cta-link-content">
                                <IconGithub class="cta-link-icon" />
                                <span class="cta-link-handle">braycarlson</span>
                            </div>
                        </a>
                        <a
                            href="https://github.com/braydencstratusadv"
                            target="_blank"
                            rel="noopener"
                            class="cta-link"
                        >
                            <div class="cta-link-label">GitHub</div>
                            <div class="cta-link-content">
                                <IconGithub class="cta-link-icon" />
                                <span class="cta-link-handle">braydencstratus</span>
                            </div>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/braycarlson"
                            target="_blank"
                            rel="noopener"
                            class="cta-link"
                        >
                            <div class="cta-link-label">LinkedIn</div>
                            <div class="cta-link-content">
                                <IconLinkedIn class="cta-link-icon" />
                                <span class="cta-link-handle">braycarlson</span>
                            </div>
                        </a>
                        <a
                            :href="mailto"
                            class="cta-link"
                            @click.prevent="openMail"
                        >
                            <div class="cta-link-label">Email</div>
                            <div class="cta-link-content">
                                <IconEmail class="cta-link-icon" />
                                <span class="cta-link-handle">{{ email }}</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import IconEmail from '@/components/shared/icons/IconEmail.vue';
import IconGithub from '@/components/shared/icons/IconGithub.vue';
import IconLinkedIn from '@/components/shared/icons/IconLinkedIn.vue';
import { useScrollReveal } from '@/composables/useScrollReveal';
import { assert } from '@/utils/assert';

const { element, visible } = useScrollReveal();

const parts = ['braycarlson', 'hotmail', 'com'];
const email = computed(() => `${parts[0]}@${parts[1]}.${parts[2]}`);
const mailto = computed(() => `mailto:${email.value}`);

function openMail(): void {
    assert(mailto.value.startsWith('mailto:'), 'openMail constructed an invalid mailto URL');
    window.location.href = mailto.value;
}
</script>

<style scoped>
.cta-panel {
    display: grid;
    grid-template-columns: 1fr 280px;
    align-items: start;
    gap: 0 80px;
}

.cta-heading {
    grid-column: 1 / -1;
    margin-bottom: 48px;
    max-width: 700px;
}

.cta-body {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 40px;
}

.cta-btns {
    display: flex;
    gap: 10px;
}

.cta-right {
    display: flex;
    flex-direction: column;
}

.cta-links {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.cta-link {
    display: flex;
    flex-direction: column;
    text-decoration: none;
}

.cta-link-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-tertiary);
    margin-bottom: 4px;
}

.cta-link-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

.cta-link-icon {
    font-size: 16px;
    color: var(--text-tertiary);
    transition: color 0.3s ease;
}

.cta-link:hover .cta-link-icon {
    color: #f5f5f7;
}

.cta-link-handle {
    font-size: 14px;
    font-weight: 500;
    color: #f5f5f7;
    background-image: linear-gradient(#f5f5f7, #f5f5f7);
    background-size: 0% 1px;
    background-position: 0 100%;
    background-repeat: no-repeat;
    transition: background-size 0.5s ease;
}

.cta-link:hover .cta-link-handle {
    background-size: 100% 1px;
}

@media (max-width: 768px) {
    .cta-panel {
        grid-template-columns: 1fr;
    }

    .cta-right {
        padding-top: 2rem;
    }

    .cta-btns {
        flex-direction: column;
    }
}
</style>
